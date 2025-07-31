const albumModel = require('../models/album');
const imagenModel = require('../models/imagen');
const comentarioModel = require('../models/comentarios');
const usuarioModel = require('../models/usuario');

exports.verAlbum = async (req, res) => {
  const albumId = req.params.id;
  const usuario = req.session.user || null;

  try {
    const album = await albumModel.obtenerPorAlbum_id(albumId);
    const usuarioDueño = await usuarioModel.obtenerPorId(album.usuario_id);

    // Solo mostrar si es público o el visitante es el dueño
    if (!album.modo_publico && (!usuario || usuario.id !== album.usuario_id)) {
      return res.status(403).send('No tenés permiso para ver este álbum.');
    }

    const imagenes = await imagenModel.obtenerPorAlbum(albumId);

    // Agregamos comentarios a cada imagen
    for (const img of imagenes) {
      const comentarios = await comentarioModel.obtenerComentariosPorImagen(img.imagenes_id);
      img.comentarios = comentarios;
    }

    res.render('perfil/verAlbum', {
      user: usuario,
      album,
      imagenes,
      usuarioDueño
    });

  } catch (error) {
    console.error('Error al ver álbum:', error);
    res.status(500).send('Error al ver el álbum');
  }
};
