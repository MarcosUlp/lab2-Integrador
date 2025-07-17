const usuarioModel = require('../models/usuario');
const bcrypt = require('bcrypt');

exports.editarPerfilForm = async (req, res) => {
  const usuarioId = req.session.user.id;

  try {
    const usuario = await usuarioModel.obtenerPorId(usuarioId);
    res.render('perfil/editarPerfil', { usuario });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar el formulario de edición');
  }
};

exports.actualizarPerfil = async (req, res) => {
  const usuarioId = req.session.userId;
  const {
    username,
    email,
    nombre_completo,
    biografia,
    intereses,
    ubicacion,
    telefono,
    nueva_contraseña
  } = req.body;

  try {
    const datosActualizados = {
      username,
      email,
      nombre_completo,
      biografia,
      intereses,
      ubicacion,
      telefono
    };

    if (nueva_contraseña && nueva_contraseña.trim() !== "") {
      const hash = await bcrypt.hash(nueva_contraseña, 10);
      datosActualizados.password = hash;
    }

    await usuarioModel.actualizar(usuarioId, datosActualizados);

    res.redirect('/perfil');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar el perfil');
  }
};
