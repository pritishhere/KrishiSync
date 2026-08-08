import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js'; // Yahan sirf routes aayega

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Routes Setup
app.use('/api/auth', authRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'KrishiSync API is running smooth!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running in hackathon mode on port ${PORT}`);
});