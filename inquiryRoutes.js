import express from 'express';
import { inquiryController } from '../controllers/inquiryController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public inquiry submission from website
router.post('/', inquiryController.submitInquiry);

// Protected admin management
router.get('/', authenticate, authorize('admin', 'super_admin', 'principal', 'college_admin'), inquiryController.getInquiries);
router.patch('/:id/status', authenticate, authorize('admin', 'super_admin', 'principal', 'college_admin'), inquiryController.updateInquiryStatus);

export default router;

