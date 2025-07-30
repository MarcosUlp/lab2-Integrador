const pool = require('../database/db');

module.exports = {
  agregarComentario: async (usuarioId, imagenId, contenido) => {
    const [result] = await pool.query(
      'INSERT INTO comentarios (usuario_id, imagenes_id, contenido) VALUES (?, ?, ?)',
      [usuarioId, imagenId, contenido]
    );
    return result.insertId;
  },

  obtenerComentariosPorImagen: async (imagenId) => {
    const [rows] = await pool.query(
      `SELECT c.*, u.username, u.foto_perfil 
       FROM comentarios c
       JOIN usuarios u ON c.usuario_id = u.usuario_id
       WHERE c.imagenes_id = ?
       ORDER BY c.fecha_comentario DESC`,
      [imagenId]
    );
    return rows;
  },

obtenerUsuarioDeImagen: async (imagenId) => {
  const [rows] = await pool.query(
    `SELECT a.usuario_id
     FROM imagenes i
     JOIN albumes a ON i.albumes_id = a.albumes_id
     WHERE i.imagenes_id = ?`,
    [imagenId]
  );
  return rows[0]; // Devuelve un objeto con usuario_id
}
};
