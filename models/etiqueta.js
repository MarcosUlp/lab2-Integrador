const pool = require('../database/db');

module.exports = {
  getAll: async () => {
    const [rows] = await pool.query('SELECT * FROM etiquetas');
    return rows;
  },

  agregarEtiquetas: async (albumId, etiquetasArray) => {
    const valores = etiquetasArray.map(etiquetaId => [albumId, etiquetaId]);
    await pool.query(
      'INSERT INTO albumes_etiquetas (albumes_id, etiquetas_id) VALUES ?',
      [valores])
  },
  obtenerEtiquetasPorUsuario: async (usuarioId) => {
    const [rows] = await pool.query(`
    SELECT ae.albumes_id, e.nombre AS etiqueta
    FROM albumes_etiquetas ae
    JOIN etiquetas e ON ae.etiquetas_id = e.etiquetas_id
    JOIN albumes a ON ae.albumes_id = a.albumes_id
    WHERE a.usuario_id = ?
  `, [usuarioId]);

    return rows; // array con { albumes_id, etiqueta }
  }
};
