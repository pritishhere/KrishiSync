import express from 'express';
import { getIrrigationAdvisory, getSupportedCrops } from '../services/irrigationService.js';

const router = express.Router();

const handleIrrigationRequest = async (req, res) => {
  try {
    const lat = req.query.lat ? parseFloat(req.query.lat) : 28.6139;
    const lon = req.query.lon ? parseFloat(req.query.lon) : 77.2090;
    const cropType = req.query.cropType || req.query.crop || 'wheat';
    const soilType = req.query.soilType || req.query.soil || 'loam';

    const advisory = await getIrrigationAdvisory(lat, lon, cropType, soilType);
    res.json(advisory);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Both /advisory and /schedule supported
router.get('/advisory', handleIrrigationRequest);
router.get('/schedule', handleIrrigationRequest);

// GET /api/irrigation/crops
router.get('/crops', (_req, res) => {
  res.json({
    success: true,
    crops: getSupportedCrops()
  });
});

export default router;
