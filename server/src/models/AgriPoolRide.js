import mongoose from 'mongoose';

const rideSchema = new mongoose.Schema({
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startLocation: {
        type: {
            type: String,
            enum: ['Point'], 
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    availableCapacity: {
        type: Number, // In KG
        required: true
    },
    status: {
        type: String,
        enum: ['OPEN', 'COMPLETED'],
        default: 'OPEN'
    }
}, { timestamps: true });

// Yeh index map par nearest rides search karne ke liye zaroori hai
rideSchema.index({ startLocation: '2dsphere' });

export default mongoose.model('AgriPoolRide', rideSchema);