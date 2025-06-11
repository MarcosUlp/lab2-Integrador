const Solicitud = require('../models/solicitudesAmistad');
const pool = require('../database/db');

const enviarSolicitud = async (req, res) => {
  const emisorId = req.session.user.id;
  const receptorId = parseInt(req.params.id);

  if (emisorId === receptorId) {
    return res.status(400).send('No podés enviarte una solicitud a vos mismo.');
  }

  const existe = await Solicitud.solicitudExistente(emisorId, receptorId);
  if (existe) {
    return res.status(400).send('Ya enviaste una solicitud.');
  }

  await Solicitud.enviarSolicitud(emisorId, receptorId);
  res.redirect('/perfil/' + receptorId);
};

const verPendientes = async (req, res) => {
  const userId = req.session.user.id;
  const solicitudes = await Solicitud.obtenerPendientesPara(userId);
  res.render('notificaciones/solicitudes', { solicitudes });
};

const aceptarSolicitud = async (req, res) => {
  const solicitudId = req.params.id;
  const userId = req.session.user.id;

  const solicitud = await Solicitud.getSolicitudPorIdYReceptor(solicitudId, userId);
  if (!solicitud) {
    return res.status(403).send('No autorizado');
  }

  await Solicitud.aceptarSolicitud(solicitudId);

  // Crear relación en la tabla seguidores
  await pool.query(
    'INSERT INTO seguidores (seguidor_id, seguido_id, fecha_inicio) VALUES (?, ?, NOW())',
    [solicitud.de_usuario_id, solicitud.para_usuario_id]
  );

  res.redirect('/solicitudes/pendientes');
};

const rechazarSolicitud = async (req, res) => {
  const solicitudId = req.params.id;
  const userId = req.session.user.id;

  const solicitud = await Solicitud.getSolicitudPorIdYReceptor(solicitudId, userId);
  if (!solicitud) {
    return res.status(403).send('No autorizado');
  }

  await Solicitud.rechazarSolicitud(solicitudId);
  res.redirect('/solicitudes/pendientes');
};

module.exports = {
  enviarSolicitud,
  verPendientes,
  aceptarSolicitud,
  rechazarSolicitud
};
