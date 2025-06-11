const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const requireLogin = require('../middlewares/requireLogin');

router.get('/', requireLogin, async (req, res) => {
  try {
    const usuarioId = req.session.user.id;

    const [albumes] = await pool.query(
      'SELECT * FROM albumes WHERE usuario_id = ?',
      [usuarioId]
    );

    res.render('home/inicio', { usuario: req.session.user, albumes });
  } catch (error) {
    console.error('Error al cargar la vista de inicio:', error);
    res.status(500).send('Error en la vista de inicio');
  }
});

module.exports = router;
