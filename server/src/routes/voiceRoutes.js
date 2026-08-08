import express from 'express';
import { processVoiceQuery } from '../controllers/voiceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/ask', protect, processVoiceQuery);

export default router;