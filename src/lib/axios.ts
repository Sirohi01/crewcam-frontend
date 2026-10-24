import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
api.interceptors.request.use(
  (config) => {
    const tenantId = typeof window !== 'undefined' ? localStorage.getItem('tenant_id') : null;

    if (tenantId && config.headers) {
      config.headers['x-tenant-id'] = tenantId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
// Access token cookie lives 1 day; the refresh token lives 30. Without this, every
// 401 (including the access token simply expiring mid-session) forced a full
// logout even though a valid refresh token was sitting right there unused —
// that read as "logs out frequently". Now a 401 is answered with one silent
// refresh-and-retry before giving up and sending the user back to login.
let refreshInFlight: Promise<boolean> | null = null;

const refreshSession = () => {
  if (!refreshInFlight) {
    refreshInFlight = api
      .post('/auth/refresh', { portal: 'employer' })
      .then(() => true)
      .catch(() => false)
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    if (response?.status === 401 && typeof window !== 'undefined') {
      // Only attempt recovery when a previously authenticated session was rejected
      // (expired/invalid token). Pre-auth calls like a failed login or 2FA attempt
      // also return 401 and must be left for the caller to handle.
      if (useAuthStore.getState().isAuthenticated) {
        if (config && !config._retriedAfterRefresh && !config.url?.includes('/auth/refresh')) {
          config._retriedAfterRefresh = true;
          const refreshed = await refreshSession();
          if (refreshed) {
            return api(config);
          }
        }
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
