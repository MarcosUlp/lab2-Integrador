const { query } = require('../database/db');
const albumModel = require('../models/album');
const etiquetaModel = require('../models/etiqueta');

const mostrarInicio = async (req, res) => {
  try {
    // Cargar las etiquetas siempre para mostrar los checkboxes
    etiquetasDisponibles = await etiquetaModel.getAll();

    res.render('home/inicio', {
      usuario: req.session.user,
      albumes: [],
      etiquetasDisponibles,
      query: {},
      resultados: []
    });

  } catch (error) {
    console.error('Error al mostrar inicio:', error);
    res.status(500).send('Error al mostrar inicio');
  }
};

const mostrarAlbumesBuscados = async (req, res) => {
    const usuarioId = req.session.user.id;
    const { titulo, etiquetas } = req.query;

    try {
        const etiquetasArray = Array.isArray(etiquetas) ? etiquetas : etiquetas ? [etiquetas] : [];
        const resultados = await albumModel.buscarPorNombreYTags(titulo, etiquetasArray);

        
        const todasLasEtiquetas = await etiquetaModel.getAll(); // Para volver a mostrar filtros
        res.render('home/inicio', {
            resultados,
            todasLasEtiquetas,
            usuarioId,
            titulo,
            query: req.query
        });

    } catch (error) {
        console.error('Error al mostrar búsqueda:', error);
        res.status(500).send('Error al buscar álbumes');
    }
};

module.exports = {
    mostrarInicio,
    mostrarAlbumesBuscados
};
