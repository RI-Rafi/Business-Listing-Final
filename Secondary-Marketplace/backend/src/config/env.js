import dotenv from 'dotenv';

dotenv.config();

export const config = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRE || '7d',
    cookieName: process.env.COOKIE_NAME || 'marketplace_auth_token',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5174',
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS,
    openaiApiKey: process.env.OPENAI_API_KEY,
};
