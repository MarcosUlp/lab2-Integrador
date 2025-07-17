const modelo = require('../models/notificacion');

exports.listar = async (req, res) => {
  try {
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
    res.redirect('/notificaciones');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al marcar como vistas');
  }
};
