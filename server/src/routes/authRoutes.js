import express from 'express';
import { sendOtp, verifyOtp, updateUserProfile } from '../services/authService.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/auth/send-otp
router.post('/send-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({ success: false, error: 'Phone number is required.' });
    }

    const result = await sendOtp(phoneNumber);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    if (!phoneNumber || !otp) {
      return res.status(400).json({ success: false, error: 'Both phoneNumber and otp are required.' });
    }

    const result = await verifyOtp(phoneNumber, otp);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/auth/me - Protected user profile
router.get('/me', protect, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// PUT /api/auth/profile - Protected profile update
router.put('/profile', protect, async (req, res) => {
  try {
    const result = await updateUserProfile(req.user._id || req.user.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
