import express from 'express';
import { labExamController } from '../controllers/labExamController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Question bank routes (place before /:id parameter to prevent param collision)
router.get(
  '/question-bank/items',
  authenticate,
  authorize('faculty', 'hod', 'admin', 'principal', 'super_admin'),
  labExamController.getQuestionBank
);

router.post(
  '/question-bank/items',
  authenticate,
  authorize('faculty', 'hod', 'admin', 'principal', 'super_admin'),
  labExamController.createQuestionBankItem
);

router.put(
  '/question-bank/items/:id',
  authenticate,
  authorize('faculty', 'hod', 'admin', 'principal', 'super_admin'),
  labExamController.updateQuestionBankItem
);

router.delete(
  '/question-bank/items/:id',
  authenticate,
  authorize('faculty', 'hod', 'admin', 'principal', 'super_admin'),
  labExamController.deleteQuestionBankItem
);

// Student Exam list
router.get(
  '/student-exams',
  authenticate,
  authorize('student'),
  labExamController.getStudentExams
);

// Faculty/Admin Exam list & creation
router.get(
  '/',
  authenticate,
  authorize('faculty', 'hod', 'admin', 'principal', 'super_admin'),
  labExamController.getAllExams
);

router.post(
  '/',
  authenticate,
  authorize('faculty', 'hod', 'admin', 'principal', 'super_admin'),
  labExamController.createExam
);

// Specific Exam actions
router.get('/:id', authenticate, labExamController.getExamDetails);

router.put(
  '/:id',
  authenticate,
  authorize('faculty', 'hod', 'admin', 'principal', 'super_admin'),
  labExamController.updateExam
);

router.delete(
  '/:id',
  authenticate,
  authorize('faculty', 'hod', 'admin', 'principal', 'super_admin'),
  labExamController.deleteExam
);

router.post(
  '/:id/duplicate',
  authenticate,
  authorize('faculty', 'hod', 'admin', 'principal', 'super_admin'),
  labExamController.duplicateExam
);

router.patch(
  '/:id/status',
  authenticate,
  authorize('faculty', 'hod', 'admin', 'principal', 'super_admin'),
  labExamController.updateExamStatus
);

// Student Exam lifecycle
router.post(
  '/:id/start',
  authenticate,
  authorize('student'),
  labExamController.startExam
);

router.post(
  '/:id/run-code',
  authenticate,
  labExamController.runCode
);

router.post(
  '/:id/save',
  authenticate,
  authorize('student'),
  labExamController.saveDraft
);

router.post(
  '/:id/submit',
  authenticate,
  authorize('student'),
  labExamController.submitExam
);

router.get(
  '/:id/result',
  authenticate,
  authorize('student', 'faculty', 'admin'),
  labExamController.getStudentExamResult
);

// Faculty Examinee Monitoring & Grading
router.get(
  '/:id/monitoring',
  authenticate,
  authorize('faculty', 'hod', 'admin', 'principal', 'super_admin'),
  labExamController.getExamineeMonitoring
);

router.get(
  '/:id/submissions',
  authenticate,
  authorize('faculty', 'hod', 'admin', 'principal', 'super_admin'),
  labExamController.getSubmissions
);

router.post(
  '/:id/submissions/:submissionId/evaluate',
  authenticate,
  authorize('faculty', 'hod', 'admin', 'principal', 'super_admin'),
  labExamController.evaluateSubmission
);

export default router;

