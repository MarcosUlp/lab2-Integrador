const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const requireLogin = require('../middlewares/requireLogin');


router.get('/', requireLogin, async (req, res) => {
  try {
    const usuarioId = req.session.user.id;

    // Trae los álbumes del usuario
    const [albumes] = await pool.query(
      'SELECT * FROM albumes WHERE usuario_id = ?',
      [usuarioId]
    );

    // Trae las imágenes del usuario
    const [imagenes] = await pool.query(
      `SELECT i.* FROM imagenes i
       JOIN albumes a ON i.albumes_id = a.albumes_id
       WHERE a.usuario_id = ?`,
      [usuarioId]
    );

    res.render('perfil/perfil', {
      albumes,
      imagenes,
      user: req.session.user
    });
  } catch (error) {
    console.error('Error al cargar el perfil:', error);
    res.status(500).send('Error en el perfil');
  }
});

module.exports = router;
