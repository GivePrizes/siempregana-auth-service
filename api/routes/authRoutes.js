// api/routes/authRoutes.js
import { Router } from 'express';                // 👈 IMPORTANTE
import { registro, login, validate } from '../controllers/authController.js';
import { verifyToken } from '../middleware/jwtValidate.js';

const router = Router();

// Registro
router.post('/registro', registro);

// Login
router.post('/login', login);

// Validar token
router.get('/validate', verifyToken, validate);

export default router;
