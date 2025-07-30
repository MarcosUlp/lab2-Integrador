const notificacionesModelo = require('../models/notificaciones');

const contarNotificaciones = async (req, res, next) => {
  try {
    if (req.session && req.session.usuarioId) {
      const cantidad = await notificacionesModelo.contarNoLeidas(req.session.usuarioId);
      const notificaciones = await notificacionesModelo.obtenerNotificacionesPorUsuario(req.session.usuarioId);

      res.locals.notiNoVistas = cantidad;
      res.locals.notificaciones = notificaciones;
    } else {
      res.locals.notiNoVistas = 0;
      res.locals.notificaciones = [];
    }
    next();
  } catch (error) {
    console.error('Error en middleware de notificaciones:', error);
    next(error);
  }
};

module.exports = contarNotificaciones;
