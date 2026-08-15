import { Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const getAdminStats = async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalParents = await prisma.parentProfile.count();
    const totalFamilyMembers = await prisma.user.count({ where: { role: 'FAMILY_MEMBER' } });
    const totalCaregivers = await prisma.caregiverProfile.count();
    const pendingCaregiverApprovals = await prisma.caregiverProfile.count({ where: { isVerified: false } });
    const activeCareRequests = await prisma.careRequest.count({ where: { status: { in: ['OPEN', 'ACCEPTED', 'IN_PROGRESS'] } } });
    const completedVisits = await prisma.careVisit.count({ where: { status: 'COMPLETED' } });
    const activeEmergencyAlerts = await prisma.emergencyAlert.count({ where: { status: 'ACTIVE' } });

    // User breakdown stats for chart
    const roleStats = [
      { name: 'Family Members', count: totalFamilyMembers },
      { name: 'Parents', count: totalParents },
      { name: 'Caregivers', count: totalCaregivers },
      { name: 'Admins', count: await prisma.user.count({ where: { role: 'ADMIN' } }) },
    ];

    return res.json({
      success: true,
      data: {
        summary: {
          totalUsers,
          totalParents,
          totalFamilyMembers,
          totalCaregivers,
          pendingCaregiverApprovals,
          activeCareRequests,
          completedVisits,
          activeEmergencyAlerts,
        },
        roleStats,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch admin stats', error: error.message });
  }
};

export const getUsers = async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
        parentProfile: { select: { id: true } },
        caregiverProfile: { select: { id: true, isVerified: true, rating: true, completedVisitsCount: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, data: users });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
  }
};

export const toggleUserStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // ACTIVE or SUSPENDED

    const user = await prisma.user.update({
      where: { id },
      data: { status },
      select: { id: true, name: true, email: true, status: true },
    });

    return res.json({ success: true, message: `User status changed to ${status}`, data: user });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to update user status', error: error.message });
  }
};

export const verifyCaregiver = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: caregiverProfileId } = req.params;
    const { isVerified } = req.body;

    const profile = await prisma.caregiverProfile.update({
      where: { id: caregiverProfileId },
      data: { isVerified: Boolean(isVerified) },
      include: { user: { select: { name: true, email: true } } },
    });

    // Send notification to caregiver
    await prisma.notification.create({
      data: {
        userId: profile.userId,
        type: 'SYSTEM',
        title: isVerified ? 'Account Verified!' : 'Verification Status Updated',
        message: isVerified
          ? 'Congratulations! Your caregiver profile has been verified by the CareConnect Admin team.'
          : 'Your caregiver verification status has been updated by Admin.',
      },
    });

    return res.json({
      success: true,
      message: `Caregiver verification updated to ${isVerified ? 'VERIFIED' : 'UNVERIFIED'}`,
      data: profile,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to verify caregiver', error: error.message });
  }
};
