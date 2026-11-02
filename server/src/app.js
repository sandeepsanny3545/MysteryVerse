import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import caseRoutes from './routes/caseRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Parse and normalize allowed origins for development and production
const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'https://mysteryverse-frontend.onrender.com'
];

// Read CLIENT_URL from environment (supports single or comma-separated origins, with or without trailing slash)
const envClientUrls = (process.env.CLIENT_URL || '')
  .split(',')
  .map(url => url.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const allowedOrigins = Array.from(new Set([...defaultAllowedOrigins, ...envClientUrls]));

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, curl, server-to-server, health check probes)
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = origin.trim().replace(/\/+$/, '');

    // Allow explicitly listed origins
    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    // Allow any localhost / 127.0.0.1 port for local development
    if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalizedOrigin)) {
      return callback(null, true);
    }

    // Allow any deployed onrender domain
    if (/^https:\/\/.*\.onrender\.com$/.test(normalizedOrigin)) {
      return callback(null, true);
    }

    console.warn(`[CORS Blocked] Origin: "${origin}" not permitted by CORS policy.`);
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
};

// Apply CORS middleware to all incoming requests
app.use(cors(corsOptions));

// Explicitly handle OPTIONS preflight requests for all routes
app.options('*', cors(corsOptions));

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
