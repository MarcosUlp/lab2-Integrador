const usuarioVisitadoModel = require('../models/usuarioVisitado');

exports.buscar = async (req, res) => {
  const termino = req.query.q;
  if (!termino) return res.redirect('/inicio');

  try {
    const resultados = await usuarioVisitadoModel.barraBusqueda(termino);
    res.render('perfil/buscar', {
      user: req.session.user,
      resultados,
      termino
    });
  } catch (error) {
    console.error('Error en la búsqueda:', error);
    res.status(500).send('Error al buscar usuarios');
  }
};
