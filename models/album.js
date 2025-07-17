const pool = require('../database/db');

module.exports = {
  crearAlbum: async (usuarioId, titulo) => {
    const [result] = await pool.query(
      'INSERT INTO albumes (usuario_id, titulo) VALUES (?, ?)',
      [usuarioId, titulo]
    );
    return result.insertId;
  },
  async obtenerPorUsuario(usuarioId) {//devuelve un arreglo con todas las filas de las tabla albumes de cierto usuario
    const [rows] = await pool.query(
      'SELECT * FROM albumes WHERE usuario_id = ?',
      [usuarioId]
    );
    return rows;
  },

  async obtenerPorAlbum_id(albumId) {
    const [rows] = await pool.query(
      `SELECT i.* 
      FROM imagenes i 
      JOIN albumes a ON i.albumes_id = a.albumes_id 
      WHERE i.albumes_id = ?
      ORDER BY fecha_creacion ASC`,
      [albumId]
    );
    return rows;
  },
  obtenerPorUsuarioId: async (usuarioId) => { //repetido
    // Obtener los álbumes
    const [albumes] = await pool.query(
      'SELECT * FROM albumes WHERE usuario_id = ?',
      [usuarioId]
    );
    return albumes;
  },
};
