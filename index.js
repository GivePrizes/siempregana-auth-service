// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://siempre-ganas.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

// Ruta raíz
app.get('/', (req, res) => {
  res.send('AUTH SERVICE OK 🚀');
});

// Puedes agregar más rutas aquí si lo deseas

// Exportar como función serverless
export default function handler(req, res) {
  app(req, res);
}