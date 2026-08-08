import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import irrigationRoutes from './src/routes/irrigationRoutes.js';
import diseaseRoutes from './src/routes/diseaseRoutes.js';
import twilioRoutes from './src/routes/twilioRoutes.js';
import authRoutes from './src/routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/krishisync';

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/irrigation', irrigationRoutes);
app.use('/api/disease', diseaseRoutes);
app.use('/api/twilio', twilioRoutes);

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'KrishiSync Backend, Authentication & X-Factor Engine Active',
    features: ['Phone Number OTP Auth (JWT)', 'Smart Irrigation API', 'Plant.id Disease Scanner API', 'Twilio SMS/WhatsApp Bot']
  });
});

app.get('/', (_req, res) => {
  res.send('KrishiSync API is ready (X-Factor Engine Active)');
});

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`🚀 KrishiSync Server running on http://localhost:${PORT}`);
  });
};

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    startServer();
  })
  .catch((error) => {
    console.warn('⚠️ MongoDB connection warning:', error.message);
    console.log('🔄 Starting server in API standalone mode for hackathon demo...');
    startServer();
  });

