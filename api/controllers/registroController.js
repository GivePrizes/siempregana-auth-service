import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../utils/db.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const registro = async (req, res) => {
  const { nombre, email, telefono, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, email, telefono, password_hash, rol) VALUES ($1, $2, $3, $4, $5) RETURNING id, nombre, email, rol',
      [nombre, email, telefono || null, hash, 'user']
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, rol: user.rol }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};