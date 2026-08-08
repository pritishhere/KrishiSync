import mongoose from 'mongoose';

const connectDB = async () => {
    try {
<<<<<<< HEAD
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Database Error: ${error.message}`);
        process.exit(1); 
=======
        const conn = await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 2500 });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.warn(`⚠️ MongoDB Connection Warning: ${error.message}`);
        console.log(`🔄 Backend running in standalone API mode for hackathon demo...`);
>>>>>>> 4eb7d4565434754dde59ec0f1b82534c61c5bd59
    }
};

export default connectDB;