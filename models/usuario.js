const db = require('./db');

const Usuario = {
  crear: (datos, callback) => {
    const sql = `INSERT INTO usuarios (username, email, password, nombre_completo) VALUES (?, ?, ?, ?)`;
    db.query(sql, [datos.username, datos.email, datos.password, datos.nombre_completo], callback);
  },

  buscarPorEmailYPassword: (email, password, callback) => {
    const sql = `SELECT * FROM usuarios WHERE email = ? AND password = ?`;
    db.query(sql, [email, password], callback);
  },

  buscarPorId: (id, callback) => {
    const sql = `SELECT usuario_id, username, nombre_completo, avatar, bio FROM usuarios WHERE usuario_id = ?`;
    db.query(sql, [id], callback);
  }
};

module.exports = Usuario;
