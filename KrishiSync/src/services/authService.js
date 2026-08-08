/**
 * Auth Service Abstraction
 * 
 * Provides API abstraction for OTP authentication flow.
 * Currently uses simulated async promises for frontend MVP, but structured 
 * so it can be swapped with real backend endpoints (e.g. POST /api/auth/send-otp,
 * POST /api/auth/verify-otp) returning JWT tokens without changing UI components.
 */

const DEMO_OTP = '1234';
const TOKEN_KEY = 'krishi_sync_demo_auth_token';
const USER_KEY = 'krishi_sync_demo_user';

export const authService = {
  /**
   * Request OTP for a given 10-digit Indian phone number.
   * @param {string} phone 
   * @returns {Promise<{ success: boolean, message: string }>}
   */
  requestOtp: async (phone) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const isValid = /^[6-9]\d{9}$/.test(phone);
        if (isValid) {
          resolve({
            success: true,
            message: `OTP sent to +91 ${phone}`,
          });
        } else {
          reject(new Error('Invalid Indian mobile number. Must be 10 digits starting with 6-9.'));
        }
      }, 800);
    });
  },

  /**
   * Verify 4-digit OTP code for a phone number.
   * @param {string} phone 
   * @param {string} otp 
   * @returns {Promise<{ token: string, user: { id: string, phone: string } }>}
   */
  verifyOtp: async (phone, otp) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (otp === DEMO_OTP) {
          const authData = {
            token: `mock_jwt_token_${Date.now()}`,
            user: {
              id: 'usr_demo_101',
              phone: `+91 ${phone}`,
              role: 'farmer',
            },
          };
          
          // Save to local storage for persistence across reloads
          localStorage.setItem(TOKEN_KEY, authData.token);
          localStorage.setItem(USER_KEY, JSON.stringify(authData.user));
          localStorage.setItem('krishi_sync_demo_auth', 'true');
          
          resolve(authData);
        } else {
          reject(new Error('Incorrect code. Please try again.'));
        }
      }, 1000);
    });
  },

  /**
   * Check local storage for existing valid session.
   * @returns {{ token: string | null, user: object | null, isAuthenticated: boolean }}
   */
  getStoredAuth: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);
    let user = null;
    try {
      if (userStr) user = JSON.parse(userStr);
    } catch {
      user = null;
    }
    
    // Also support fallback legacy key for backward compatibility if present
    const legacyAuth = localStorage.getItem('krishi_sync_demo_auth') === 'true';
    const isAuthenticated = Boolean(token || legacyAuth);

    return {
      token,
      user,
      isAuthenticated,
    };
  },

  /**
   * Clear session tokens and user storage.
   */
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('krishi_sync_demo_auth');
  },
};
