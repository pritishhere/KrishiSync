import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 2500 });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.warn(`⚠️ MongoDB Connection Warning: ${error.message}`);
        console.log(`🔄 Backend running in standalone API mode for hackathon demo...`);
    }
};

export default connectDB;