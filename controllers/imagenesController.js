
const path = require('path');
const albumModel = require('../models/album');

exports.subirAlbum = async (req, res) => {
  try {
    const usuarioId = req.session.user.id;
    const { titulo } = req.body;
    const archivos = req.files;

    if (!archivos || archivos.length === 0) {
      return res.status(400).json({ error: 'Debes subir al menos una imagen' });
    }

    // 1. Crear álbum
    const albumId = await albumModel.crearAlbum(usuarioId, titulo);

    // 2. Extraer nombres de archivos
    const nombresArchivos = archivos.map(file => file.filename);

    // 3. Guardar imágenes en la base de datos
    await albumModel.agregarImagenes(albumId, nombresArchivos);

    res.redirect('/perfil'); // o donde quieras redirigir después
  } catch (error) {
    console.error('Error al subir álbum:', error);
    res.status(500).json({ error: 'Error al subir el álbum' });
  }
};

exports.subirImagen = async (req, res) => {
  try {
    const { albumes_id, descripcion } = req.body;
    const archivo = req.file.filename;

    if (!archivo) {
      return res.status(400).json({ error: 'No se subió ninguna imagen' });
    }

    const nuevaImagen = {
      albumes_id,
      archivo: `/uploads/${archivo}`,
      descripcion
    };

    await pool.query('INSERT INTO imagenes SET ?', nuevaImagen);
    res.status(200).json({ mensaje: 'Imagen subida con éxito', imagen: nuevaImagen });
  } catch (error) {
    console.error('Error al subir imagen:', error);
    res.status(500).json({ error: 'Error al subir la imagen' });
  }
};
