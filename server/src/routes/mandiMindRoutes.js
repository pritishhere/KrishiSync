// src/routes/mandiMindRoutes.js
import express from 'express';
import { analyzeBestMandi, calculateProfitEstimate } from '../controllers/mandiMindController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/analyze', protect, analyzeBestMandi);
router.post('/estimate', calculateProfitEstimate);

export default router;