import { Router } from 'express';
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from '../controllers/appointmentController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getAppointments);
router.post('/', authorizeRoles('FAMILY_MEMBER', 'ADMIN'), createAppointment);
router.put('/:id', authorizeRoles('FAMILY_MEMBER', 'ADMIN'), updateAppointment);
router.delete('/:id', authorizeRoles('FAMILY_MEMBER', 'ADMIN'), deleteAppointment);

export default router;
