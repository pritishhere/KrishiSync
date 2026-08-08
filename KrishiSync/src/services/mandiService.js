/**
 * KrishiSync Mandi Service (Backend-Connected)
 * Consumes POST /api/mandimind/analyze for real net-revenue comparison
 * and GET /api/data/mandi for real government price feeds.
 */
import { apiFetch } from './apiConfig';

const CROPS = [
  { id: 'wheat', name: 'Wheat (गेहूँ)', icon: '🌾' },
  { id: 'paddy', name: 'Paddy / Rice (धान)', icon: '🌾' },
  { id: 'potato', name: 'Potato (आलू)', icon: '🥔' },
  { id: 'mustard', name: 'Mustard (सरसों)', icon: '🌼' },
  { id: 'cotton', name: 'Cotton (कपास)', icon: '☁️' },
  { id: 'tomato', name: 'Tomato (टमाटर)', icon: '🍅' },
  { id: 'rice', name: 'Rice (चावल)', icon: '🍚' },
];

export const mandiService = {
  /**
   * Get supported crop list for the MandiMind calculator.
   */
  getCropsList: async () => Promise.resolve(CROPS),

  /**
   * Analyze the best mandi based on real prices, GPS distance & transport cost.
   * @param {string} crop
   * @param {number} quantityKg
   * @param {{lat:number, lng:number}} coords
   */
  calculateMandiPrices: async (crop = 'wheat', quantityKg = 500, coords = { lat: 22.5726, lng: 88.3639 }) => {
    const data = await apiFetch('/api/mandimind/analyze', {
      method: 'POST',
      body: {
        crop,
        quantity: Number(quantityKg) || 100,
        lat: coords.lat,
        lng: coords.lng,
      },
    });

    if (!data || !data.success) {
      throw new Error(data?.message || 'No real mandi data found for this crop today.');
    }

    // Normalize backend response into the UI's expected shape
    const mapOption = (opt, isBest = false) => ({
      mandiName: opt.market,
      location: opt.district,
      distance: opt.distance,
      transportCost: parseFloat(String(opt.transportCost).replace(/[^\d.-]/g, '')) || 0,
      netProfit: parseFloat(String(opt.netRevenue).replace(/[^\d.-]/g, '')) || 0,
      marketPricePerQtl: parseFloat(String(opt.pricePerQuintal).replace(/[^\d.-]/g, '')) || 0,
      sellingRevenue: opt.sellingRevenue,
      isBest,
    });

    const results = [];
    if (data.recommendedMandi) {
      results.push(mapOption(data.recommendedMandi, true));
    }
    (data.otherOptions || []).forEach((opt) => results.push(mapOption(opt, false)));

    return results;
  },

  /**
   * Fetch raw government mandi price feed via backend.
   */
  getLiveMandiFeed: async (crop = 'wheat') => {
    const data = await apiFetch(`/api/data/mandi?state=West%20Bengal`);
    if (data && data.success) {
      return (data.data || []).filter((m) => m.crop.toLowerCase() === crop.toLowerCase());
    }
    return [];
  },
};

export default mandiService;
