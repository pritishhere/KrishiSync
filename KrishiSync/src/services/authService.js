/**
 * KrishiSync Auth Service (Backend-Connected)
 * Talks to POST /api/auth/send-otp, /verify-otp, /profile, /register, /login
 * Stores the real JWT returned by the server.
 */
import { apiFetch, getToken, getStoredUser, setSession, clearSession } from './apiConfig';

export const authService = {
  /**
   * Request a 6-digit OTP for a 10-digit Indian mobile number.
   * @param {string} phone
   * @returns {Promise<{success, phoneNumber, message, devOtp, mode}>}
   */
  requestOtp: async (phone) => {
    const data = await apiFetch('/api/auth/send-otp', {
      method: 'POST',
      body: { phoneNumber: phone },
    });
    return data;
  },

  /**
   * Verify the OTP and receive a real JWT session.
   * Dev bypass OTP = 123456 (accepted by backend for fast demos).
   * @param {string} phone
   * @param {string} otp
   * @returns {Promise<{success, token, user}>}
   */
  verifyOtp: async (phone, otp) => {
    const data = await apiFetch('/api/auth/verify-otp', {
      method: 'POST',
      body: { phoneNumber: phone, otp },
    });
    if (data.success && data.token) {
      setSession({ token: data.token, user: data.user || { phoneNumber: phone } });
    }
    return data;
  },

  /**
   * Update the logged-in farmer's profile.
   * @param {object} profile
   */
  updateProfile: async (profile) => {
    const data = await apiFetch('/api/auth/profile', {
      method: 'PUT',
      body: profile,
    });
    return data;
  },

  /**
   * Register a new user (email/password/phone based).
   */
  register: async ({ phone, password, fullName }) => {
    const data = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: { phone, password, fullName },
    });
    if (data && data.token) {
      setSession({ token: data.token, user: data });
    }
    return data;
  },

  /**
   * Login with phone + password.
   */
  login: async ({ phone, password }) => {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: { phone, password },
    });
    if (data && data.token) {
      setSession({ token: data.token, user: data });
    }
    return data;
  },

  /**
   * Read the persisted session.
   */
  getStoredAuth: () => {
    const token = getToken();
    const user = getStoredUser();
    return {
      token,
      user,
      isAuthenticated: Boolean(token),
    };
  },

  /**
   * Clear the session.
   */
  logout: () => {
    clearSession();
  },
};

export default authService;
