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
    // Trae las imágenes del usuario con sus comentarios
    const [imagenesRaw] = await pool.query(
      `SELECT i.*, c.comentario_id, c.contenido, u.username, u.foto_perfil
   FROM imagenes i
   LEFT JOIN comentarios c ON i.imagenes_id = c.imagen_id
   LEFT JOIN usuarios u ON c.usuario_id = u.usuario_id
   JOIN albumes a ON i.albumes_id = a.albumes_id
   WHERE a.usuario_id = ?
   ORDER BY i.imagenes_id DESC, c.comentario_id ASC`,
      [usuarioId]
    );

    // Reestructurar para agrupar comentarios por imagen
    const imagenesMap = {};
    imagenesRaw.forEach(row => {
      if (!imagenesMap[row.imagenes_id]) {
        imagenesMap[row.imagenes_id] = {
          imagenes_id: row.imagenes_id,
          archivo: row.archivo,
          albumes_id: row.albumes_id,
          comentarios: []
        };
      }

      if (row.comentario_id) {
        imagenesMap[row.imagenes_id].comentarios.push({
          contenido: row.contenido,
          username: row.username,
          foto_perfil: row.foto_perfil
        });
      }
    });

    const imagenes = Object.values(imagenesMap);


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
