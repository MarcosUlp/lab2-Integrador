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

  findByEmail: async (email) => {
    const [rows] = await pool.execute(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );
    return rows[0];
  },
  actualizarFotoPerfil: async (usuarioId, archivo) => {
    await pool.query('UPDATE usuarios SET foto_perfil = ? WHERE id = ?', [archivo, usuarioId]);
  },
  actualizarFotoPortada: async (usuarioId, archivo) => {
    await pool.query('UPDATE usuarios SET foto_portada = ? WHERE id = ?', [archivo, usuarioId]);
  }
};
