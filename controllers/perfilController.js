const albumModel = require('../models/album');
const imagenModel = require('../models/imagen');
const etiquetasModel = require('../models/etiqueta');

exports.mostrarPerfil = async (req, res) => {
  try {
    const usuarioId = req.session.user.id;

    const albumes = await albumModel.obtenerPorUsuario(usuarioId);
    const imagenes = await imagenModel.obtenerImagenesConComentarios(usuarioId);
    const etiquetas = await etiquetasModel.getAll();
    const etiquetado = await etiquetasModel.obtenerEtiquetasPorUsuario(usuarioId);
    const etiquetasPorAlbum = {};
    etiquetado.forEach(({ albumes_id, etiqueta }) => {
      if (!etiquetasPorAlbum[albumes_id]) {
        etiquetasPorAlbum[albumes_id] = [];
      }
      etiquetasPorAlbum[albumes_id].push(etiqueta);
    });

    res.render('perfil/perfil', {
      albumes,
      imagenes,
      user: req.session.user,
      etiquetas,
      etiquetasPorAlbum
    });
  } catch (error) {
    console.error('Error al cargar el perfil:', error);
    res.status(500).send('Error en el perfil');
  }
};
