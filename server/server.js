import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js'; 
import agriPoolRoutes from './src/routes/agriPoolRoutes.js';
import dataRoutes from './src/routes/dataRoutes.js';
import advisoryRoutes from './src/routes/advisoryRoutes.js';
import mandiMindRoutes from './src/routes/mandiMindRoutes.js';
import voiceRoutes from './src/routes/voiceRoutes.js';

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Routes Setup
app.use('/api/auth', authRoutes);
app.use('/api/rides', agriPoolRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/advisory', advisoryRoutes);
app.use('/api/mandimind', mandiMindRoutes);
app.use('/api/voice', voiceRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'KrishiSync API is running smooth!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running in hackathon mode on port ${PORT}`);
});