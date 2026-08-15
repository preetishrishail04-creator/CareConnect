import { Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const getMedications = async (req: AuthenticatedRequest, res: Response) => {
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
        return res.status(403).json({ success: false, message: 'Unauthorized access to parent medications' });
      }
    }

    const filter = targetParentId ? { parentProfileId: targetParentId } : {};

    const medications = await prisma.medication.findMany({
      where: filter,
      include: {
        logs: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    return res.json({ success: true, data: medications });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve medications', error: error.message });
  }
};

export const createMedication = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { parentProfileId, name, dosage, timeOfDay, frequency, startDate, endDate, instructions } = req.body;
    const userId = req.user!.userId;

    if (!parentProfileId || !name || !dosage || !timeOfDay) {
      return res.status(400).json({ success: false, message: 'Parent ID, medicine name, dosage, and time of day are required.' });
    }

    // Verify ownership/connection authorization
    if (req.user!.role === 'FAMILY_MEMBER') {
      const conn = await prisma.familyConnection.findFirst({
        where: { familyMemberId: userId, parentProfileId, status: 'ACCEPTED' },
      });
      if (!conn) {
        return res.status(403).json({ success: false, message: 'Not authorized to manage medications for this parent.' });
      }
    }

    const medication = await prisma.medication.create({
      data: {
        parentProfileId,
        name,
        dosage,
        timeOfDay,
        frequency: frequency || 'Every day',
        startDate: startDate || new Date().toISOString().split('T')[0],
        endDate: endDate || null,
        instructions: instructions || null,
        createdById: userId,
      },
    });

    // Create log for today
    await prisma.medicationLog.create({
      data: {
        medicationId: medication.id,
        parentProfileId,
        scheduledTime: timeOfDay,
        status: 'SCHEDULED',
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        parentProfileId,
        actorId: userId,
        action: 'MEDICINE_CREATED',
        details: `Added new medication: ${name} (${dosage} at ${timeOfDay})`,
      },
    });

    return res.status(201).json({ success: true, message: 'Medication reminder created', data: medication });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to create medication', error: error.message });
  }
};

export const updateMedication = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, dosage, timeOfDay, frequency, instructions, startDate, endDate } = req.body;

    const existing = await prisma.medication.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Medication not found' });
    }

    const updated = await prisma.medication.update({
      where: { id },
      data: {
        name: name || existing.name,
        dosage: dosage || existing.dosage,
        timeOfDay: timeOfDay || existing.timeOfDay,
        frequency: frequency || existing.frequency,
        instructions: instructions !== undefined ? instructions : existing.instructions,
        startDate: startDate || existing.startDate,
        endDate: endDate !== undefined ? endDate : existing.endDate,
      },
    });

    return res.json({ success: true, message: 'Medication updated successfully', data: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to update medication', error: error.message });
  }
};

export const deleteMedication = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.medication.delete({ where: { id } });
    return res.json({ success: true, message: 'Medication deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to delete medication', error: error.message });
  }
};

export const markMedicationTaken = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: medicationId } = req.params;
    const { status, notes } = req.body; // status: TAKEN, MISSED, SKIPPED
    const userId = req.user!.userId;

    const medication = await prisma.medication.findUnique({
      where: { id: medicationId },
      include: { parent: true },
    });

    if (!medication) {
      return res.status(404).json({ success: false, message: 'Medication record not found' });
    }

    const logStatus = status || 'TAKEN';

    const log = await prisma.medicationLog.create({
      data: {
        medicationId,
        parentProfileId: medication.parentProfileId,
        scheduledTime: medication.timeOfDay,
        status: logStatus,
        takenAt: logStatus === 'TAKEN' ? new Date() : null,
        notes: notes || null,
      },
    });

    // Record activity log
    await prisma.activityLog.create({
      data: {
        parentProfileId: medication.parentProfileId,
        actorId: userId,
        action: `MEDICINE_${logStatus}`,
        details: `Medication ${medication.name} marked as ${logStatus.toLowerCase()}`,
      },
    });

    // Notify connected family members if parent marked medicine
    if (req.user!.role === 'PARENT') {
      const connections = await prisma.familyConnection.findMany({
        where: { parentProfileId: medication.parentProfileId, status: 'ACCEPTED' },
      });

      for (const conn of connections) {
        await prisma.notification.create({
          data: {
            userId: conn.familyMemberId,
            type: logStatus === 'TAKEN' ? 'MEDICINE_REMINDER' : 'MISSED_MEDICINE',
            title: `Medication Update: ${medication.name}`,
            message: `Parent marked medicine as ${logStatus.toLowerCase()}${notes ? `: "${notes}"` : ''}`,
          },
        });
      }
    }

    return res.json({ success: true, message: `Medication marked as ${logStatus}`, data: log });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to update medication log', error: error.message });
  }
};
