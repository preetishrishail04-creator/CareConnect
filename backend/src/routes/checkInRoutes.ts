import { Router } from 'express';
import { createCheckIn, getCheckIns } from '../controllers/checkInController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/', authorizeRoles('PARENT'), createCheckIn);
router.get('/', getCheckIns);

export default router;
