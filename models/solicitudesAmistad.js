const pool = require('../database/db');

module.exports = {
  enviarSolicitud: async (deUsuarioId, paraUsuarioId) => {
    const [result] = await pool.query(
      'INSERT INTO solicitud_seguimiento (de_usuario_id, para_usuario_id, estado, fecha_solicitud) VALUES (?, ?, "pendiente")',
      [deUsuarioId, paraUsuarioId]
    );
    return result.insertId;
  },

  //verificamos si ya existe una solicitud para que no se repitan
  SolicitudPendiente: async (deUsuarioId, paraUsuarioId)=> {
    const[rows]= await pool.query(
      'SELECT * FROM solicitudes_seguimiento WHERE de_usuario_id = ? AND para_usuario_id = ? AND estado = "pendiente"',
      [deUsuarioId, paraUsuarioId]
    );
  },


  aceptarSolicitud: async (solicitudId) => {
    await pool.query(
      'UPDATE solicitudes_seguimiento SET estado = "aceptado" WHERE solicitudes_id = ?',
      [solicitudId]
    );
  },

  rechazarSolicitud: async (solicitudId) => {
    await pool.query(
      'UPDATE solicitudes_seguimiento SET estado = "rechazado" WHERE solicitudes_id = ?',
      [solicitudId]
    );
  },

//con esta vamos a obtener todas las solicitudes pendientes para un usuario
  obtenerSolicitudesPendientes: async (usuarioId) => {
    const [rows] = await pool.query(
       `SELECT ss.solicitudes_id, ss.de_usuario_id, u.username, u.avatar, ss.fecha_solicitud
       FROM solicitudes_seguimiento ss
       JOIN usuarios u ON ss.de_usuario_id = u.usuario_id
       WHERE ss.para_usuario_id = ? AND ss.estado = "pendiente"
       ORDER BY ss.fecha_solicitud DESC`,
      [usuarioId]
    );
    return rows;
  },

//esto es para obtener una solicitud especifica para validar autorizacion
obtenerSolicitudPorIdYReceptor: async (solicitudId, receptorId) => {
    const [rows] = await pool.query(
      'SELECT * FROM solicitudes_seguimiento WHERE solicitudes_id = ? AND para_usuario_id = ?',
      [solicitudId, receptorId]
    );
    return rows[0];
  },

  //con esta vamos a obtener una lista con todos la lista de amigos de un usuario
obtenerListaDeAmigos: async (usuarioId)=> {
const [rows] = await pool.query(
`SELECT u.usuario_id, u.username, u.avatar
       FROM solicitudes_seguimiento ss
       JOIN usuarios u ON ss.de_usuario_id = u.usuario_id
       WHERE ss.para_usuario_id = ? AND ss.estado = "aceptado"`,
       [usuarioId]
);
return rows;
}
/*    
  obtenerAmigos: async (usuarioId) => {
    const [rows] = await pool.query(`
      SELECT u.id, u.username
      FROM usuarios u
      JOIN amistades a ON (
        (a.de_usuario_id = u.id AND a.para_usuario_id = ?) OR 
        (a.para_usuario_id = u.id AND a.de_usuario_id = ?)
      )
      WHERE a.estado = 'aceptada' AND u.id != ?
    `, [usuarioId, usuarioId, usuarioId]);
    return rows;
  },

  verificarRelacion: async (usuario1, usuario2) => {
    const [rows] = await pool.query(
      `SELECT * FROM amistades 
       WHERE (
        (de_usuario_id = ? AND para_usuario_id = ?) OR
        (de_usuario_id = ? AND para_usuario_id = ?)
       ) AND estado = 'aceptada'`,
      [usuario1, usuario2, usuario2, usuario1]
    );
    return rows.length > 0;
  }
    */
};
