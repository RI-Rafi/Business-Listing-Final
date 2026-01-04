import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { config } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import cartRoutes from './routes/cart.routes.js';
import chatRoutes from './routes/chat.routes.js';

const app = express();

// Middleware
app.use(helmet());
app.use(
    cors({
        origin: config.corsOrigin,
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Marketplace API is running',
    });
});

// Error handler
app.use(errorHandler);

export default app;
