/**
 * KrishiSync Weather & Irrigation Service (Backend-Connected)
 * Consumes GET /api/data/weather (protected) and GET /api/irrigation/advisory.
 */
import { apiFetch } from './apiConfig';

export const weatherService = {
  /**
   * Fetch current weather for lat/lng via the protected backend route.
   * @param {{lat:number, lng:number}} coords
   */
  getWeatherData: async (coords = { lat: 22.5726, lng: 88.3639 }) => {
    const { lat, lng } = coords;
    const data = await apiFetch(`/api/data/weather?lat=${lat}&lng=${lng}`);
    if (data && data.success) {
      const w = data.data;
      return {
        location: w.location,
        temperature: w.temperature,
        condition: w.condition,
        description: w.description,
        humidity: w.humidity,
        windSpeed: w.windSpeed,
        rainExpected: false,
      };
    }
    throw new Error(data?.message || 'Failed to load weather');
  },

  /**
   * Fetch smart irrigation advisory from the backend.
   * @param {string} cropType
   * @param {string} soilType
   * @param {{lat:number, lon:number}} coords
   */
  getIrrigationAdvice: async (cropType = 'wheat', soilType = 'loam', coords = { lat: 28.6139, lon: 77.2090 }) => {
    const data = await apiFetch(
      `/api/irrigation/advisory?cropType=${cropType}&soilType=${soilType}&lat=${coords.lat}&lon=${coords.lon}`
    );
    if (data && data.success) {
      return {
        recommendation: data.advisory?.recommendation,
        urgency: data.advisory?.urgency,
        waterVolumeLitersPerAcre: data.advisory?.waterVolumeLitersPerAcre,
        bestTime: data.advisory?.bestTime,
        reasons: data.advisory?.reasons,
        weather: data.weather,
        crop: data.crop,
        location: data.location,
      };
    }
    throw new Error(data?.error || 'Failed to load irrigation advice');
  },

  /**
   * Get supported crops list.
   */
  getSupportedCrops: async () => {
    const data = await apiFetch('/api/irrigation/crops');
    return data?.crops || ['wheat', 'rice', 'cotton', 'tomato', 'mustard'];
  },
};

export default weatherService;
