import express from 'express';
import { lmsController } from '../controllers/lmsController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/materials', authenticate, lmsController.getStudyMaterials);
router.post('/materials', authenticate, authorize('faculty', 'hod', 'super_admin', 'admin'), upload.single('file'), lmsController.uploadStudyMaterial);

router.get('/courses', authenticate, lmsController.getCourses);
router.post('/courses/progress', authenticate, authorize('student'), lmsController.updateProgress);

router.get('/quizzes', authenticate, lmsController.getQuizzes);
router.post('/quizzes/submit', authenticate, authorize('student'), lmsController.submitQuiz);

router.get('/questions', authenticate, lmsController.getQuestionBank);
router.post('/questions/generate-paper', authenticate, authorize('faculty', 'hod', 'super_admin', 'admin', 'exam_cell'), lmsController.generateQuestionPaper);

export default router;

