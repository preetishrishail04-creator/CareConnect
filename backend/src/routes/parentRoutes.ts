import { Router } from 'express';
import { getParents, getParentById } from '../controllers/parentController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getParents);
router.get('/:id', getParentById);

export default router;
