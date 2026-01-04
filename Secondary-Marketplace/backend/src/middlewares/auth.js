import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { config } from '../config/env.js';

export const protect = async (req, res, next) => {
    try {
        let token;

        // Get token from cookie
        if (req.cookies && req.cookies[config.cookieName]) {
            token = req.cookies[config.cookieName];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                error: { message: 'Not authorized to access this route' },
            });
        }

        try {
            const decoded = jwt.verify(token, config.jwtSecret);
            req.user = await User.findById(decoded.id);
            next();
        } catch (err) {
            return res.status(401).json({
                success: false,
                error: { message: 'Not authorized to access this route' },
            });
        }
    } catch (error) {
        next(error);
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: { message: `User role ${req.user.role} is not authorized to access this route` },
            });
        }
        next();
    };
};
