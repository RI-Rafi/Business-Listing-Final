import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import listingRoutes from './routes/listing.routes.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';
import metaRoutes from './routes/meta.routes.js';
import cartRoutes from './routes/cart.routes.js';
import chatRoutes from './routes/chat.routes.js';
import marketplaceRoutes from './routes/marketplace.routes.js';
import preferencesRoutes from './routes/preferences.routes.js';

const app = express();

app.use(helmet());


app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/meta', metaRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/preferences', preferencesRoutes); // ReX AI Memory System

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { message: 'Route not found' },
  });
});

app.use(errorHandler);

export default app;
