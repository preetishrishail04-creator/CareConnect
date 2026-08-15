import { Router } from 'express';
import {
  getCaregivers,
  updateCaregiverProfile,
  createCareRequest,
  getCareRequests,
  acceptCareRequest,
  updateVisitStatus,
} from '../controllers/careController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/caregivers', getCaregivers);
router.put('/caregivers/profile', authorizeRoles('CAREGIVER'), updateCaregiverProfile);

router.post('/care-requests', authorizeRoles('FAMILY_MEMBER', 'PARENT', 'ADMIN'), createCareRequest);
router.get('/care-requests', getCareRequests);
router.post('/care-requests/:id/accept', authorizeRoles('CAREGIVER'), acceptCareRequest);
router.put('/care-visits/:id/status', authorizeRoles('CAREGIVER', 'ADMIN'), updateVisitStatus);

export default router;
