import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Database Error: ${error.message}`);
        try {
            const conn = await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 2500 });
            console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        } catch (innerError) {
            console.warn(`⚠️ MongoDB Connection Warning: ${innerError.message}`);
            console.log(`🔄 Backend running in standalone API mode for hackathon demo...`);
        }
    }
};

export default connectDB;