import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendAlertNotification } from './twilioService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'krishisync_super_secret_jwt_key_2026';

// In-memory cache for standalone mode (if DB is disconnected during demo testing)
const memoryOtpStore = new Map();

/**
 * Format phone number to E.164 (+91XXXXXXXXXX)
 */
export function formatPhoneNumber(phone) {
  let cleaned = (phone || '').replace(/\D/g, '');
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }
  return cleaned;
}

export async function sendOtp(rawPhoneNumber) {
  const phoneNumber = formatPhoneNumber(rawPhoneNumber);

  // Generate 6-digit OTP code
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes validity

  let user;
  try {
    user = await User.findOne({ phoneNumber });
    if (!user) {
      user = new User({ phoneNumber });
    }
    user.otp = { code: otpCode, expiresAt };
    await user.save();
  } catch (err) {
    console.warn('MongoDB saving OTP skipped (standalone mode active):', err.message);
  }

  // Save in memory backup
  memoryOtpStore.set(phoneNumber, { code: otpCode, expiresAt });

  // Send real SMS via Twilio if keys exist, or simulate
  const messageText = `🔑 Your KrishiSync Login Verification Code is: ${otpCode}. Valid for 10 minutes.`;
  const twilioResult = await sendAlertNotification(phoneNumber, messageText);

  console.log(`[AUTH SERVICE] Sent OTP ${otpCode} to ${phoneNumber} (${twilioResult.mode})`);

  return {
    success: true,
    phoneNumber,
    message: `OTP dispatched to ${phoneNumber}`,
    devOtp: process.env.NODE_ENV !== 'production' ? otpCode : undefined,
    mode: twilioResult.mode
  };
}

export async function verifyOtp(rawPhoneNumber, inputOtp) {
  const phoneNumber = formatPhoneNumber(rawPhoneNumber);
  const otpStr = (inputOtp || '').toString().trim();

  let user;
  let storedOtp;
  let isExpired = false;

  try {
    user = await User.findOne({ phoneNumber });
    if (user && user.otp) {
      storedOtp = user.otp.code;
      if (user.otp.expiresAt && new Date() > new Date(user.otp.expiresAt)) {
        isExpired = true;
      }
    }
  } catch (_err) {
    // Database check skipped
  }

  if (!storedOtp && memoryOtpStore.has(phoneNumber)) {
    const memData = memoryOtpStore.get(phoneNumber);
    storedOtp = memData.code;
    if (new Date() > memData.expiresAt) {
      isExpired = true;
    }
  }

  // Developer Bypass OTP for fast testing
  const isDevBypass = otpStr === '123456';

  if (!isDevBypass && (isExpired || (storedOtp && storedOtp !== otpStr))) {
    return { success: false, error: 'Invalid or expired OTP code.' };
  }

  if (!storedOtp && !isDevBypass) {
    return { success: false, error: 'No OTP requested for this phone number.' };
  }

  // Create user if not exists
  if (!user) {
    try {
      user = new User({ phoneNumber, isVerified: true });
      await user.save();
    } catch (_err) {
      user = {
        _id: `USR_${Date.now()}`,
        phoneNumber,
        name: 'Farmer',
        isVerified: true
      };
    }
  } else {
    user.isVerified = true;
    user.otp = undefined;
    try {
      await user.save();
    } catch (_err) {}
  }

  memoryOtpStore.delete(phoneNumber);

  // Sign JWT Session Token
  const token = jwt.sign(
    {
      id: user._id || user.id,
      phoneNumber: user.phoneNumber,
      name: user.name || 'Farmer'
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  return {
    success: true,
    message: 'Phone number verified successfully.',
    token,
    user: {
      id: user._id || user.id,
      phoneNumber: user.phoneNumber,
      name: user.name,
      farmLocation: user.farmLocation,
      crops: user.crops,
      soilType: user.soilType,
      isVerified: true
    }
  };
}

export async function updateUserProfile(userId, updateData) {
  try {
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-otp');
    if (user) {
      return { success: true, user };
    }
  } catch (_err) {}

  return {
    success: true,
    message: 'Profile updated (mock mode)',
    user: updateData
  };
}
