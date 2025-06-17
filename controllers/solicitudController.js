const Solicitud = require('../models/solicitudesAmistad');

const enviarSolicitud = async (req, res) => {
  const emisorId = req.session.user.id;
  const receptorId = parseInt(req.params.id);

  if (emisorId === receptorId) {
    return res.status(400).send('No podés enviarte una solicitud a vos mismo.');
  }

  const existe = await Solicitud.solicitudPendiente(emisorId, receptorId);
  if (existe) {
    return res.status(400).send('Ya enviaste una solicitud.');
  }

  await Solicitud.enviarSolicitud(emisorId, receptorId);

  if(req.headers['x-requested-with']==='XMLHttpRquest'){
    return res.status(200).json({mensaje: 'Solicitud enviada'})
  }

  res.redirect('/perfil/' + receptorId);
};

const verPendientes = async (req, res) => {
  const userId = req.session.user.id;
  const solicitudes = await Solicitud.obtenerSolicitudesPendientes(userId);
  res.render('perfil/solicitudes', { solicitudes });
};

const aceptarSolicitud = async (req, res) => {
  const solicitudId = req.params.id;
  const userId = req.session.user.id;

  const solicitud = await Solicitud.obtenerSolicitudPorIdYReceptor(solicitudId, userId);
  if (!solicitud) {
    return res.status(403).send('No autorizado');
  }

  await Solicitud.aceptarSolicitud(solicitudId);

  // Crear relación en la tabla seguidores
  await Solicitud.crearRelacionSeguimiento(solicitud.de_usuario_id, solicitud.para_usuario_id);

  res.redirect('/solicitudes/pendientes');
};

const rechazarSolicitud = async (req, res) => {
  const solicitudId = req.params.id;
  const userId = req.session.user.id;

  const solicitud = await Solicitud.obtenerSolicitudPorIdYReceptor(solicitudId, userId);
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
