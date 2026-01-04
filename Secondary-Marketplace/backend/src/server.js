import app from './app.js';
import { connectDB } from './config/db.js';
import { config } from './config/env.js';

const startServer = async () => {
    try {
        await connectDB();
        app.listen(config.port, () => {
            console.log(`🚀 Marketplace server running on port ${config.port} in ${config.nodeEnv} mode`);
            console.log(`📍 Frontend: ${config.corsOrigin}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
