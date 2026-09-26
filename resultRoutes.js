import express from 'express';
import { resultController } from '../controllers/resultController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/my', authenticate, resultController.getStudentResults);
router.get('/student/:studentId', authenticate, resultController.getStudentResults);
router.post('/publish', authenticate, authorize('exam_cell', 'super_admin', 'admin', 'principal'), resultController.publishResult);

export default router;

