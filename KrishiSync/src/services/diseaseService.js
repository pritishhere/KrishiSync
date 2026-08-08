/**
 * Frontend Disease Service
 * Connects to backend disease endpoints for scanning and suggestions.
 */
import { apiFetch } from './apiConfig';

export const diseaseService = {
  /**
   * Send an image (FormData) to backend disease scanner endpoint.
   * @param {FormData} formData
   */
  scanImage: async (formData) => {
    const data = await apiFetch('/api/disease/scan', {
      method: 'POST',
      rawBody: true,
      body: formData,
    });
    return data;
  },
};

export default diseaseService;
