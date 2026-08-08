// src/routes/voiceRoutes.js
import express from 'express';
import { processVoiceQuery } from '../controllers/voiceController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/ask', protect, processVoiceQuery);

export default router;