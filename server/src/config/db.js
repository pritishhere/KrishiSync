import mongoose from 'mongoose';

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
        console.log(`ℹ️ MONGO_URI not specified. Backend running in standalone API mode for hackathon demo.`);
        return;
    }
    try {
        const conn = await mongoose.connect(mongoUri);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.warn(`⚠️ MongoDB Connection Warning: ${error.message}`);
        console.log(`🔄 Backend running in standalone API mode for hackathon demo...`);
    }
};

export default connectDB;