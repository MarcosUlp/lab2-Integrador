const db = require('../database/db');

// Registrar nuevo usuario
exports.registrarUsuario = (req, res) => {
  const { username, email, password, nombre_completo } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
  }

  const sql = `
    INSERT INTO usuarios (username, email, password, nombre_completo)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [username, email, password, nombre_completo || null], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al registrar usuario' });
    }
    res.status(201).json({ mensaje: 'Usuario registrado con éxito', id: result.insertId });
  });
};

// Iniciar sesión
exports.loginUsuario = (req, res) => {
  const { email, password } = req.body;

  const sql = `SELECT * FROM usuarios WHERE email = ? AND password = ?`;

  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const usuario = results[0];
    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      usuario: {
        id: usuario.usuario_id,
        username: usuario.username,
        email: usuario.email,
        nombre_completo: usuario.nombre_completo
      }
    });
  });
};

// Perfil de usuario
exports.obtenerPerfil = (req, res) => {
  const usuarioId = req.params.id;

  const sql = `SELECT usuario_id, username, nombre_completo, avatar, bio FROM usuarios WHERE usuario_id = ?`;

  db.query(sql, [usuarioId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json(results[0]);
  });
};
