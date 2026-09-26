import express from 'express';
import { notificationController } from '../controllers/notificationController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, notificationController.getNotifications);
router.patch('/read-all', authenticate, (req, res) => notificationController.markAsRead({ ...req, params: { id: 'all' } }, res));
router.patch('/:id/read', authenticate, notificationController.markAsRead);
router.post('/broadcast', authenticate, authorize('admin', 'super_admin', 'principal', 'hod', 'faculty'), notificationController.createNotification);

export default router;

