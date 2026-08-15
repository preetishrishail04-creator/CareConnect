import { Router } from 'express';
import { getActivityTimeline } from '../controllers/activityController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getActivityTimeline);

export default router;
