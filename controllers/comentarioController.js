const Comentario = require('../models/comentarios');
const notificaciones = require('../models/notificaciones');

exports.comentarImagen = async (req, res) => {
  const usuarioId = req.session.user.id;
  const imagenId = parseInt(req.params.imagenId);
  const { texto } = req.body;

  if (!texto) {
    return res.status(400).send('Comentario vacío.');
  }

  try {
    await Comentario.agregarComentario(usuarioId, imagenId, texto);
    const imagen = await Comentario.obtenerUsuarioDeImagen(imagenId);
    const receptorId = imagen.usuario_id;

    if (receptorId !== usuarioId) {
      //crea notificacion tipo comentario
      await notificaciones.crear({
        de_usuario_id: usuarioId,
        para_usuario_id: receptorId,
        tipo: 'comentario',
        imagen_id: imagenId
      });
    }
    res.redirect(req.get('referer')); // supuestamente vuelva a la misma pag

  } catch (err) {
    console.error(err);
    res.status(500).send('Error al comentar.');
  }
};
