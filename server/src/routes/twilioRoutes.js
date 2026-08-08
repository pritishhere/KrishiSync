import express from 'express';
import { handleIncomingMessage, sendAlertNotification } from '../services/twilioService.js';

const router = express.Router();

// POST /api/twilio/webhook - Webhook for incoming SMS / WhatsApp messages
router.post('/webhook', async (req, res) => {
  try {
    const body = req.body.Body || req.query.Body || '';
    const from = req.body.From || req.query.From || 'Unknown Farmer';

    const response = await handleIncomingMessage(body, from);
    res.type('text/xml').send(response.twimlXml);
  } catch (error) {
    res.status(500).type('text/xml').send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>Error processing request.</Message></Response>`);
  }
});

// POST /api/twilio/send-alert - Broadcast weather/irrigation alert to farmer phone
router.post('/send-alert', async (req, res) => {
  try {
    const { to, message } = req.body;
    if (!to || !message) {
      return res.status(400).json({ success: false, error: 'Both "to" and "message" fields are required.' });
    }

    const result = await sendAlertNotification(to, message);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
