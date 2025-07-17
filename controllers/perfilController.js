const albumModel = require('../models/album');
const imagenModel = require('../models/imagen');

exports.mostrarPerfil = async (req, res) => {
  try {
    const usuarioId = req.session.user.id;

    const albumes = await albumModel.obtenerPorUsuario(usuarioId);
    const imagenes = await imagenModel.obtenerImagenesConComentarios(usuarioId);

    res.render('perfil/perfil', {
      albumes,
      imagenes,
      user: req.session.user
    });
  } catch (error) {
    console.error('Error al cargar el perfil:', error);
    res.status(500).send('Error en el perfil');
  }
};
