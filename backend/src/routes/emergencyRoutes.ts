import { Router } from 'express';
import {
  getEmergencyContacts,
  addEmergencyContact,
  triggerEmergencyAlert,
  getEmergencyAlerts,
  acknowledgeEmergencyAlert,
  resolveEmergencyAlert,
} from '../controllers/emergencyController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/contacts', getEmergencyContacts);
router.post('/contacts', addEmergencyContact);

router.post('/', triggerEmergencyAlert);
router.get('/', getEmergencyAlerts);
router.put('/:id/acknowledge', acknowledgeEmergencyAlert);
router.put('/:id/resolve', resolveEmergencyAlert);

export default router;
