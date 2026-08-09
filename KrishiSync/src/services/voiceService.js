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
  askAgronomist: async (query, lang = 'hi') => {
    const data = await apiFetch('/api/voice/ask', {
      method: 'POST',
      body: {
        text: query,
        lang,
      },
    });

    if (!data || !data.success) {
      throw new Error(data?.message || 'Voice assistant unavailable');
    }

    return {
      answer: data.answer,
      answeredBy: data.answeredBy,
      language: data.language,
      receivedQuery: data.receivedQuery,
    };
  },
};

export default voiceService;
