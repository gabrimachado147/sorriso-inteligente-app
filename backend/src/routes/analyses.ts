import { Router } from 'express';
import { createAnalysis, listAnalyses } from '../controllers/analysisController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticate, createAnalysis);
router.get('/', authenticate, listAnalyses);

export default router;
