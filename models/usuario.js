const pool = require('../database/db');

module.exports = {
  actualizarFotoPerfil: async (usuarioId, archivo) => {
    await pool.query('UPDATE usuarios SET foto_perfil = ? WHERE usuario_id = ?', [archivo, usuarioId]);
  },


  actualizarFotoPortada: async (usuarioId, archivo) => {
    await pool.query('UPDATE usuarios SET foto_portada = ? WHERE usuario_id = ?', [archivo, usuarioId]);
  },
  obtenerPorId: async (id) => {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE usuario_id = ?', [id]);
    return rows[0];
  },

  actualizar: async (id, datos) => {
    const campos = [];
    const valores = [];

    for (const [clave, valor] of Object.entries(datos)) {
      campos.push(`${clave} = ?`);
      valores.push(valor);
    }

    valores.push(id);

    const sql = `UPDATE usuarios SET ${campos.join(', ')} WHERE usuario_id = ?`;
    await pool.query(sql, valores);
  }
};
