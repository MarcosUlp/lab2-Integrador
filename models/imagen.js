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
      `SELECT i.imagenes_id, i.archivo, i.albumes_id, a.titulo, a.fecha_creacion
     FROM imagenes i
     INNER JOIN albumes a ON i.albumes_id = a.albumes_id
     WHERE a.usuario_id = ?
     ORDER BY a.fecha_creacion DESC`,
      [usuarioId]
    );
    return rows;
  },

  async obtenerImagenesConComentarios(usuarioId) {
    const [imagenesRaw] = await pool.query(
      `SELECT i.*, c.comentario_id, c.contenido, u.username, u.foto_perfil
     FROM imagenes i
     LEFT JOIN comentarios c ON i.imagenes_id = c.imagenes_id
     LEFT JOIN usuarios u ON c.usuario_id = u.usuario_id
     JOIN albumes a ON i.albumes_id = a.albumes_id
     WHERE a.usuario_id = ?
     ORDER BY i.imagenes_id DESC, c.comentario_id ASC`,
      [usuarioId]
    );

    const imagenesMap = {};

    imagenesRaw.forEach(row => {
      if (!imagenesMap[row.imagenes_id]) {
        imagenesMap[row.imagenes_id] = {
          imagenes_id: row.imagenes_id,
          archivo: row.archivo,
          albumes_id: row.albumes_id,
          comentarios: []
        };
      }

      if (row.comentario_id) {
        imagenesMap[row.imagenes_id].comentarios.push({
          contenido: row.contenido,
          username: row.username,
          foto_perfil: row.foto_perfil
        });
      }
    });

    return Object.values(imagenesMap);
  },
  async obtenerPorId(imagenId) {
    const [rows] = await pool.query('SELECT * FROM imagenes WHERE imagenes_id = ?', [imagenId]);
    return rows[0];
  },
 obtenerUsuarioPorIdImagen: async (imagenId) => {
    const [rows] = await pool.query(
      `SELECT u.usuario_id AS usuario_id, u.username, i.imagenes_id, i.archivo
       FROM imagenes i
       JOIN albumes a ON i.albumes_id = a.albumes_id
       JOIN usuarios u ON a.usuario_id = u.usuario_id
       WHERE i.imagenes_id = ?`,
      [imagenId]
    );

    return rows[0]; // devuelve undefined si no existe
  }
};

