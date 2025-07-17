const usuarioModel = require('../models/usuario');
const solicitudModel = require('../models/solicitudesAmistad');
const albumModel = require('../models/album');
const imagenModel = require('../models/imagen')
const seguidoresModel = require('../models/solicitudesAmistad');
const comentarioModel = require('../models/comentarios');
module.exports = {
  // Subir imagen de perfil
  subirPerfil: async (req, res) => {
    try {
      const usuarioId = req.session.user.id;
      const archivo = '/uploads/perfil/' + req.file.filename;

      await usuarioModel.actualizarFotoPerfil(usuarioId, archivo);
      req.session.user.foto_perfil = archivo;
      res.redirect('/perfil');
    } catch (err) {
      console.error('Error al subir foto de perfil:', err);
      res.status(500).send('Error al subir la imagen.');
    }
  },
  // Subir imagen de portada
  subirPortada: async (req, res) => {
    try {
      const usuarioId = req.session.user.id;
      const archivo = '/uploads/portada/' + req.file.filename;
      await usuarioModel.actualizarFotoPortada(usuarioId, archivo);
      req.session.user.foto_portada = archivo;
      res.redirect('/perfil');
    } catch (err) {
      console.error('Error al subir foto de portada:', err);
      res.status(500).send('Error al subir la imagen.');
    }
  },
  //visitar Usuario
  perfilVisitado: async (req, res) => {
    const idPerfilVisitado = req.params.id;
    const usuarioLogueado = req.session.user;

    if (parseInt(idPerfilVisitado) === usuarioLogueado.id) {
      return res.redirect('/perfil'); // Redirige a su propio perfil
    }

    try {

      let albumes = [];
      let imagenes = [];
      const perfil = await usuarioModel.buscarPorId(idPerfilVisitado);
      const yaHaySolicitud = await solicitudModel.yaHayRelacion(usuarioLogueado.id, idPerfilVisitado);
      const estadoRelacion = await solicitudModel.obtenerEstadoRelacion(usuarioLogueado.id, idPerfilVisitado);
      const sigue = await seguidoresModel.sigueA(usuarioLogueado.id, idPerfilVisitado);

      if (sigue) {
        albumes = await albumModel.obtenerPorUsuarioId(idPerfilVisitado);
        imagenes = await imagenModel.obtenerImagenesPorUsuario(idPerfilVisitado);
      }

      for (const img of imagenes) {
        const comentarios = await comentarioModel.obtenerComentariosPorImagen(img.imagenes_id);
        img.comentarios = comentarios;
      }


      console.log(JSON.stringify(albumes, null, 2));
      console.log(JSON.stringify(imagenes, null, 2));
      
      res.render('perfil/perfilVisitado', {
        user: usuarioLogueado,
        perfil,
        albumes,
        imagenes,
        yaHaySolicitud,
        estadoRelacion,
        sigue
      });
    } catch (error) {
      console.error('Error al cargar perfil visitado:', error);
      res.status(500).send('Error al cargar perfil');
      console.error('Error al cargar perfil visitado:', error.stack);
    }
  }
};
