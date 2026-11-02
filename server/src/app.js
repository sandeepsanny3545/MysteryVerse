import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import caseRoutes from './routes/caseRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// CORS Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Body Parser Middleware
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'MysteryVerse API',
    timestamp: new Date().toISOString()
  });
});

// Case Routes
app.use('/api/cases', caseRoutes);

// 404 Route Fallback
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Centralized Error Handler
app.use(errorHandler);

export default app;
