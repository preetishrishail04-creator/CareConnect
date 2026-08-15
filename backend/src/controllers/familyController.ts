import { Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const inviteParent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { parentEmail, permissionLevel } = req.body;
    const familyMemberId = req.user!.userId;

    if (!parentEmail) {
      return res.status(400).json({ success: false, message: 'Parent email is required' });
    }

    const parentUser = await prisma.user.findUnique({
      where: { email: parentEmail },
      include: { parentProfile: true },
    });

    if (!parentUser || parentUser.role !== 'PARENT' || !parentUser.parentProfile) {
      return res.status(404).json({ success: false, message: 'No registered parent found with this email address.' });
    }

    const existingConn = await prisma.familyConnection.findUnique({
      where: {
        familyMemberId_parentProfileId: {
          familyMemberId,
          parentProfileId: parentUser.parentProfile.id,
        },
      },
    });

    if (existingConn) {
      return res.status(400).json({ success: false, message: 'Connection or invitation already exists for this parent.' });
    }

    const connection = await prisma.familyConnection.create({
      data: {
        familyMemberId,
        parentProfileId: parentUser.parentProfile.id,
        permissionLevel: permissionLevel || 'FULL_ACCESS',
        status: 'PENDING',
      },
    });

    // Notify Parent
    await prisma.notification.create({
      data: {
        userId: parentUser.id,
        type: 'FAMILY_INVITE',
        title: 'New Family Connection Request',
        message: `${req.user!.name || 'A family member'} wants to connect with you on CareConnect.`,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Invitation sent to parent successfully.',
      data: connection,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to send invitation', error: error.message });
  }
};

export const respondToInvite = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { connectionId, accept } = req.body;
    const parentUserId = req.user!.userId;

    const parentProfile = await prisma.parentProfile.findUnique({ where: { userId: parentUserId } });
    if (!parentProfile) {
      return res.status(403).json({ success: false, message: 'Parent profile not found' });
    }

    const connection = await prisma.familyConnection.findFirst({
      where: { id: connectionId, parentProfileId: parentProfile.id },
    });

    if (!connection) {
      return res.status(404).json({ success: false, message: 'Connection invitation not found' });
    }

    const newStatus = accept ? 'ACCEPTED' : 'REJECTED';
    const updated = await prisma.familyConnection.update({
      where: { id: connection.id },
      data: { status: newStatus },
    });

    // Notify family member
    await prisma.notification.create({
      data: {
        userId: connection.familyMemberId,
        type: 'FAMILY_INVITE',
        title: `Invitation ${newStatus.toLowerCase()}`,
        message: `Your connection request was ${newStatus.toLowerCase()} by parent.`,
      },
    });

    return res.json({ success: true, message: `Invitation ${newStatus.toLowerCase()} successfully`, data: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to respond to invitation', error: error.message });
  }
};

export const getFamilyConnections = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const role = req.user!.role;

    if (role === 'FAMILY_MEMBER') {
      const connections = await prisma.familyConnection.findMany({
        where: { familyMemberId: userId, status: 'ACCEPTED' },
        include: {
          parent: {
            include: {
              user: { select: { id: true, name: true, email: true, phone: true } },
            },
          },
        },
      });
      return res.json({ success: true, data: connections });
    } else if (role === 'PARENT') {
      const parentProfile = await prisma.parentProfile.findUnique({ where: { userId } });
      if (!parentProfile) return res.json({ success: true, data: [] });

      const connections = await prisma.familyConnection.findMany({
        where: { parentProfileId: parentProfile.id },
        include: {
          familyMember: { select: { id: true, name: true, email: true, phone: true } },
        },
      });
      return res.json({ success: true, data: connections });
    } else {
      return res.status(403).json({ success: false, message: 'Unauthorized role for connections' });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve family connections', error: error.message });
  }
};
