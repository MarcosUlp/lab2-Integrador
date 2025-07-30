const Solicitud = require('../models/solicitudesAmistad');
const notificaciones = require('../models/notificaciones');

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

  const solicitudId = await Solicitud.enviarSolicitud(emisorId, receptorId);
  console.log('solicitud enviada, id de la solicitud: ', solicitudId); // si tengo el id de la solicitud
  //crear notificacion tipo solicitud
  await notificaciones.crear({
    de_usuario_id: emisorId,
    para_usuario_id: receptorId,
    tipo: 'solicitud',
    imagen_id: null,
    solicitud_id: solicitudId //pero aca no se llena 
  });

  if(req.headers['x-requested-with']==='XMLHttpRequest'){
    return res.status(200).json({mensaje: 'Solicitud enviada'})
  }

  res.redirect('/usuarios/perfilVisitado/' + receptorId);
};

const verPendientes = async (req, res) => {
  const userId = req.session.user.id;
  const solicitudes = await Solicitud.obtenerSolicitudesPendientes(userId);
  console.log('solicitudes obtenidas: ', solicitudes)
  res.render('perfil/solicitudes', { solicitudes });
};
/*
const aceptarSolicitud = async (req, res) => { 
  const solicitudId = req.params.id;
  const userId = req.session.user.id;

  try {
    const solicitud = await Solicitud.obtenerSolicitudPorIdYReceptor(solicitudId, userId);
    if (!solicitud) {
      return res.status(403).json({ error: 'No autorizado' }); // 👈 importante: JSON
    }

    await Solicitud.aceptarSolicitud(solicitudId);

    // Crear relación en la tabla seguidores
    await Solicitud.crearRelacionSeguimiento(solicitud.de_usuario_id, solicitud.para_usuario_id);

    return res.json({ success: true, mensaje: 'Solicitud aceptada' }); // ✅ solo esta respuesta
  } catch (error) {
    console.error('Error al aceptar solicitud:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
};
*/
const aceptarSolicitud = async (req, res) => {
  const solicitudId = req.params.id;
  const userId = req.session.user?.id;

  console.log('🧠 User ID en sesión:', userId);
  console.log('🔍 Solicitud ID:', solicitudId);

  try {
    const solicitud = await Solicitud.obtenerSolicitudPorIdYReceptor(solicitudId, userId);
    console.log('📦 Solicitud encontrada:', solicitud);

    if (!solicitud) {
      return res.status(403).json({ error: 'No autorizado — la solicitud no es para este usuario' });
    }

    await Solicitud.aceptarSolicitud(solicitudId);
    await Solicitud.crearRelacionSeguimiento(solicitud.de_usuario_id, solicitud.para_usuario_id);

    return res.json({ success: true, mensaje: 'Solicitud aceptada' });
  } catch (error) {
    console.error('💥 Error en aceptarSolicitud:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
};
const aceptarSolicitudDesdeFormulario = async (req, res) => {
  const solicitudId = req.body.solicitud_id;
  const userId = req.session.user?.id;

  try {
    const solicitud = await Solicitud.obtenerSolicitudPorIdYReceptor(solicitudId, userId);

    if (!solicitud) {
      return res.status(403).send('No autorizado');
    }

    await Solicitud.aceptarSolicitud(solicitudId);
    await Solicitud.crearRelacionSeguimiento(solicitud.de_usuario_id, solicitud.para_usuario_id);

    return res.redirect('/notificaciones/listado'); // 🔁 redirige de vuelta a la vista
  } catch (error) {
    console.error('Error en aceptarSolicitudDesdeFormulario:', error);
    return res.status(500).send('Error en el servidor');
  }
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
  rechazarSolicitud,
  aceptarSolicitudDesdeFormulario
};
