const pool = require('../database/db');

module.exports = {
  crearAlbum: async (usuarioId, titulo) => {
    const [result] = await pool.query(
      'INSERT INTO albumes (usuario_id, titulo) VALUES (?, ?)',
      [usuarioId, titulo]
    );
    return result.insertId;
  },

  agregarImagenes: async (albumId, archivos) => {
    const valores = archivos.map(img => [albumId, img.filename]);
    await pool.query(
      'INSERT INTO imagenes (album_id, archivo) VALUES ?',
      [valores]
    );
  }
};
