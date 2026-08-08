import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';

import authRoutes from './src/routes/authRoutes.js'; 
import agriPoolRoutes from './src/routes/agriPoolRoutes.js';
import dataRoutes from './src/routes/dataRoutes.js';
import advisoryRoutes from './src/routes/advisoryRoutes.js';
import mandiMindRoutes from './src/routes/mandiMind.js';
import voiceRoutes from './src/routes/voiceRoutes.js';

import irrigationRoutes from './src/routes/irrigationRoutes.js';
import diseaseRoutes from './src/routes/diseaseRoutes.js';
import twilioRoutes from './src/routes/twilioRoutes.js';

dotenv.config();

const app = express();

try {
  connectDB();
} catch (_err) {
  console.warn('MongoDB connectDB fallback');
}

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// All Subsystem Routes
app.use('/api/auth', authRoutes);
app.use('/api/rides', agriPoolRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/advisory', advisoryRoutes);
app.use('/api/mandimind', mandiMindRoutes);
app.use('/api/voice', voiceRoutes);

app.use('/api/irrigation', irrigationRoutes);
app.use('/api/disease', diseaseRoutes);
app.use('/api/twilio', twilioRoutes);

// Health Check Route
app.get('/api/health', (_req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'KrishiSync Backend, Authentication & X-Factor Engine Active',
      features: [
        'Phone Number OTP Auth (JWT)',
        'Smart Irrigation API',
        'Plant.id Disease Scanner API',
        'Twilio SMS/WhatsApp Bot',
        'AgriPool Ride Sharing',
        'MandiMind & Voice Services'
      ]
    });
});

app.get('/', (_req, res) => {
  res.send('KrishiSync API is ready (X-Factor Engine Active)');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 KrishiSync Server running on http://localhost:${PORT}`);
});
