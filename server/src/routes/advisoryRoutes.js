import express from 'express';
import { getSmartAdvisory } from '../controllers/advisoryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/smart-plan', protect, getSmartAdvisory);

export default router;