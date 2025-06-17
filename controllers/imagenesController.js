
const path = require('path');
const albumModel = require('../models/album');
const imagenModel = require('../models/imagen');

exports.subirAlbum = async (req, res) => {
  try {
    const usuarioId = req.session.user.id;
    const { titulo } = req.body;
    const archivos = req.files;

    if (!archivos || archivos.length === 0) {
      return res.status(400).json({ error: 'Debes subir al menos una imagen' });
    }
   /* if (!archivos || archivos.length < 1 || archivos.length > 20) {
      return res.status(400).send('Debes subir entre 1 y 20 imágenes.');
    }
*/
    // 1. Crear álbum
    const albumId = await albumModel.crearAlbum(usuarioId, titulo);

    // 2. Extraer nombres de archivos
    const nombresArchivos = archivos.map(file => file.filename);
    
    console.log('nombresArchivos ' + nombresArchivos);
    // 3. Guardar imágenes en la base de datos
    await imagenModel.agregarImagenes(albumId, nombresArchivos);

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
    console.log('albumes' + albumes);
    console.log('imagenes' + imagenes);
    res.render('/perfil', {
      user: req.session.user,
      albumes,
      imagenes
    });
  } catch (error) {
    console.error('Error mostrando el perfil:', error);
    res.status(500).send('Error cargando perfil');
  }
};
