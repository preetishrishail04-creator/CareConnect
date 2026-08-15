import { Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const getCaregivers = async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const caregivers = await prisma.caregiverProfile.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
      orderBy: { rating: 'desc' },
    });

    return res.json({ success: true, data: caregivers });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch caregiver profiles', error: error.message });
  }
};

export const updateCaregiverProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { location, experienceYears, skills, availabilityStatus, bio } = req.body;
    const userId = req.user!.userId;

    const profile = await prisma.caregiverProfile.findUnique({ where: { userId } });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Caregiver profile not found.' });
    }

    const updated = await prisma.caregiverProfile.update({
      where: { userId },
      data: {
        location: location || profile.location,
        experienceYears: experienceYears ? parseInt(experienceYears) : profile.experienceYears,
        skills: skills || profile.skills,
        availabilityStatus: availabilityStatus || profile.availabilityStatus,
        bio: bio !== undefined ? bio : profile.bio,
      },
    });

    return res.json({ success: true, message: 'Caregiver profile updated successfully', data: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to update caregiver profile', error: error.message });
  }
};

export const createCareRequest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { parentProfileId, requestType, description, preferredDate, preferredTime, location } = req.body;
    const userId = req.user!.userId;
    const role = req.user!.role;

    let targetParentId = parentProfileId;

    if (role === 'PARENT') {
      const parentProfile = await prisma.parentProfile.findUnique({ where: { userId } });
      if (!parentProfile) return res.status(403).json({ success: false, message: 'Parent profile missing' });
      targetParentId = parentProfile.id;
    }

    if (!targetParentId || !requestType || !description || !preferredDate || !preferredTime) {
      return res.status(400).json({
        success: false,
        message: 'Parent ID, Request Type, Description, Date, and Time are required.',
      });
    }

    const careRequest = await prisma.careRequest.create({
      data: {
        parentProfileId: targetParentId,
        requestedById: userId,
        requestType: requestType.toUpperCase(),
        description,
        preferredDate,
        preferredTime,
        location: location || 'Parent Registered Address',
        status: 'OPEN',
      },
    });

    // Log Activity
    await prisma.activityLog.create({
      data: {
        parentProfileId: targetParentId,
        actorId: userId,
        action: 'CARE_REQUEST_CREATED',
        details: `Created non-medical care request: ${requestType} for ${preferredDate} at ${preferredTime}`,
      },
    });

    return res.status(201).json({ success: true, message: 'Care visit request posted successfully', data: careRequest });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to create care request', error: error.message });
  }
};

export const getCareRequests = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const role = req.user!.role;

    if (role === 'CAREGIVER') {
      // Caregiver views all OPEN requests + assigned visits
      const caregiverProfile = await prisma.caregiverProfile.findUnique({ where: { userId } });
      const openRequests = await prisma.careRequest.findMany({
        where: {
          OR: [
            { status: 'OPEN' },
            { visit: { caregiverProfileId: caregiverProfile?.id } },
          ],
        },
        include: {
          parent: { include: { user: { select: { name: true, phone: true } } } },
          visit: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      return res.json({ success: true, data: openRequests });
    } else if (role === 'FAMILY_MEMBER' || role === 'PARENT' || role === 'ADMIN') {
      const { parentProfileId } = req.query;
      const filter = parentProfileId ? { parentProfileId: parentProfileId as string } : {};

      const requests = await prisma.careRequest.findMany({
        where: filter,
        include: {
          parent: { include: { user: { select: { name: true } } } },
          visit: {
            include: {
              caregiver: { include: { user: { select: { name: true, phone: true } } } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return res.json({ success: true, data: requests });
    }

    return res.status(403).json({ success: false, message: 'Unauthorized' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch care requests', error: error.message });
  }
};

export const acceptCareRequest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: careRequestId } = req.params;
    const userId = req.user!.userId;

    const caregiverProfile = await prisma.caregiverProfile.findUnique({ where: { userId } });
    if (!caregiverProfile) {
      return res.status(403).json({ success: false, message: 'Caregiver profile not found' });
    }

    const careRequest = await prisma.careRequest.findUnique({
      where: { id: careRequestId },
      include: { parent: true },
    });

    if (!careRequest || careRequest.status !== 'OPEN') {
      return res.status(400).json({ success: false, message: 'Care request is not open for acceptance.' });
    }

    // Update request status and create visit
    const updatedRequest = await prisma.careRequest.update({
      where: { id: careRequestId },
      data: { status: 'ACCEPTED' },
    });

    const visit = await prisma.careVisit.create({
      data: {
        careRequestId,
        caregiverProfileId: caregiverProfile.id,
        status: 'ACCEPTED',
      },
    });

    // Activity Log
    await prisma.activityLog.create({
      data: {
        parentProfileId: careRequest.parentProfileId,
        actorId: userId,
        action: 'CARE_REQUEST_ACCEPTED',
        details: `Caregiver ${req.user!.name} accepted care request: ${careRequest.requestType}`,
      },
    });

    // Notify family member who requested
    await prisma.notification.create({
      data: {
        userId: careRequest.requestedById,
        type: 'CARE_REQUEST_ACCEPTED',
        title: 'Care Request Accepted!',
        message: `Caregiver ${req.user!.name} has accepted your care request.`,
      },
    });

    return res.json({ success: true, message: 'Care request accepted successfully', data: { request: updatedRequest, visit } });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to accept care request', error: error.message });
  }
};

export const updateVisitStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: visitId } = req.params;
    const { status, notes } = req.body; // ACCEPTED, ON_THE_WAY, ARRIVED, COMPLETED, CANCELLED
    const userId = req.user!.userId;

    const caregiverProfile = await prisma.caregiverProfile.findUnique({ where: { userId } });
    const visit = await prisma.careVisit.findUnique({
      where: { id: visitId },
      include: {
        careRequest: { include: { parent: true } },
      },
    });

    if (!visit) {
      return res.status(404).json({ success: false, message: 'Care visit record not found.' });
    }

    const updatedVisit = await prisma.careVisit.update({
      where: { id: visitId },
      data: {
        status,
        notes: notes || visit.notes,
        startedAt: status === 'ARRIVED' ? new Date() : visit.startedAt,
        completedAt: status === 'COMPLETED' ? new Date() : visit.completedAt,
      },
    });

    // If completed, update request status and caregiver stats
    if (status === 'COMPLETED') {
      await prisma.careRequest.update({
        where: { id: visit.careRequestId },
        data: { status: 'COMPLETED' },
      });

      if (caregiverProfile) {
        await prisma.caregiverProfile.update({
          where: { id: caregiverProfile.id },
          data: { completedVisitsCount: { increment: 1 } },
        });
      }
    }

    // Log Activity
    await prisma.activityLog.create({
      data: {
        parentProfileId: visit.careRequest.parentProfileId,
        actorId: userId,
        action: `CARE_VISIT_${status}`,
        details: `Care visit status updated to ${status}${notes ? ` ("${notes}")` : ''}`,
      },
    });

    // Notify requester
    await prisma.notification.create({
      data: {
        userId: visit.careRequest.requestedById,
        type: status === 'COMPLETED' ? 'CARE_VISIT_COMPLETED' : 'CARE_VISIT_UPDATE',
        title: `Care Visit Update: ${status}`,
        message: `Caregiver updated visit status to ${status.replace('_', ' ')}.`,
      },
    });

    return res.json({ success: true, message: `Visit status updated to ${status}`, data: updatedVisit });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to update visit status', error: error.message });
  }
};
