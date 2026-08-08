/**
 * KrishiSync Crop Health Scanner Service (Backend-Connected)
 * Consumes POST /api/disease/scan and GET /api/disease/sample-cases.
 */
import { apiFetch } from './apiConfig';

export const scannerService = {
  /**
   * Analyze an uploaded/captured crop leaf image.
   * @param {string} imageBase64 - data URL from FileReader
   * @param {string} cropHint - e.g. 'tomato'
   */
  analyzeCropImage: async (imageBase64, cropHint = 'tomato') => {
    // Strip the data URL prefix if present (backend expects raw base64)
    const clean = typeof imageBase64 === 'string' ? imageBase64.split(',')[1] || imageBase64 : imageBase64;

    const data = await apiFetch('/api/disease/scan', {
      method: 'POST',
      body: { imageBase64: clean, cropHint },
    });

    if (!data || !data.success) {
      throw new Error(data?.error || 'Disease scan failed');
    }

    return {
      diseaseName: data.diseaseName,
      confidence: Math.round((data.confidence || 0.9) * 100),
      recommendation:
        data.treatment?.organic || 'Apply recommended organic treatment and consult local agro-extension officer.',
      symptoms: data.symptoms,
      treatment: data.treatment,
      prevention: data.prevention,
      source: data.source,
      cropAnalyzed: data.cropAnalyzed,
      isPlant: true,
      error: null,
    };
  },

  /**
   * Fetch sample disease cases for demo/education.
   */
  getSampleCases: async () => {
    const data = await apiFetch('/api/disease/sample-cases');
    return data?.samples || [];
  },
};

export default scannerService;
