import { Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const getParents = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const role = req.user!.role;

    if (role === 'ADMIN') {
      const parents = await prisma.parentProfile.findMany({
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
          emergencyContacts: true,
        },
      });
      return res.json({ success: true, data: parents });
    }

    if (role === 'FAMILY_MEMBER') {
      const connections = await prisma.familyConnection.findMany({
        where: { familyMemberId: userId, status: 'ACCEPTED' },
        include: {
          parent: {
            include: {
              user: { select: { id: true, name: true, email: true, phone: true } },
              medications: true,
              medicationLogs: {
                orderBy: { createdAt: 'desc' },
                take: 10,
              },
              appointments: {
                where: { status: 'UPCOMING' },
                orderBy: { appointmentDate: 'asc' },
              },
              checkIns: {
                orderBy: { createdAt: 'desc' },
                take: 5,
              },
              emergencyAlerts: {
                where: { status: 'ACTIVE' },
              },
              emergencyContacts: true,
            },
          },
        },
      });

      const parents = connections.map((conn) => ({
        connectionId: conn.id,
        permissionLevel: conn.permissionLevel,
        parentProfile: conn.parent,
      }));

      return res.json({ success: true, data: parents });
    }

    if (role === 'PARENT') {
      const parent = await prisma.parentProfile.findUnique({
        where: { userId },
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
          medications: true,
          appointments: true,
          checkIns: { orderBy: { createdAt: 'desc' }, take: 10 },
          emergencyContacts: true,
        },
      });
      return res.json({ success: true, data: parent ? [parent] : [] });
    }

    return res.status(403).json({ success: false, message: 'Unauthorized access' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch parent profiles', error: error.message });
  }
};

export const getParentById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: parentProfileId } = req.params;
    const userId = req.user!.userId;
    const role = req.user!.role;

    // Check authorization: Admin can access; Family member must be connected with ACCEPTED status; Parent can only access their own profile
    if (role === 'FAMILY_MEMBER') {
      const conn = await prisma.familyConnection.findFirst({
        where: { familyMemberId: userId, parentProfileId, status: 'ACCEPTED' },
      });
      if (!conn) {
        return res.status(403).json({ success: false, message: 'Access denied. You are not connected to this parent.' });
      }
    } else if (role === 'PARENT') {
      const selfParent = await prisma.parentProfile.findUnique({ where: { userId } });
      if (selfParent?.id !== parentProfileId) {
        return res.status(403).json({ success: false, message: 'Access denied to other parent profile.' });
      }
    }

    const parent = await prisma.parentProfile.findUnique({
      where: { id: parentProfileId },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        medications: true,
        medicationLogs: { orderBy: { createdAt: 'desc' }, take: 20 },
        appointments: { orderBy: { appointmentDate: 'asc' } },
        checkIns: { orderBy: { createdAt: 'desc' }, take: 10 },
        careRequests: { orderBy: { createdAt: 'desc' } },
        emergencyContacts: { orderBy: { priority: 'asc' } },
        emergencyAlerts: { orderBy: { createdAt: 'desc' } },
        activityLogs: { orderBy: { createdAt: 'desc' }, take: 20 },
      },
    });

    if (!parent) {
      return res.status(404).json({ success: false, message: 'Parent profile not found' });
    }

    return res.json({ success: true, data: parent });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch parent details', error: error.message });
  }
};
