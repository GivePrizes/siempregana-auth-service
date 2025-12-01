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
    const token = jwt.sign({ id: result.rows[0].id, rol: result.rows[0].rol }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: result.rows[0] });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });
    
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Credenciales inválidas' });
    
    const token = jwt.sign({ id: user.id, rol: user.rol }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const validate = async (req, res) => {
  res.json({ valid: true, user: req.user });
};