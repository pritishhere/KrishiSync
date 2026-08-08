import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './src/config/db.js';

// 📂 1. Core API Routes (AgriPool, MandiMind, etc.)
import authRoutes from './src/routes/authRoutes.js';
import agriPoolRoutes from './src/routes/agriPoolRoutes.js';
import dataRoutes from './src/routes/dataRoutes.js';
import advisoryRoutes from './src/routes/advisoryRoutes.js';
import mandiMindRoutes from './src/routes/mandiMindRoutes.js';
import voiceRoutes from './src/routes/voiceRoutes.js';

// 🚀 2. X-Factor Engine Routes (Frontend team's additions)
import irrigationRoutes from './src/routes/irrigationRoutes.js';
import diseaseRoutes from './src/routes/diseaseRoutes.js';
import twilioRoutes from './src/routes/twilioRoutes.js';

// Initialize env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database Connection (With Safe Fallback)
try {
  connectDB();
} catch (_err) {
  console.warn('MongoDB connectDB fallback');
}

// Middleware setup
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Allows larger payloads for images (Disease Scanner)
app.use(express.urlencoded({ extended: true }));

// 🔌 Set up ALL the API routes seamlessly
app.use('/api/auth', authRoutes);
app.use('/api/rides', agriPoolRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/advisory', advisoryRoutes);
app.use('/api/mandimind', mandiMindRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/irrigation', irrigationRoutes);
app.use('/api/disease', diseaseRoutes);
app.use('/api/twilio', twilioRoutes);

// Root route
app.get('/', (_req, res) => {
  res.send('KrishiSync API is ready (X-Factor Engine Active)');
});

// Unified Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'KrishiSync API is running smooth! (Backend, Authentication & X-Factor Engine Active)',
    features: [
      'AgriPool Matchmaking', 
      'MandiMind Calculator', 
      'Smart Irrigation API', 
      'Plant.id Disease Scanner API', 
      'Twilio SMS/WhatsApp Bot'
    ]
  });
});

// Server Listen
app.listen(PORT, () => {
  console.log(`🚀 KrishiSync Server running on port ${PORT} & Connected to MongoDB Atlas Cloud!`);
});