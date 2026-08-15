import { Router } from 'express';
import {
  getMedications,
  createMedication,
  updateMedication,
  deleteMedication,
  markMedicationTaken,
} from '../controllers/medicationController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getMedications);
router.post('/', authorizeRoles('FAMILY_MEMBER', 'ADMIN'), createMedication);
router.put('/:id', authorizeRoles('FAMILY_MEMBER', 'ADMIN'), updateMedication);
router.delete('/:id', authorizeRoles('FAMILY_MEMBER', 'ADMIN'), deleteMedication);
router.post('/:id/taken', markMedicationTaken);

export default router;
