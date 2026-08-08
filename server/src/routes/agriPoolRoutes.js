import express from 'express';
import { createRide, findNearbyRides } from '../controllers/agriPoolController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// protect middleware yeh ensure karega ki token wale hi access karein
router.post('/', protect, createRide);
router.get('/nearby', protect, findNearbyRides);
router.put('/:id/complete', protect, completeRide);

export default router;