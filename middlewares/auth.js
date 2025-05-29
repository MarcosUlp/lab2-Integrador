const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'Token requerido' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = decoded.id;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Token inválido' });
  }
}

module.exports = verificarToken;
