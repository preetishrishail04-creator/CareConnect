import { Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const getEmergencyContacts = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { parentProfileId } = req.query;
    const userId = req.user!.userId;
    const role = req.user!.role;

    let targetParentId = parentProfileId as string;

    if (role === 'PARENT') {
      const parentProfile = await prisma.parentProfile.findUnique({ where: { userId } });
      if (!parentProfile) return res.json({ success: true, data: [] });
      targetParentId = parentProfile.id;
    }

    const filter = targetParentId ? { parentProfileId: targetParentId } : {};

    const contacts = await prisma.emergencyContact.findMany({
      where: filter,
      orderBy: { priority: 'asc' },
    });

    return res.json({ success: true, data: contacts });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve emergency contacts', error: error.message });
  }
};

export const addEmergencyContact = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { parentProfileId, name, relationship, phone, priority } = req.body;
    const userId = req.user!.userId;

    if (!parentProfileId || !name || !relationship || !phone) {
      return res.status(400).json({ success: false, message: 'Parent ID, Contact Name, Relationship, and Phone are required.' });
    }

    const contact = await prisma.emergencyContact.create({
      data: {
        parentProfileId,
        name,
        relationship,
        phone,
        priority: priority ? parseInt(priority) : 1,
      },
    });

    await prisma.activityLog.create({
      data: {
        parentProfileId,
        actorId: userId,
        action: 'EMERGENCY_CONTACT_ADDED',
        details: `Added emergency contact: ${name} (${relationship}) - ${phone}`,
      },
    });

    return res.status(201).json({ success: true, message: 'Emergency contact added', data: contact });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to add emergency contact', error: error.message });
  }
};

export const triggerEmergencyAlert = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { location, notes } = req.body;
    const userId = req.user!.userId;
    const role = req.user!.role;

    let parentProfileId: string | null = null;
    let parentName = req.user!.name || 'Parent';

    if (role === 'PARENT') {
      const parentProfile = await prisma.parentProfile.findUnique({ where: { userId } });
      if (!parentProfile) {
        return res.status(403).json({ success: false, message: 'Parent profile missing' });
      }
      parentProfileId = parentProfile.id;
    } else if (req.body.parentProfileId) {
      parentProfileId = req.body.parentProfileId;
      const p = await prisma.parentProfile.findUnique({
        where: { id: parentProfileId as string },
        include: { user: true },
      });
      if (p) parentName = p.user.name;
    }

    if (!parentProfileId) {
      return res.status(400).json({ success: false, message: 'Parent profile reference is required to trigger emergency alert.' });
    }

    const alertLocation = location || 'Parent Registered Address / Geolocation Attached';
    const alert = await prisma.emergencyAlert.create({
      data: {
        parentProfileId,
        triggeredById: userId,
        status: 'ACTIVE',
        location: alertLocation,
        notes: notes || 'Immediate Assistance Requested by Parent',
      },
    });

    // Activity Log
    await prisma.activityLog.create({
      data: {
        parentProfileId,
        actorId: userId,
        action: 'EMERGENCY_ALERT_TRIGGERED',
        details: `🚨 EMERGENCY ALERT TRIGGERED! Location: ${alert.location}`,
      },
    });

    // Notify all connected family members & admins
    const connections = await prisma.familyConnection.findMany({
      where: { parentProfileId, status: 'ACCEPTED' },
    });

    for (const conn of connections) {
      await prisma.notification.create({
        data: {
          userId: conn.familyMemberId,
          type: 'EMERGENCY_ALERT',
          title: '🚨 EMERGENCY ALERT!',
          message: `CRITICAL ALERT: ${parentName} has triggered an emergency request! Please respond immediately.`,
          linkUrl: `/dashboard?alertId=${alert.id}`,
        },
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Emergency alert triggered. Connected family members have been notified.',
      data: alert,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to trigger emergency alert', error: error.message });
  }
};

export const getEmergencyAlerts = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { parentProfileId } = req.query;
    const userId = req.user!.userId;
    const role = req.user!.role;

    if (role === 'PARENT') {
      const parentProfile = await prisma.parentProfile.findUnique({ where: { userId } });
      if (!parentProfile) return res.json({ success: true, data: [] });

      const alerts = await prisma.emergencyAlert.findMany({
        where: { parentProfileId: parentProfile.id },
        orderBy: { createdAt: 'desc' },
      });
      return res.json({ success: true, data: alerts });
    }

    let filter: any = {};
    if (role === 'FAMILY_MEMBER') {
      const connections = await prisma.familyConnection.findMany({
        where: { familyMemberId: userId, status: 'ACCEPTED' },
      });
      const parentIds = connections.map((c) => c.parentProfileId);
      filter = { parentProfileId: { in: parentIds } };
    } else if (parentProfileId) {
      filter = { parentProfileId: parentProfileId as string };
    }

    const alerts = await prisma.emergencyAlert.findMany({
      where: filter,
      include: {
        parent: { include: { user: { select: { name: true, phone: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, data: alerts });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch emergency alerts', error: error.message });
  }
};

export const acknowledgeEmergencyAlert = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const alert = await prisma.emergencyAlert.update({
      where: { id },
      data: {
        status: 'ACKNOWLEDGED',
        acknowledgedByUserId: userId,
      },
      include: { parent: true },
    });

    await prisma.activityLog.create({
      data: {
        parentProfileId: alert.parentProfileId,
        actorId: userId,
        action: 'EMERGENCY_ALERT_ACKNOWLEDGED',
        details: `Emergency alert acknowledged by ${req.user!.name}`,
      },
    });

    return res.json({ success: true, message: 'Emergency alert acknowledged', data: alert });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to acknowledge emergency alert', error: error.message });
  }
};

export const resolveEmergencyAlert = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const alert = await prisma.emergencyAlert.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        resolvedByUserId: userId,
        resolvedAt: new Date(),
      },
    });

    await prisma.activityLog.create({
      data: {
        parentProfileId: alert.parentProfileId,
        actorId: userId,
        action: 'EMERGENCY_ALERT_RESOLVED',
        details: `Emergency alert marked as resolved by ${req.user!.name}`,
      },
    });

    return res.json({ success: true, message: 'Emergency alert marked as resolved', data: alert });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to resolve emergency alert', error: error.message });
  }
};
