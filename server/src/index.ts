import express from 'express';
import cors from 'cors';
import { env, prisma, logger } from './config/index.js';

const app = express();

logger.info('⏳ Connecting to database...');
prisma.$connect()
  .then(() => logger.info('✅ Database connected'))
  .catch(err => {
    logger.error('❌ Database connection failed:', err);
    process.exit(1);
  });

const PORT = env.PORT;

app.use(cors());
app.use(express.json());

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import { globalErrorHandler } from './utils/error.handler.js';

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Global Error Handler (Must be last)
app.use(globalErrorHandler);

app.listen(PORT, () => {
  logger.info(`🚀 Server ready at http://localhost:${PORT}`);
});

export { prisma };
