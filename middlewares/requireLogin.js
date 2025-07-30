function requireLogin(req, res, next) {
  console.log('¿Usuario en sesión?', req.session.user);
  if (req.session && req.session.user) {
    return next();
  }

  // Detecta si es una petición fetch/ajax
  const aceptaJSON = req.headers.accept && req.headers.accept.includes('application/json');
  
  if (aceptaJSON) {
    return res.status(403).json({ error: 'No autorizado' });
  } else {
    return res.redirect('/auth/login'); // corregí también la barra al inicio
  }
}

module.exports = requireLogin;
