import express from 'express';
import multer from 'multer';
import { scanCropDisease, getSampleDiseaseCases } from '../services/diseaseService.js';

const router = express.Router();

// ── Multer: memory storage so we get req.file.buffer ─────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are accepted'), false);
    }
  },
});

// POST /api/disease/scan
// Accepts either:
//   a) multipart/form-data with `image` file field  → real Plant.id scan
//   b) application/json with { cropHint }           → fallback simulation
router.post('/scan', upload.single('image'), async (req, res) => {
  try {
    const cropHint = req.body?.cropHint || 'tomato';

    // Convert uploaded buffer to base64 data-URL for Plant.id API
    let imageBase64 = null;
    if (req.file?.buffer) {
      const mime = req.file.mimetype || 'image/jpeg';
      imageBase64 = `data:${mime};base64,${req.file.buffer.toString('base64')}`;
    }

    const result = await scanCropDisease(imageBase64, cropHint);
    res.json(result);
  } catch (error) {
    console.error('[diseaseRoute] scan error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/disease/sample-cases
router.get('/sample-cases', (_req, res) => {
  res.json({
    success: true,
    samples: getSampleDiseaseCases(),
  });
});

export default router;
