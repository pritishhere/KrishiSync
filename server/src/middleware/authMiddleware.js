import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'krishisync_super_secret_jwt_key_2026';

export async function protect(req, res, next) {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      // Fetch user from database if connected, or use decoded token payload
      let user;
      try {
        user = await User.findById(decoded.id).select('-otp');
      } catch (_err) {
        // Fallback for standalone mode
      }

      req.user = user || {
        _id: decoded.id,
        phoneNumber: decoded.phoneNumber,
        name: decoded.name || 'Farmer'
      };

      return next();
    } catch (error) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Invalid or expired token.' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Unauthorized: No token provided in Authorization header.' });
  }
}
