import { Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const getAppointments = async (req: AuthenticatedRequest, res: Response) => {
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
        return res.status(403).json({ success: false, message: 'Unauthorized to view appointments for this parent.' });
      }
    }

    const filter = targetParentId ? { parentProfileId: targetParentId } : {};

    const appointments = await prisma.appointment.findMany({
      where: filter,
      orderBy: { appointmentDate: 'asc' },
    });

    return res.json({ success: true, data: appointments });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve appointments', error: error.message });
  }
};

export const createAppointment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { parentProfileId, doctorName, hospitalName, appointmentDate, time, purpose, location, notes } = req.body;
    const userId = req.user!.userId;

    if (!parentProfileId || !doctorName || !hospitalName || !appointmentDate || !time || !purpose) {
      return res.status(400).json({
        success: false,
        message: 'Parent Profile ID, Doctor Name, Hospital/Clinic, Date, Time, and Purpose are required.',
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        parentProfileId,
        doctorName,
        hospitalName,
        appointmentDate,
        time,
        purpose,
        location: location || null,
        notes: notes || null,
        status: 'UPCOMING',
        createdById: userId,
      },
    });

    // Activity Log
    await prisma.activityLog.create({
      data: {
        parentProfileId,
        actorId: userId,
        action: 'APPOINTMENT_CREATED',
        details: `Scheduled appointment with ${doctorName} at ${hospitalName} on ${appointmentDate} at ${time}`,
      },
    });

    // Notify parent if created by family member
    if (req.user!.role === 'FAMILY_MEMBER') {
      const parentProfile = await prisma.parentProfile.findUnique({ where: { id: parentProfileId } });
      if (parentProfile) {
        await prisma.notification.create({
          data: {
            userId: parentProfile.userId,
            type: 'APPOINTMENT_REMINDER',
            title: 'New Doctor Appointment Scheduled',
            message: `Appointment with ${doctorName} at ${hospitalName} scheduled for ${appointmentDate} at ${time}.`,
          },
        });
      }
    }

    return res.status(201).json({ success: true, message: 'Appointment created successfully', data: appointment });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to create appointment', error: error.message });
  }
};

export const updateAppointment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { doctorName, hospitalName, appointmentDate, time, purpose, location, notes, status } = req.body;

    const existing = await prisma.appointment.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        doctorName: doctorName || existing.doctorName,
        hospitalName: hospitalName || existing.hospitalName,
        appointmentDate: appointmentDate || existing.appointmentDate,
        time: time || existing.time,
        purpose: purpose || existing.purpose,
        location: location !== undefined ? location : existing.location,
        notes: notes !== undefined ? notes : existing.notes,
        status: status || existing.status,
      },
    });

    return res.json({ success: true, message: 'Appointment updated successfully', data: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to update appointment', error: error.message });
  }
};

export const deleteAppointment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.appointment.delete({ where: { id } });
    return res.json({ success: true, message: 'Appointment deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to delete appointment', error: error.message });
  }
};
