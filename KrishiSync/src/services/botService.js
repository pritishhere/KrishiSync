/**
 * KrishiSync Bot / SMS-WhatsApp Assistant Service (Backend-Connected)
 * Consumes POST /api/twilio/webhook and POST /api/twilio/send-alert.
 */
import { apiFetch } from './apiConfig';

export const botService = {
  /**
   * Send a keyword command to the Twilio webhook and parse the reply.
   * @param {string} command - WATER | WEATHER | PRICE | DISEASE | HELP
   * @param {string} from
   */
  sendCommand: async (command = 'WATER', from = '+919876543210') => {
    const xmlData = await apiFetch('/api/twilio/webhook', {
      method: 'POST',
      formUrlEncoded: true,
      body: { Body: command, From: from },
    });

    // Parse the TwiML <Message> content
    const match = String(xmlData).match(/<Message>([\s\S]*?)<\/Message>/);
    let reply = match ? match[1] : String(xmlData);
    reply = reply.replace(/&amp;/g, '&').replace(/</g, '<').replace(/>/g, '>');
    return reply;
  },

  /**
   * Send an SMS/WhatsApp alert to a farmer phone.
   * @param {string} to
   * @param {string} message
   */
  sendAlert: async (to, message) => {
    const data = await apiFetch('/api/twilio/send-alert', {
      method: 'POST',
      body: { to, message },
    });
    return data;
  },

  /**
   * Get the supported command guides (static, for the UI).
   */
  getBotCommandsList: async () =>
    Promise.resolve([
      {
        id: 'rate',
        command: 'PRICE / MANDI',
        description: 'Sends real-time Mandi market rates & profit estimates directly to your phone via SMS/WhatsApp.',
        exampleReply: '📊 Today Mandi Rates: Wheat ₹2,280/qtl • Rice ₹3,150 • Mustard ₹5,400',
      },
      {
        id: 'weather',
        command: 'WEATHER / MAUSAM',
        description: 'Get automated 24-hour rainfall forecast & irrigation pump guidance.',
        exampleReply: '☀️ KrishiSync Weather Alert: Temp 31°C | Humidity 62% | Partly Cloudy',
      },
      {
        id: 'water',
        command: 'WATER / IRRIGATION / PAANI',
        description: 'Get a precise irrigation schedule with water volume and best timing.',
        exampleReply: '🌾 Irrigation Advisory: Water 4500 L/Acre • Best Time: Early Morning',
      },
      {
        id: 'disease',
        command: 'DISEASE / KIDA',
        description: 'Guidance to run AI crop-disease diagnosis via the web scanner.',
        exampleReply: '🔍 Send a photo of the affected leaf on WhatsApp for AI diagnosis.',
      },
    ]),

  /**
   * Get WhatsApp hotline config for demo.
   */
  getWhatsAppConfig: async () =>
    Promise.resolve({
      hotline: '+91 8000-123-456',
      presetMessage: 'RATE WHEAT',
    }),
};

export default botService;
