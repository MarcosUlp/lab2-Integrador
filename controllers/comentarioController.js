const Comentario = require('../models/comentarios');

exports.comentarImagen = async (req, res) => {
  const usuarioId = req.session.user.id;
  const imagenId = parseInt(req.params.imagenId);
  const { texto } = req.body;

  if (!texto) {
    return res.status(400).send('Comentario vacío.');
  }

  try {
    await Comentario.agregarComentario(usuarioId, imagenId, texto);
    res.redirect(req.get('referer')); // supuestamente vuelva a la misma pag
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al comentar.');
  }
};
