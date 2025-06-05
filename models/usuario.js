
// usando mysql2 con promesas
const pool = require('../database/db'); // tu conexión a MySQL

module.exports = {
  create: async (userData) => {
    const { nombre, email, password, rol } = userData;
    const [result] = await pool.execute(
      'INSERT INTO usuarios (username, email, password, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, password, rol]
    );
    return result.insertId;
  },

  findByEmail: async (email) => {
    const [rows] = await pool.execute(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );
    return rows[0];
  }
};
