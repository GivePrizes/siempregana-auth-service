// api/controllers/validateController.js
export const validate = async (req, res) => {
  try {
    // gracias al middleware jwtValidate, aquí ya tenemos req.user
    const user = req.user;

    if (!user) {
      return res.status(401).json({ valid: false, message: 'Token inválido.' });
    }

    return res.json({
      valid: true,
      user,
    });
  } catch (error) {
    console.error('Error en validate:', error);
    return res.status(500).json({ valid: false, message: 'Error al validar token.' });
  }
};
