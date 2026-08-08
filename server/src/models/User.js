import mongoose from 'mongoose';

<<<<<<< HEAD
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
=======
const userSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    name: {
      type: String,
      default: 'Farmer'
    },
    fullName: {
      type: String
    },
    password: {
      type: String
    },
    language: {
      type: String,
      default: 'hi'
    },
    ecoPoints: {
      type: Number,
      default: 0
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

userSchema.pre('save', function (next) {
  if (this.phoneNumber && !this.phone) {
    this.phone = this.phoneNumber;
  } else if (this.phone && !this.phoneNumber) {
    this.phoneNumber = this.phone;
  }
  if (this.fullName && !this.name) {
    this.name = this.fullName;
  } else if (this.name && !this.fullName) {
    this.fullName = this.name;
  }
  next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
>>>>>>> 4eb7d4565434754dde59ec0f1b82534c61c5bd59
