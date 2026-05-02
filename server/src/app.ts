import express, { Express } from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { initializePassport } from './config/passport.js';
import { connectDB } from './config/database.js';
import { loadDatasetQuestions } from './services/datasetLoader.js';
import authRoutes from './routes/auth.routes.js';
import testsRoutes from './routes/tests.routes.js';
import resultsRoutes from './routes/results.routes.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

export const createApp = (): Express => {
  const app = express();

  // Middleware
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }));

  // Log all requests
  app.use((req, res, next) => {
    console.log(`>>> ${req.method} ${req.path}`);
    next();
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 30 * 60 * 1000 // 30 minutes
    }
  }));

  // Passport initialization
  initializePassport();
  app.use(passport.initialize());
  app.use(passport.session());

  // Root endpoint
  app.get('/', (req, res) => {
    res.json({
      message: 'Adaptive IQ Assessment API',
      version: '1.0.0',
      endpoints: {
        health: '/api/health',
        auth: '/api/auth',
        tests: '/api/tests',
        results: '/api/results'
      }
    });
  });

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/tests', testsRoutes);
  app.use('/api/results', resultsRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK' });
  });

  // Error handling
  app.use(errorHandler);

  return app;
};

// Initialize dataset on app startup
export const initializeApp = async () => {
  await loadDatasetQuestions();
};

export default createApp;

