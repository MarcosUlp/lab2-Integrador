const pool = require('../database/db');

module.exports = {
  barraBusqueda: async (nombre) => {
    const [rows] = await pool.query(
      'SELECT usuario_id, username, foto_perfil FROM usuarios WHERE username LIKE ?',
      [`%${nombre}%`]
    );
    return rows;
  }
};
