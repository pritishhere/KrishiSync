import express from 'express';
import { createRide, findNearbyRides, completeRide } from '../controllers/agriPoolController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createRide);
router.get('/nearby', protect, findNearbyRides);
router.put('/:id/complete', protect, completeRide);

export default router;