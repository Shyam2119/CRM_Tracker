import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import opportunityRoutes from './routes/opportunityRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        (process.env.NODE_ENV !== 'production' && /^http:\/\/localhost:\d+$/.test(origin))
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.get('/', (req, res) => {
  res.json({
    name: 'CRM Opportunity Tracker API',
    status: 'running',
    health: '/api/health',
    endpoints: {
      auth: '/api/auth',
      opportunities: '/api/opportunities',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CRM Opportunity Tracker API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/opportunities', opportunityRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
