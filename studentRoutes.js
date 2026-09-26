import express from 'express';
import { studentController } from '../controllers/studentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, studentController.getStudents);
router.get('/my-day', authenticate, studentController.getMyDay);
router.get('/insights', authenticate, studentController.getInsights);
router.get('/:id', authenticate, studentController.getStudentById);

export default router;

