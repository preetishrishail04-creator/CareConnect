import { Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const createCheckIn = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { mood, notes } = req.body; // GOOD, OKAY, NOT_GOOD, NEED_HELP
    const userId = req.user!.userId;

    if (!mood) {
      return res.status(400).json({ success: false, message: 'Check-in mood selection is required.' });
    }

    const parentProfile = await prisma.parentProfile.findUnique({ where: { userId } });
    if (!parentProfile) {
      return res.status(403).json({ success: false, message: 'Parent profile not found for user.' });
    }

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const checkIn = await prisma.checkIn.create({
      data: {
        parentProfileId: parentProfile.id,
        mood: mood.toUpperCase(),
        notes: notes || null,
        date: dateStr,
        time: timeStr,
      },
    });

    // Record activity log
    await prisma.activityLog.create({
      data: {
        parentProfileId: parentProfile.id,
        actorId: userId,
        action: 'DAILY_CHECKIN',
        details: `Submitted daily check-in status: ${mood.toUpperCase()}${notes ? ` ("${notes}")` : ''}`,
      },
    });

    // Notify connected family members
    const connections = await prisma.familyConnection.findMany({
      where: { parentProfileId: parentProfile.id, status: 'ACCEPTED' },
    });

    const parentName = req.user!.name || 'Your parent';
    const isEmergency = mood.toUpperCase() === 'NEED_HELP';

    for (const conn of connections) {
      await prisma.notification.create({
        data: {
          userId: conn.familyMemberId,
          type: isEmergency ? 'NEED_HELP_CHECKIN' : 'CHECKIN_REMINDER',
          title: isEmergency ? '🚨 Immediate Help Requested!' : 'Daily Check-in Completed',
          message: isEmergency
            ? `${parentName} indicated they NEED HELP during daily check-in! Please check on them.`
            : `${parentName} completed daily check-in (${mood.toUpperCase()}).`,
        },
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Daily check-in recorded successfully.',
      data: checkIn,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to record daily check-in', error: error.message });
  }
};

export const getCheckIns = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { parentProfileId } = req.query;
    const userId = req.user!.userId;
    const role = req.user!.role;

    let targetParentId = parentProfileId as string;

    if (role === 'PARENT') {
      const parentProfile = await prisma.parentProfile.findUnique({ where: { userId } });
      if (!parentProfile) return res.json({ success: true, data: [] });
      targetParentId = parentProfile.id;
    } else if (role === 'FAMILY_MEMBER' && targetParentId) {
      const conn = await prisma.familyConnection.findFirst({
        where: { familyMemberId: userId, parentProfileId: targetParentId, status: 'ACCEPTED' },
      });
      if (!conn) {
        return res.status(403).json({ success: false, message: 'Unauthorized to view check-ins for this parent.' });
      }
    }

    const filter = targetParentId ? { parentProfileId: targetParentId } : {};

    const checkIns = await prisma.checkIn.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' },
      take: 30,
    });

    return res.json({ success: true, data: checkIns });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve check-ins', error: error.message });
  }
};
