import express from 'express';
import { documentController } from '../controllers/documentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Equal Access for all authenticated members
router.use(authenticate);

router.get('/queue', documentController.getVerificationQueue);
router.get('/history', documentController.getAuditLogs);
router.get('/stats', documentController.getVerificationStats);
router.get('/audit-logs', documentController.getAuditLogs);

export default router;

