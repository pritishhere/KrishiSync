import axios from 'axios';

const TOKEN_KEY = 'krishi_sync_demo_auth_token';
const USER_KEY = 'krishi_sync_demo_user';

// Determine base API URL (Vite environment variable or localhost fallback)
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Automatically attach Bearer token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY) || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global error handling & 401 Unauthorized session reset
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        console.warn('[ApiClient] 401 Unauthorized - clearing expired session tokens and triggering logout.');
        
        // Clear local storage session tokens
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem('krishi_sync_demo_auth');

        // Dispatch global event to trigger unified logout in AuthContext
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('krishi_sync_unauthorized'));
        }
      } else if (status === 403) {
        console.warn('[ApiClient] 403 Forbidden - access restricted.');
      } else if (status >= 500) {
        console.error('[ApiClient] 500+ Server Error:', data?.error || data?.message || 'Server error occurred');
      }

      const errorMessage = data?.error || data?.message || `Request failed with status code ${status}`;
      return Promise.reject(new Error(errorMessage));
    }

    if (error.request) {
      console.error('[ApiClient] Network Error: No response received from backend server.');
      return Promise.reject(new Error('Unable to connect to KrishiSync server. Please check your network connection.'));
    }

    return Promise.reject(error);
  }
);

export default apiClient;
