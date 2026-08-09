// src/routes/voiceRoutes.js
import express from 'express';
import { processVoiceQuery } from '../controllers/voiceController.js';

const router = express.Router();

router.post('/ask', processVoiceQuery);

export default router;