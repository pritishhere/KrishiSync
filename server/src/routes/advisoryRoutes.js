// src/routes/advisoryRoutes.js
import express from 'express';
import { getSmartAdvisory } from '../controllers/advisoryController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/smart-plan', protect, getSmartAdvisory);

export default router;