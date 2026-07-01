// Production-ready app configuration with CORS support
// This can be used as a replacement or addition to app.js for deployment

import express from 'express';
import cors from 'cors';

// Create Express app
const app = express();

// CORS configuration for production
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://your-username.github.io', // Replace with your GitHub Pages URL
  /\.github\.io$/ // Allow all GitHub Pages
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) return allowed.test(origin);
      return origin === allowed;
    })) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Keep-alive endpoint to prevent service from sleeping
app.get('/keep-alive', (req, res) => {
  res.json({ status: 'alive' });
});

// Export the app
export default app;
