import express from 'express';
import { getIrrigationAdvisory, getSupportedCrops } from '../services/irrigationService.js';

const router = express.Router();

// GET /api/irrigation/advisory?lat=...&lon=...&cropType=...&soilType=...
router.get('/advisory', async (req, res) => {
  try {
    const lat = req.query.lat ? parseFloat(req.query.lat) : 28.6139;
    const lon = req.query.lon ? parseFloat(req.query.lon) : 77.2090;
    const cropType = req.query.cropType || 'wheat';
    const soilType = req.query.soilType || 'loam';

    const advisory = await getIrrigationAdvisory(lat, lon, cropType, soilType);
    res.json(advisory);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/irrigation/crops
router.get('/crops', (_req, res) => {
  res.json({
    success: true,
    crops: getSupportedCrops()
  });
});

export default router;
