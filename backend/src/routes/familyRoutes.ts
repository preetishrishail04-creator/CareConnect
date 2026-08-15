import { Router } from 'express';
import { inviteParent, respondToInvite, getFamilyConnections } from '../controllers/familyController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/invite', authorizeRoles('FAMILY_MEMBER'), inviteParent);
router.post('/respond', authorizeRoles('PARENT'), respondToInvite);
router.get('/connections', getFamilyConnections);

export default router;
