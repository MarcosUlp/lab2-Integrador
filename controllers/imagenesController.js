
const path = require('path');
const albumModel = require('../models/album');
const imagenModel = require('../models/imagen');
const etiquetaModel = require('../models/etiqueta');

exports.subirAlbum = async (req, res) => {
  try {
    const usuarioId = req.session.user.id;
    const { titulo, etiquetas } = req.body;
    const archivos = req.files;
    const modoPublico = req.body.modo_publico ? 1 : 0;

    if (!archivos || archivos.length === 0) {
      return res.status(400).json({ error: 'Debes subir al menos una imagen' });
    }
    if (!archivos || archivos.length < 1 || archivos.length > 20) {
      return res.status(400).send('Debes subir entre 1 y 20 imágenes.');
    }
    // 1. Crear álbum
    const albumId = await albumModel.crearAlbum(usuarioId, titulo, modoPublico);

    // 2. Extraer nombres de archivos
    const nombresArchivos = archivos.map(file => file.filename);
    console.log('nombresArchivos ' + nombresArchivos);

    // 3. Guardar imágenes en la base de datos
    await imagenModel.agregarImagenes(albumId, nombresArchivos);

    //si hay etiquetas seleccionadas tambien las guarda 
    if (etiquetas) {
      const etiquetasArray = Array.isArray(etiquetas) ? etiquetas : [etiquetas]; // puede venir como string si es una sola
      await etiquetaModel.agregarEtiquetas(albumId, etiquetasArray);
    }
    res.redirect('/perfil'); // o donde quieras redirigir después
  } catch (error) {
    console.error('Error al subir álbum:', error);
    res.status(500).json({ error: 'Error al subir el álbum' });
  }
};
exports.mostrarAlbum = async (req, res) => {
  try {
    const usuarioId = req.session.user.id;
    console.log('userId' + usuarioId);
    const albumes = await albumModel.obtenerPorUsuario(usuarioId);//todos los albumes_id de x usuario
    const imagenes = await imagenModel.obtenerImagenesPorUsuario(usuarioId);//obtiene todas las imagenes por albumes_id
    const etiquetas = await etiquetaModel.obtenerEtiquetasPorUsuario(usuarioId);

    const etiquetasPorAlbum = {};
    etiquetas.forEach(({ albumes_id, etiqueta }) => {
      if (!etiquetasPorAlbum[albumes_id]) {
        etiquetasPorAlbum[albumes_id] = [];
      }
      etiquetasPorAlbum[albumes_id].push(etiqueta);
    });

    console.log('🏷️ Etiquetas crudas desde DB:\n', JSON.stringify(etiquetas, null, 2));
    console.log('📦 Etiquetas agrupadas por álbum:\n', JSON.stringify(etiquetasPorAlbum, null, 2));

    console.log('albumes' + albumes);
    console.log('imagenes' + imagenes);
    res.render('/perfil', {
      user: req.session.user,
      albumes,
      imagenes,
      etiquetasPorAlbum
    });
  } catch (error) {
    console.error('Error mostrando el perfil:', error);
    res.status(500).send('Error cargando perfil');
  }
};
