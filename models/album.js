const pool = require('../database/db');

module.exports = {
  crearAlbum: async (usuarioId, titulo, modo_publico) => {
    const [result] = await pool.query(
      'INSERT INTO albumes (usuario_id, titulo, modo_publico) VALUES (?, ?, ?)',
      [usuarioId, titulo, modo_publico]
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

// Álbumes de personas que sigo
async ultimosDeSeguidos(usuarioId) {
  const [rows] = await pool.query(`
    SELECT a.*, u.username, u.foto_perfil
    FROM albumes a
    JOIN usuarios u ON a.usuario_id = u.usuario_id
    JOIN seguidores s ON s.seguido_id = a.usuario_id
    WHERE s.seguidor_id = ?
    ORDER BY a.fecha_creacion DESC
    LIMIT 3
  `, [usuarioId]);
  return rows;
},

// Búsqueda por nombre o etiquetas
async buscarPorNombreYTags(titulo, etiquetas) {
  let sql = `
    SELECT DISTINCT a.*, u.username, u.foto_perfil
    FROM albumes a
    JOIN usuarios u ON a.usuario_id = u.usuario_id
    LEFT JOIN albumes_etiquetas ae ON a.albumes_id = ae.albumes_id
    WHERE a.modo_publico = 1
  `;
  const params = [];

  if (titulo) {
    sql += ' AND a.titulo LIKE ?';
    params.push(`%${titulo}%`);
  }

  if (etiquetas && etiquetas.length > 0) {
    const tags = Array.isArray(etiquetas) ? etiquetas : [etiquetas];
    sql += ` AND ae.etiquetas_id IN (${tags.map(() => '?').join(',')})`;
    params.push(...tags);
  }

  sql += ' ORDER BY a.fecha_creacion DESC';

  const [rows] = await pool.query(sql, params);
  return rows;
}


};
