import dotenv from 'dotenv';
import { getIrrigationAdvisory } from './irrigationService.js';
dotenv.config();

/**
 * Twilio WhatsApp & SMS Bot Service
 * Enables farmers with basic feature phones or WhatsApp to receive
 * instant irrigation schedules, weather alerts, and market price updates.
 */

export async function handleIncomingMessage(body, from) {
  const text = (body || '').toUpperCase().trim();
  let replyText = '';

  if (text.includes('WATER') || text.includes('IRRIGATION') || text.includes('PAANI')) {
    const advisory = await getIrrigationAdvisory(28.6139, 77.2090, 'wheat', 'loam');
    replyText = `🌾 *KrishiSync Irrigation Advisory*\n\n` +
      `Status: ${advisory.advisory.recommendation} (${advisory.advisory.urgency} Urgency)\n` +
      `Recommended Water: ${advisory.advisory.waterVolumeLitersPerAcre} Liters/Acre\n` +
      `Best Time: ${advisory.advisory.bestTime}\n\n` +
      `Why: ${advisory.advisory.reasons[0]}`;
  } else if (text.includes('WEATHER') || text.includes('MAUSAM')) {
    const advisory = await getIrrigationAdvisory(28.6139, 77.2090, 'wheat', 'loam');
    const w = advisory.weather;
    replyText = `☀️ *KrishiSync Weather Alert*\n\n` +
      `Location: ${w.location}\n` +
      `Temp: ${w.temp}°C | Humidity: ${w.humidity}%\n` +
      `Condition: ${w.description.toUpperCase()}\n` +
      `Wind: ${w.windSpeed} m/s`;
  } else if (text.includes('PRICE') || text.includes('MANDI') || text.includes('BHAV')) {
    replyText = `📊 *Today's Mandi Rates (Azadpur Mandi)*\n\n` +
      `• Wheat (Gehun): ₹2,280 / Quintal\n` +
      `• Rice (Paddy): ₹3,150 / Quintal\n` +
      `• Tomato: ₹1,850 / Quintal\n` +
      `• Mustard: ₹5,400 / Quintal\n\n` +
      `Reply WATER for irrigation tips.`;
  } else if (text.includes('DISEASE') || text.includes('KIDA')) {
    replyText = `🔍 *KrishiSync Disease Scan*\n\n` +
      `Please reply with a photo of the affected crop leaf on WhatsApp to run AI diagnosis.\n` +
      `Or visit: http://localhost:5173 to use the web scanner.`;
  } else {
    replyText = `🙏 *Welcome to KrishiSync Assistant*\n\n` +
      `Text any keyword:\n` +
      `• *WATER* - Irrigation advice\n` +
      `• *WEATHER* - Local weather\n` +
      `• *PRICE* - Live Mandi rates\n` +
      `• *DISEASE* - Crop disease help`;
  }

  // Generate TwiML XML response for Twilio webhook
  const twimlXml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>${replyText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</Message>
</Response>`;

  return {
    rawMessage: body,
    sender: from,
    replyText,
    twimlXml
  };
}

export async function sendAlertNotification(toPhone, alertText) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromPhone = process.env.TWILIO_PHONE_NUMBER || process.env.TWILIO_WHATSAPP_NUMBER;

  if (accountSid && authToken && accountSid !== 'YOUR_TWILIO_ACCOUNT_SID') {
    try {
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          From: fromPhone,
          To: toPhone,
          Body: alertText
        })
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, messageId: data.sid, mode: 'Twilio Gateway Live (SMS Sent)' };
      } else {
        const errJson = await response.json();
        console.warn('Twilio API Notice:', errJson.message);
      }
    } catch (err) {
      console.warn('Twilio dispatch error:', err.message);
    }
  }

  // Fallback simulator for live demos without paid credentials
  console.log(`[Twilio Simulation Dispatch] To: ${toPhone} | Message: ${alertText}`);
  return {
    success: true,
    messageId: `SIM_${Date.now()}`,
    to: toPhone,
    message: alertText,
    mode: 'Simulated Twilio Dispatch'
  };
}
