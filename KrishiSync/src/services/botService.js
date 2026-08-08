/**
 * Bot Guide & SMS/WhatsApp Assistant Service Layer
 * 
 * Data Interface:
 * {
 *   command: string,       // e.g. 'RATE WHEAT'
 *   description: string,   // e.g. 'Sends real-time Mandi market rates via SMS'
 *   exampleReply: string,  // e.g. 'Azadpur Mandi Rate: ₹2,350/qtl'
 *   whatsappHotline: string// e.g. '+91 8000-123-456'
 * }
 * 
 * Ready for Member 4 to connect Twilio / WhatsApp Business API Webhooks.
 */

export const botService = {
  /**
   * Get supported SMS/WhatsApp command guides.
   * @returns {Promise<Array<object>>}
   */
  getBotCommandsList: async () => {
    return Promise.resolve([
      {
        id: 'rate',
        command: 'RATE WHEAT',
        description: 'Sends real-time Mandi market rates for Wheat (or any crop) directly to your phone via SMS/WhatsApp.',
        exampleReply: 'KrishiSync Bot: Azadpur Mandi Rate: ₹2,350/qtl. Highest Net Profit: ₹10,925.',
      },
      {
        id: 'weather',
        command: 'WEATHER',
        description: 'Get automated 24-hour rainfall forecast & irrigation pump guidance.',
        exampleReply: 'KrishiSync Bot: Alert 80% chance of rain tomorrow. Do not run pump today. Saved ₹500.',
      },
    ]);
  },

  /**
   * Get WhatsApp Hotline Configuration for demo testing.
   * @returns {Promise<{ hotline: string, presetMessage: string }>}
   */
  getWhatsAppConfig: async () => {
    return Promise.resolve({
      hotline: '+91 8000-123-456',
      presetMessage: 'RATE WHEAT',
    });
  },
};
