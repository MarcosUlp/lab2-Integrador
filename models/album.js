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
  async obtenerPublicosPorUsuario(usuarioId) {
    const sql = `SELECT * FROM albumes WHERE usuario_id = ? AND modo_publico = 1`;
    const [rows] = await pool.query(sql, [usuarioId]);
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
  },
  async obtenerAlbumesPublicosConImagen() {
    const sql = `
    SELECT 
      a.albumes_id,
      a.titulo,
      u.username,
      i.archivo AS imagen_principal
    FROM albumes a
    JOIN usuarios u ON a.usuario_id = u.usuario_id
    LEFT JOIN (
      SELECT i1.albumes_id, i1.archivo
      FROM imagenes i1
      INNER JOIN (
        SELECT albumes_id, MIN(imagenes_id) AS imagenes_id
        FROM imagenes
        GROUP BY albumes_id
      ) i2 ON i1.imagenes_id = i2.imagenes_id
    ) i ON i.albumes_id = a.albumes_id
    WHERE a.modo_publico = 1
    ORDER BY a.fecha_creacion DESC
    LIMIT 20
  `;
    const [rows] = await pool.query(sql);
    return rows;
  },

async buscarAlbumesPublicosConImagen({ titulo, etiquetas }) {
    let sql = `
    SELECT 
      a.albumes_id,
      a.titulo,
      u.username,
      i.archivo AS imagen_principal
    FROM albumes a
    JOIN usuarios u ON a.usuario_id = u.usuario_id
    LEFT JOIN (
      SELECT i1.albumes_id, i1.archivo
      FROM imagenes i1
      INNER JOIN (
        SELECT albumes_id, MIN(imagenes_id) AS imagenes_id
        FROM imagenes
        GROUP BY albumes_id
      ) i2 ON i1.imagenes_id = i2.imagenes_id
    ) i ON i.albumes_id = a.albumes_id
    WHERE a.modo_publico = 1
  `;

    const params = [];

    if (titulo) {
      sql += ` AND a.titulo LIKE ?`;
      params.push(`%${titulo}%`);
    }

    if (etiquetas.length > 0) {
      sql += `
      AND a.albumes_id IN (
        SELECT albumes_id
        FROM albumes_etiquetas
        WHERE etiquetas_id IN (${etiquetas.map(() => '?').join(',')})
        GROUP BY albumes_id
        HAVING COUNT(DISTINCT etiquetas_id) = ?
      )
    `;
      params.push(...etiquetas, etiquetas.length);
    }

    sql += ` ORDER BY a.fecha_creacion DESC LIMIT 20`;

    const [rows] = await pool.query(sql, params);
    return rows;
  }

};
