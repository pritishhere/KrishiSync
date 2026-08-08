/**
 * Mandi Rates & Net Profit Service Layer
 * 
 * Data Interface:
 * {
 *   mandiName: string,       // e.g. 'Azadpur Mandi'
 *   distance: number,        // e.g. 18 (in km)
 *   transportCost: number,   // e.g. 450 (in ₹)
 *   netProfit: number,       // e.g. 10925 (in ₹)
 *   marketPricePerQtl: number, // e.g. 2350 (in ₹/qtl)
 *   location: string,        // e.g. 'Delhi NCR'
 *   isBest: boolean,         // true | false
 * }
 * 
 * Ready for Member 3/Backend team to swap with GET /api/mandi/prices.
 */

export const mandiService = {
  /**
   * Get supported crop list for Mandi price calculation.
   * @returns {Promise<Array<{ id: string, name: string, avgPriceQtl: number, icon: string }>>}
   */
  getCropsList: async () => {
    return Promise.resolve([
      { id: 'wheat', name: 'Wheat (गेहूँ)', avgPriceQtl: 2275, icon: '🌾' },
      { id: 'paddy', name: 'Paddy / Rice (धान)', avgPriceQtl: 2183, icon: '🌾' },
      { id: 'potato', name: 'Potato (आलू)', avgPriceQtl: 1450, icon: '🥔' },
      { id: 'mustard', name: 'Mustard (सरसों)', avgPriceQtl: 5450, icon: '🌼' },
      { id: 'cotton', name: 'Cotton (कपास)', avgPriceQtl: 7100, icon: '☁️' },
    ]);
  },

  /**
   * Calculate best mandi prices & net profit for crop and quantity.
   * @param {string} cropId 
   * @param {number} quantityKg 
   * @returns {Promise<Array<{ mandiName: string, distance: number, transportCost: number, netProfit: number, marketPricePerQtl: number, location: string, isBest: boolean }>>}
   */
  calculateMandiPrices: async (cropId = 'wheat', quantityKg = 500) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockRawData = {
          wheat: [
            { id: 1, mandiName: 'Azadpur Mandi', location: 'Delhi NCR', distance: 18, marketPricePerQtl: 2350, transportCostPerKm: 25 },
            { id: 2, mandiName: 'Karnal Grain Market', location: 'Karnal, Haryana', distance: 34, marketPricePerQtl: 2310, transportCostPerKm: 22 },
            { id: 3, mandiName: 'Pune APMC Market', location: 'Pune, MH', distance: 52, marketPricePerQtl: 2250, transportCostPerKm: 18 },
          ],
          paddy: [
            { id: 1, mandiName: 'Karnal Mandi', location: 'Haryana', distance: 22, marketPricePerQtl: 2240, transportCostPerKm: 20 },
            { id: 2, mandiName: 'Ambala Mandi', location: 'Punjab Border', distance: 48, marketPricePerQtl: 2190, transportCostPerKm: 18 },
          ],
          potato: [
            { id: 1, mandiName: 'Agra APMC Market', location: 'Agra, UP', distance: 15, marketPricePerQtl: 1520, transportCostPerKm: 20 },
            { id: 2, mandiName: 'Indore Mandi', location: 'MP', distance: 65, marketPricePerQtl: 1480, transportCostPerKm: 15 },
          ],
          mustard: [
            { id: 1, mandiName: 'Bharatpur Mandi', location: 'Rajasthan', distance: 28, marketPricePerQtl: 5600, transportCostPerKm: 25 },
            { id: 2, mandiName: 'Jaipur Grain Hub', location: 'Rajasthan', distance: 70, marketPricePerQtl: 5510, transportCostPerKm: 18 },
          ],
          cotton: [
            { id: 1, mandiName: 'Rajkot APMC', location: 'Gujarat', distance: 30, marketPricePerQtl: 7250, transportCostPerKm: 30 },
            { id: 2, mandiName: 'Yavatmal Mandi', location: 'Maharashtra', distance: 85, marketPricePerQtl: 7050, transportCostPerKm: 20 },
          ],
        };

        const cropMandis = mockRawData[cropId] || mockRawData.wheat;
        const quintals = (Number(quantityKg) || 100) / 100;

        const processed = cropMandis.map((mandi) => {
          const grossRevenue = quintals * mandi.marketPricePerQtl;
          const transportCost = mandi.distance * mandi.transportCostPerKm;
          const netProfit = grossRevenue - transportCost;

          return {
            mandiName: mandi.mandiName,
            distance: mandi.distance,
            transportCost: transportCost,
            netProfit: Math.round(netProfit),
            marketPricePerQtl: mandi.marketPricePerQtl,
            location: mandi.location,
            isBest: false,
          };
        });

        // Sort descending by net profit and flag highest profit mandi
        processed.sort((a, b) => b.netProfit - a.netProfit);
        if (processed.length > 0) {
          processed[0].isBest = true;
        }

        resolve(processed);
      }, 300);
    });
  },
};
