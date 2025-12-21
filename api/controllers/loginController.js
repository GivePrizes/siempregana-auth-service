// api/controllers/loginController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../utils/db.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios.' });
    }

    // Buscar usuario
    const result = await pool.query(
      'SELECT id, nombre, email, rol, password_hash FROM usuarios WHERE email = $1',
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const user = result.rows[0];

    // Comparar password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // Determinar si el usuario es admin de cuentas (whitelist por email)
    const adminsCuentas = (process.env.ADMINS_CUENTAS_EMAILS || '')
      .split(',').map(s => s.trim().toLowerCase()).filter(Boolean);

    const adminsPagos = (process.env.ADMINS_PAGOS_EMAILS || '')
      .split(',').map(s => s.trim().toLowerCase()).filter(Boolean);

    const permisos = [];
    if (user.rol === 'admin') {
      if (adminsCuentas.includes(user.email.toLowerCase())) permisos.push('cuentas:gestionar');
      if (adminsPagos.includes(user.email.toLowerCase())) permisos.push('pagos:aprobar');
    }



    // Generar JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol, permisos },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );


    // No devolvemos password_hash
    delete user.password_hash;

    return res.json({
      token,
      user,
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ message: 'Error al iniciar sesión.' });
  }
};
