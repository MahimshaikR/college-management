import express from 'express';
import { skillController } from '../controllers/skillController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public / Authenticated catalog endpoints
router.get('/', authenticate, skillController.getSkills);
router.get('/resources', authenticate, skillController.getResources);
router.get('/recommendations', authenticate, skillController.getRecommendations);
router.get('/:id', authenticate, skillController.getSkillById);

// 30-Day Learning Plan
router.post('/plans/enroll', authenticate, skillController.enrollPlan);
router.get('/plans/my-plans', authenticate, skillController.getUserPlans);
router.patch('/plans/:planId/days/:day', authenticate, skillController.toggleChecklistDay);

// Typing Practice
router.post('/typing/session', authenticate, skillController.saveTypingSession);
router.get('/typing/stats', authenticate, skillController.getTypingStats);

// Study Timer & Pomodoro
router.post('/study/session', authenticate, skillController.logStudySession);
router.get('/study/overview', authenticate, skillController.getStudyOverview);

// Certificates Tracking
router.get('/certificates', authenticate, skillController.getCertificates);
router.post('/certificates', authenticate, skillController.addCertificate);

export default router;

