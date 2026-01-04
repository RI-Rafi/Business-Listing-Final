import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export const generateToken = (userId) => {
    return jwt.sign({ id: userId }, config.jwtSecret, {
        expiresIn: config.jwtExpire,
    });
};

export const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user._id);

    const options = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true,
        secure: config.nodeEnv === 'production',
        sameSite: 'lax',
    };

    res.status(statusCode).cookie(config.cookieName, token, options).json({
        success: true,
        data: {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                providerProfile: user.providerProfile,
            },
            token,
        },
    });
};
