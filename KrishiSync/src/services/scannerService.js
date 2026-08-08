/**
 * Crop Health Scanner Service Layer
 * 
 * Data Interface:
 * {
 *   diseaseName: string,   // e.g. 'Late Blight (Phytophthora infestans)'
 *   confidence: number,    // e.g. 98 (percentage)
 *   recommendation: string,// e.g. 'Remove affected leaves immediately and follow treatment.'
 *   isPlant: boolean,      // true | false
 *   error: string | null,  // error message or null
 * }
 * 
 * Ready for Member 4 to swap mock response with Plant.id API endpoint (POST /api/scanner/identify).
 */

export const scannerService = {
  /**
   * Analyze uploaded or captured crop leaf image.
   * @param {string | File} _imageData 
   * @returns {Promise<{ diseaseName: string, confidence: number, recommendation: string, isPlant: boolean, error: string | null }>}
   */
  analyzeCropImage: async (_imageData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock result payload ready for Plant.id API response mapping
        resolve({
          diseaseName: 'Late Blight (Phytophthora infestans)',
          confidence: 98,
          recommendation: 'Remove affected leaves immediately and follow treatment. Apply copper-based fungicide every 7–10 days during humid weather.',
          isPlant: true,
          error: null,
        });
      }, 1500);
    });
  },
};
