/**
 * KrishiSync Voice Assistant Service (Backend-Connected)
 * Consumes POST /api/voice/ask (protected) - hybrid system + Gemini AI.
 */
import { apiFetch } from './apiConfig';

export const voiceService = {
  /**
   * Send a voice/text query to Krishi-AI agronomist.
   * @param {string} text
   * @param {{lat:number, lng:number}} coords
   * @param {string} lang - 'hi' | 'bn' | 'en'
   */
  ask: async (text, coords = { lat: 22.5726, lng: 88.3639 }, lang = 'hi') => {
    const data = await apiFetch('/api/voice/ask', {
      method: 'POST',
      body: {
        text,
        lat: coords.lat,
        lng: coords.lng,
        lang,
      },
    });

    if (!data || !data.success) {
      throw new Error(data?.message || 'Voice assistant unavailable');
    }

    return {
      reply: data.reply,
      answeredBy: data.answeredBy,
      language: data.language,
      receivedQuery: data.receivedQuery,
    };
  },
};

export default voiceService;
