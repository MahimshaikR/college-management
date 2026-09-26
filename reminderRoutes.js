import express from 'express';
import { reminderController } from '../controllers/reminderController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, reminderController.getReminders);
router.post('/', authenticate, reminderController.createReminder);
router.put('/:id', authenticate, reminderController.updateReminder);
router.patch('/:id/toggle', authenticate, reminderController.toggleReminderStatus);
router.delete('/:id', authenticate, reminderController.deleteReminder);

export default router;

