import express from 'express';
import { serviceController } from '../controllers/serviceController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/library/books', authenticate, serviceController.getLibraryBooks);
router.get('/hostel/outpasses', authenticate, serviceController.getHostelOutpasses);
router.post('/hostel/outpasses', authenticate, authorize('student'), serviceController.requestOutpass);
router.get('/transport/routes', authenticate, serviceController.getTransportRoutes);
router.get('/grievances', authenticate, serviceController.getGrievances);
router.post('/grievances', authenticate, serviceController.submitGrievance);
router.get('/events', authenticate, serviceController.getEvents);
router.post('/events/register', authenticate, authorize('student'), serviceController.registerEvent);

export default router;

