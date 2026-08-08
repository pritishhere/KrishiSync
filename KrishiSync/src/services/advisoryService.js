/**
 * KrishiSync Smart Advisory Service (Backend-Connected)
 * Consumes POST /api/advisory/smart-plan (protected) - JalRakshak & FarmShield.
 */
import { apiFetch } from './apiConfig';

export const advisoryService = {
  /**
   * Get a smart irrigation + risk advisory based on real weather forecast.
   * @param {{lat:number, lng:number}} coords
   * @param {string} crop
   * @param {number} soilMoisture
   */
  getSmartPlan: async (coords = { lat: 22.5726, lng: 88.3639 }, crop = 'wheat', soilMoisture = 45) => {
    const data = await apiFetch('/api/advisory/smart-plan', {
      method: 'POST',
      body: {
        lat: coords.lat,
        lng: coords.lng,
        crop,
        providedSoilMoisture: soilMoisture,
      },
    });

    if (!data || !data.success) {
      throw new Error(data?.message || 'Failed to generate advisory');
    }

    return {
      realTimeData: data.realTimeData,
      jalRakshak: data.jalRakshak,
      farmShield: data.farmShield,
    };
  },
};

export default advisoryService;
