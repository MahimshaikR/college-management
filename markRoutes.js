import express from 'express';
import { markController } from '../controllers/markController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/record', authenticate, authorize('faculty', 'hod', 'super_admin', 'admin', 'exam_cell'), markController.recordMarks);
router.get('/my', authenticate, markController.getStudentMarks);
router.get('/student/:studentId', authenticate, markController.getStudentMarks);

export default router;

