/**
 * Frontend Irrigation Service
 * Connects to backend irrigation endpoints for schedules and alerts.
 */
import { apiFetch } from './apiConfig';

export const irrigationService = {
  /**
   * Request irrigation recommendation or schedule from backend
   * @param {{lat:number,lng:number,areaSqM:number}} payload
   */
  getRecommendation: async (payload) => {
    const data = await apiFetch('/api/irrigation/recommend', {
      method: 'POST',
      body: payload,
    });
    return data;
  },
};

export default irrigationService;
