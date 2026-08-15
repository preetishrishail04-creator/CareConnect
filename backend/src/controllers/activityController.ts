import { Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const getActivityTimeline = async (req: AuthenticatedRequest, res: Response) => {
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
        return res.status(403).json({ success: false, message: 'Unauthorized to view activity timeline for this parent.' });
      }
    }

    const filter = targetParentId ? { parentProfileId: targetParentId } : {};

    const activityLogs = await prisma.activityLog.findMany({
      where: filter,
      include: {
        actor: { select: { id: true, name: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return res.json({ success: true, data: activityLogs });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve activity timeline', error: error.message });
  }
};
