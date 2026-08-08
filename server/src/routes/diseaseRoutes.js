import express from 'express';
import { scanCropDisease, getSampleDiseaseCases } from '../services/diseaseService.js';

const router = express.Router();

// POST /api/disease/scan
router.post('/scan', async (req, res) => {
  try {
    const { imageBase64, cropHint } = req.body;
    const result = await scanCropDisease(imageBase64, cropHint || 'tomato');
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/disease/sample-cases
router.get('/sample-cases', (_req, res) => {
  res.json({
    success: true,
    samples: getSampleDiseaseCases()
  });
});

export default router;
