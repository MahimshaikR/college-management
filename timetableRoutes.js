import express from 'express';
import { timetableController } from '../controllers/timetableController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, timetableController.getTimetable);
router.get('/faculty/:facultyId?', authenticate, timetableController.getFacultyTimetable);
router.post('/auto-generate', authenticate, authorize('hod', 'super_admin', 'admin', 'principal'), timetableController.autoGenerateTimetable);

export default router;

