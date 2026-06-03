import cors from 'cors';
import express from 'express';
import passport from 'passport';
import './config/passport.js';
import { env } from './config/env.js';
import { authRouter } from './routes/auth.js';
import { apiRouter } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import { createHttpError } from './utils/httpError.js';

export function createApp() {
  const app = express();

  const allowedOrigins = [env.frontendUrl].filter(Boolean);

  app.use(cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(createHttpError(403, 'Not allowed by CORS', 'CORS_NOT_ALLOWED'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type', 'Accept'],
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(passport.initialize());

  app.get('/', (_req, res) => {
    res.json({
      ok: true,
      service: 'aperture-backend',
      message: 'Aperture API is running',
    });
  });

  app.use('/auth', authRouter);
  app.use('/api', apiRouter);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
