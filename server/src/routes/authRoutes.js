import express from 'express';
import { registerUser, loginUser } from '../controllers/authControllers.js';
import { sendOtp, verifyOtp, updateUserProfile } from '../services/authService.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// 📱 Phone OTP Auth Routes (X-Factor Engine)
router.post('/send-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({ success: false, error: 'Phone number is required' });
    }
    const result = await sendOtp(phoneNumber);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    if (!phoneNumber || !otp) {
      return res.status(400).json({ success: false, error: 'Phone number and OTP are required' });
    }
    const result = await verifyOtp(phoneNumber, otp);
    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/profile', protect, async (req, res) => {
  try {
    const result = await updateUserProfile(req.user.id || req.user._id, req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 👤 Standard Email / Password Auth Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
