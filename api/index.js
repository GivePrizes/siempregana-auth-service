import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from '../routes/authRoutes.js';

dotenv.config();
const app = express();

app.use(cors({ origin: process.env.CORS_ALLOWED_ORIGINS?.split(',') || [] }));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('AUTH SERVICE OK'));

// ← ESTO ES LO QUE ESPERA VERCEL
export default function handler(req, res) {
  app(req, res);
}

// api/index.js
export default function handler(req, res) {
  res.status(200).json({ message: "AUTH SERVICE VIVO Y FUNCIONANDO 🚀" });
}