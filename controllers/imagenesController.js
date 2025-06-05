const pool = require('../database/db');
const path = require('path');

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
