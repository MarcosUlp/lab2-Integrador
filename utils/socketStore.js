const usuarioToSocket = new Map();
const socketToUsuario = new Map();

function registrarSocket(userId, socketId) {
  const userIdStr = String(userId);
  console.log('[SOCKET STORE] Registrando:', userIdStr, socketId);
  usuarioToSocket.set(userIdStr, socketId);
  socketToUsuario.set(socketId, userIdStr);
}

function obtenerSocketId(para_usuario_id) {
  const userIdStr = String(para_usuario_id);
  console.log('[SOCKET STORE] Obteniendo socket del usuario:', userIdStr);
  console.log('[SOCKET STORE] Claves guardadas:', [...usuarioToSocket.keys()]);
  return usuarioToSocket.get(userIdStr);
}

function eliminarSocket(socketId) {
  const userId = socketToUsuario.get(socketId);
  socketToUsuario.delete(socketId);
  usuarioToSocket.delete(userId);
}

module.exports = {
  registrarSocket,
  obtenerSocketId,
  eliminarSocket
};
