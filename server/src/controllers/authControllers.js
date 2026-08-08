import User from '../models/User.js'; // .js is required
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Generate Token Function
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d', // The farmer will stay logged in for 7 days
    });
};

// @desc    Register a new farmer
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
    try {
        const { phone, password, fullName } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ phone });
        if (userExists) {
            return res.status(400).json({ message: 'User (Phone Number) already exists!' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            phone,
            password: hashedPassword,
            fullName
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                fullName: user.fullName,
                phone: user.phone,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
    try {
        const { phone, password } = req.body;

        // Check for user
        const user = await User.findOne({ phone });

        // Compare hashed password
        if (user && (await bcrypt.compare(password, user.password))) {
            res.status(200).json({
                _id: user.id,
                fullName: user.fullName,
                phone: user.phone,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid phone number or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};