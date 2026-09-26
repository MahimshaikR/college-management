import express from 'express';
import { placementController } from '../controllers/placementController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/jobs', authenticate, placementController.getJobs);
router.post('/apply', authenticate, authorize('student'), placementController.applyToJob);
router.get('/portfolio', authenticate, placementController.getPortfolio);
router.put('/portfolio', authenticate, placementController.updatePortfolio);

export default router;

