const comentarioModel = require('../models/comentarios');
const imagenModel = require('../models/imagen');
const notificacionesService = require('../utils/notificacionesService');

exports.agregarComentario = async (req, res) => {
  try {
    const { imagenId } = req.params;
    const { contenido } = req.body;  // o { texto } si cambias el formulario
    const usuarioId = req.session.user.id;

    if (!contenido || contenido.trim() === '') {
      return res.redirect(req.get('referer') || '/inicio');
    }

    // Guardar comentario
    await comentarioModel.agregarComentario(usuarioId, imagenId, contenido);

    // Buscar dueño de la imagen
    console.log('datos obtenidos de ', imagenId )
    const imagen = await imagenModel.obtenerUsuarioPorIdImagen(imagenId);
    console.log('Datos de la imagen:', imagen.usuario_id);

    if (!imagen || !imagen.usuario_id) {
      console.error('esta es la imagen que supuestamente se comenta', imagen);
      return res.status(404).send('Imagen no encontrada');
    }

    const receptorId = imagen.usuario_id;
    console.error('este seria el destinatario del comentario ', receptorId );
    console.error('y este seria el que comento la imagen ', usuarioId );
    


    // No se notifica si te comentás a vos mismo
    console.log('[BACK] Se está intentando crear y emitir una notificación en comentarioController...');

    if (receptorId !== usuarioId) {
      await notificacionesService.crearYEmitirNotificacion({
        para_usuario_id: receptorId,
        de_usuario_id: usuarioId,
        tipo: 'comentario',
        mensaje: contenido,
        extraData: { imagen_id: imagenId },
        solicitud_id: null
      });
    }

    res.redirect(req.get('referer') || '/inicio');

  } catch (error) {
    console.error('Error al agregar comentario:', error);
    res.status(500).send('Error interno del servidor');
  }
};

