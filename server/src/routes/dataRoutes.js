import express from 'express';
import { getWeather, getMandiPrices } from '../controllers/dataController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/weather', protect, getWeather);
router.get('/mandi', protect, getMandiPrices);

export default router;