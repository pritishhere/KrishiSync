import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      default: 'Farmer'
    },
    farmLocation: {
      address: { type: String, default: 'Delhi-NCR Agro Zone' },
      lat: { type: Number, default: 28.6139 },
      lon: { type: Number, default: 77.2090 }
    },
    crops: {
      type: [String],
      default: ['wheat', 'mustard']
    },
    soilType: {
      type: String,
      default: 'loam'
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    otp: {
      code: { type: String },
      expiresAt: { type: Date }
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
