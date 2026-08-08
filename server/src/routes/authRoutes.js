import express from 'express';
import { sendOtp, verifyOtp, updateUserProfile } from '../services/authService.js';
import { protect } from '../middleware/authMiddleware.js';

let registerUser, loginUser;
try {
  const authController = await import('../controllers/authControllers.js');
  registerUser = authController.registerUser;
  loginUser = authController.loginUser;
} catch (_err) {}

const router = express.Router();

// Member 3 Password Auth Routes
if (registerUser) router.post('/register', registerUser);
if (loginUser) router.post('/login', loginUser);

// Member 4 OTP Auth Routes
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

router.get('/me', protect, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

router.put('/profile', protect, async (req, res) => {
  try {
    const result = await updateUserProfile(req.user._id || req.user.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
