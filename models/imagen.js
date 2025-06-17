const pool = require('../database/db');

module.exports = {
  async agregarImagenes(albumId, archivos) {
    const valores = archivos.map(nombre => [albumId, '/uploads/albumes/' + nombre]);//estoy haciendo map pero le estoy pasando una cadena
    await pool.query(
      'INSERT INTO imagenes (albumes_id, archivo) VALUES ?',
      [valores]
    );
  },

  async obtenerPorAlbum(albumId) {
    const [rows] = await pool.query('SELECT * FROM imagenes WHERE albumes_id = ?', [albumId]);
    return rows;
  },

  async obtenerImagenesPorUsuario(usuarioId) {
    const [rows] = await pool.query(
      `SELECT i.imagen_id, i.archivo, i.albumes_id, a.titulo, a.fecha_creacion
     FROM imagenes i
     INNER JOIN albumes a ON i.albumes_id = a.albumes_id
     WHERE a.usuario_id = ?
     ORDER BY a.fecha_creacion DESC`,
      [usuarioId]
    );
    return rows;
  }

};

