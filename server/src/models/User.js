import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        default: 'hi', // 'hi' for Hindi, 'en' for English
    },
    ecoPoints: {
        type: Number,
        default: 0, // Kisaan-score gamification ke liye
    }
}, { timestamps: true });

export default mongoose.model('User', userSchema);