const albumModel = require('../models/album');
const etiquetasModel = require('../models/etiqueta');

exports.verExplorar = async (req, res) => {
  try {
    const { titulo, etiquetas } = req.query;

    // Procesar etiquetas como array
    const etiquetasArray = Array.isArray(etiquetas)
      ? etiquetas
      : etiquetas ? [etiquetas] : [];

    const albumes = await albumModel.buscarAlbumesPublicosConImagen({
      titulo,
      etiquetas: etiquetasArray
    });

    const etiquetasDisponibles = await etiquetasModel.getAll();

    res.render('home/explorar', {
      user: req.session.user || null,
      albumes,
      query: req.query,
      etiquetasDisponibles
    });

  } catch (err) {
    console.error('Error en /explorar:', err);
    res.status(500).send('Error al cargar la sección Explorar');
  }
};
