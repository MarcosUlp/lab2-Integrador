const notificacionModel = require('../models/notificaciones');
const socketInstance = require('./socketInstance');
const socketStore = require('./socketStore');

async function crearYEmitirNotificacion({ para_usuario_id, de_usuario_id, tipo, mensaje, solicitud_id }) {
  const notif = await notificacionModel.crear({
    para_usuario_id: para_usuario_id,
    de_usuario_id: de_usuario_id,
    tipo,
    mensaje,
    solicitud_id: solicitud_id,
  });
  console.log('[SERVICE] Notificación creada:', notif);
  const io = socketInstance.getIo();
  const socketId = socketStore.obtenerSocketId(para_usuario_id);

  console.log('la notificacion va para el usuario ', para_usuario_id);
  console.log('antes del if vemos el socket del usuario: ', socketId);


  if (socketId && io) {
    // Obtener info adicional para mostrar (como imagen de perfil)
    const info = await notificacionModel.obtenerInfoUsuario(de_usuario_id);

    console.log('[SERVICE] if que compara socketId&&io', socketId);
    io.to(socketId).emit('nueva_notificacion', {
      ...notif,
      username: info.username,
      foto_perfil: info.foto_perfil,
      tipo: tipo,
      mensaje: mensaje,
      solicitud_id: solicitud_id,
    });
    console.log('[SERVICE] sera null?? ', solicitud_id);
  }
  console.log('[SERVICE] Intentando emitir a usuario ID:', para_usuario_id);
  console.log('[SERVICE] Socket conectado:', socketId);

}

module.exports = {
  crearYEmitirNotificacion
};
