const db = require('../database/db');

module.exports = {
  async agregarImagenes(albumId, archivos) {
    const valores = archivos.map(nombre => [albumId, '/uploads/albumes/' + nombre]);//estoy haciendo map pero le estoy pasando una cadena
    await db.query(
      'INSERT INTO imagenes (albumes_id, archivo) VALUES ?',
      [valores]
    );
  },

  async obtenerPorAlbum(albumId) {
    const [rows] = await db.query('SELECT * FROM imagenes WHERE albumes_id = ?', [albumId]);
    return rows;
  },
  
    async obtenerImagenesPorUsuario(usuarioId) {//
      const [rows] = await db.query(
        `SELECT i.archivo, i.albumes_id, a.titulo 
       FROM imagenes i
       INNER JOIN albumes a ON i.albumes_id = a.albumes_id
       WHERE a.usuario_id = ?
       ORDER BY a.fecha_creacion DESC`,
        [usuarioId]
      );
      return rows;
    }
  };

