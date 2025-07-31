/*const { obtenerSocketId } = require('./socketStore');
let io;

function setIO(ioInstance) {
  io = ioInstance;
}

function emitirNotificacion(usuarioId, notificacion) {
  const socketId = obtenerSocketId(usuarioId);
  console.log('esta seria mi notificacion ', notificacion);
  if (socketId && io) {
    io.to(socketId).emit('nueva_notificacion', notificacion);
  }
}

module.exports = {
  setIO,
  emitirNotificacion
};*/
let ioInstance;

module.exports = {
  setIo: (io) => {
    ioInstance = io;
  },
  getIo: () => ioInstance,
};

