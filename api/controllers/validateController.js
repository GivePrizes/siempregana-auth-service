export const validate = async (req, res) => {
  res.json({ valid: true, user: req.user });
};