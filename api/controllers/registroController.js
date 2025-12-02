// api/controllers/registroController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../utils/db.js';

export const registro = async (req, res) => {
  try {
    const { nombre, email, telefono, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Nombre, email y contraseña son obligatorios.' });
    }

    // Verificar si el email ya existe
    const userExistResult = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email]
    );

    if (userExistResult.rowCount > 0) {
      return res.status(409).json({ message: 'Este email ya está registrado.' });
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insertar usuario
    const insertResult = await pool.query(
      `INSERT INTO usuarios (nombre, email, telefono, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nombre, email, rol`,
      [nombre, email, telefono || null, passwordHash]
    );

    const user = insertResult.rows[0];

    // Generar JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      token,
      user,
    });
  } catch (error) {
    console.error('Error en registro:', error);
    return res.status(500).json({ message: 'Error al registrar usuario.' });
  }
};
