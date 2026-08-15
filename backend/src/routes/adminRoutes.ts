import { Router } from 'express';
import {
  getAdminStats,
  getUsers,
  toggleUserStatus,
  verifyCaregiver,
} from '../controllers/adminController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.use(authenticate, authorizeRoles('ADMIN'));

router.get('/stats', getAdminStats);
router.get('/users', getUsers);
router.put('/users/:id/status', toggleUserStatus);
router.put('/caregivers/:id/verify', verifyCaregiver);

export default router;
