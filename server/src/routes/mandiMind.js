import express from 'express';
import { analyzeBestMandi } from '../controllers/mandiMindController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/analyze', protect, analyzeBestMandi);

export default router;