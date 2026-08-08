import express from 'express';
import { getWeather, getMandiPrices } from '../controllers/dataController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// protect lagaya hai taaki sirf app users isko dekh sakein
router.get('/weather', protect, getWeather);
router.get('/mandi', protect, getMandiPrices);

export default router;