import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
dotenv.config();
const app = express();
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    console.error('❌ DATABASE_URL is not defined in .env');
    process.exit(1);
}
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
console.log('⏳ Connecting to database...');
prisma.$connect()
    .then(() => console.log('✅ Database connected'))
    .catch(err => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
});
const PORT = process.env.PORT || 3000;
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
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
});
export { prisma };
