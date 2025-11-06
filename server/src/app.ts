import express, { Express } from 'express';
import { setupMiddlewares } from './middlewares/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { healthRoutes } from './routes/health.routes.js';
import { authRoutes } from './routes/auth.routes.js';

const createApp = (): Express => {
  const app = express();

  // Setup middlewares
  setupMiddlewares(app);

  // Health check route (before API routes)
  app.use('/health', healthRoutes);

  // API routes
  app.use('/api/v1/auth', authRoutes);

  // 404 handler
  app.use(notFoundHandler);

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
};

export default createApp;

