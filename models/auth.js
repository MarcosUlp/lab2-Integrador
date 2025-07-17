const pool = require('../database/db');

module.exports = {
  create: async (userData) => {
    const { nombre, email, password, rol } = userData;
    const [result] = await pool.execute(
      'INSERT INTO usuarios (username, email, password, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, password, rol]
    );
    return result.insertId;
  },
  buscarPorId: async (id) => {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE usuario_id = ?', [id]);
    return rows[0];
  },

  findByEmail: async (email) => {
    const [rows] = await pool.execute(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );
    return rows[0];
  },
}