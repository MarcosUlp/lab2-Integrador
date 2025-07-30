const modelo = require('../models/notificaciones');
//listar va a usarse por /notificaciones/listado
exports.listar = async (req, res) => {
  try {
    await modelo.marcarComoVistas(req.session.user.id);
    const notificaciones = await modelo.obtenerPorUsuario(req.session.user.id);
    res.render('notificaciones/listado', { notificaciones });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error al cargar notificaciones');
  }
};

exports.marcarVistas = async (req, res) => {
  try {
    await modelo.marcarComoVistas(req.session.user.id);
    res.redirect('/notificaciones/listado');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al marcar como vistas');
  }
};

//este va a ser usado por el dropdown
exports.obtenerRecientes = async (req, res) => {
  try {
    const usuarioId = req.session.user.id;

    // Obtené solo las 5 más recientes
    const notificaciones = await modelo.obtenerNotificacionesPorUsuario(usuarioId);
    console.log("🔁 Notificaciones devueltas:", notificaciones);
    res.json({ notificaciones });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error al obtener notificaciones' });
  }
};

