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
    if (!req.files || req.files.length < 1 || req.files.length > 20) {
      return res.status(400).send('Debes subir entre 1 y 20 imágenes.');
    }
    const valores = archivos.map(img => [albumId, img.filename]);
    await pool.query(
      'INSERT INTO imagenes (album_id, archivo) VALUES ?',
      [valores]
    );
  }
};
