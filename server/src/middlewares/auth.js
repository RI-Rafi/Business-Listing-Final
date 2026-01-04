import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { config } from '../config/env.js';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies[config.cookieName] || req.headers.authorization?.replace('Bearer ', '');

    console.log(`🔐 Auth Check - Path: ${req.path}`);
    console.log(`🍪 Cookie present: ${!!req.cookies[config.cookieName]}`);
    console.log(`📋 Token available: ${!!token}`);

    if (!token) {
      console.log('❌ No token found - authentication failed');
      throw new ApiError(401, 'Authentication required');
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.userId);

    if (!user) {
      console.log(`❌ User not found for ID: ${decoded.userId}`);
      throw new ApiError(401, 'User not found');
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
      _id: user._id, // Add full ObjectId for cart queries
    };

    console.log(`✅ Authenticated: ${user.email} (${user._id})`);
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      console.log(`❌ Invalid token: ${error.message}`);
      next(new ApiError(401, 'Invalid token'));
    } else {
      next(error);
    }
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Access denied'));
    }

    next();
  };
};
