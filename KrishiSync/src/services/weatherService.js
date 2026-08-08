/**
 * Weather & Irrigation Service Layer
 * 
 * Data Interface:
 * {
 *   temperature: string,           // e.g. '28°C'
 *   humidity: string,              // e.g. '72%'
 *   condition: string,             // e.g. 'Partly Cloudy'
 *   precipitationProbability: string, // e.g. '80%'
 *   location: string,              // e.g. 'Pune, Maharashtra'
 *   tomorrowForecast: string,      // e.g. '80% Rain expected tomorrow'
 *   highLow: string,               // e.g. '31°C / 22°C'
 *   windSpeed: string,             // e.g. '12 km/h'
 *   rainExpected: boolean,         // true | false
 * }
 * 
 * Ready for Member 4 to swap mock response with OpenWeather API endpoint.
 */

export const weatherService = {
  /**
   * Fetch current weather data for a given location or coordinates.
   * @param {string} location 
   * @returns {Promise<object>}
   */
  getWeatherData: async (location = 'Pune, Maharashtra') => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          temperature: '28°C',
          humidity: '72%',
          condition: 'Partly Cloudy',
          precipitationProbability: '80%',
          location: location || 'Pune, Maharashtra',
          tomorrowForecast: '80% Rain expected tomorrow',
          highLow: '31°C / 22°C',
          windSpeed: '12 km/h',
          rainExpected: true,
        });
      }, 300);
    });
  },

  /**
   * Calculate automated irrigation recommendation based on weather metrics.
   * @param {boolean} rainExpected 
   * @returns {Promise<{ rainExpected: boolean, title: string, instruction: string, savings: string }>}
   */
  getIrrigationAdvice: async (rainExpected = true) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (rainExpected) {
          resolve({
            rainExpected: true,
            title: '80% Chance of rain tomorrow',
            instruction: 'Do not run the pump today.',
            savings: '₹500',
            details: 'Save power & prevent soil saturation.',
          });
        } else {
          resolve({
            rainExpected: false,
            title: 'Clear skies forecasted today',
            instruction: 'Proceed with normal watering schedule.',
            savings: '₹0',
            recommendation: 'Target 25-30 liters/sq meter in late afternoon',
          });
        }
      }, 200);
    });
  },
};
