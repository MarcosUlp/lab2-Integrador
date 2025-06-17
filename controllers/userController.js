const bcrypt = require('bcrypt');
const usuarioModel = require('../models/usuario');
const solicitudModel = require('../models/solicitudesAmistad');
const albumModel = require('../models/album');
const imagenModel = require('../models/imagen')
const seguidoresModel = require('../models/solicitudesAmistad');
const comentarioModel = require('../models/comentarios');
module.exports = {
  // Mostrar formulario de registro
  showRegister: (req, res) => {
    res.render('register');
  },

  // Procesar registro
  register: async (req, res) => {
    const { nombre, email, password } = req.body;

    try {
      const existingUser = await usuarioModel.findByEmail(email);
      if (existingUser) {
        return res.render('register', { error: 'El email ya está registrado' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await usuarioModel.create({
        nombre,
        email,
        password: hashedPassword,
        rol: 'usuario'
      });

      res.redirect('/login');
    } catch (err) {
      console.error('Error al registrar usuario:', err);
      res.render('register', { error: 'Error del servidor. Intente más tarde.' });
    }
  },

  // Mostrar formulario de login
  showLogin: (req, res) => {
    res.render('login');
  },

  // Procesar login
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await usuarioModel.findByEmail(email);

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.render('login', { error: 'Correo o contraseña inválidos' });
      }

      req.session.user = {
        id: user.usuario_id,
        username: user.username,
        email: user.email,
        rol: user.rol,
        foto_perfil: user.foto_perfil,
        foto_portada: user.foto_portada
      };
      console.log('mi user despues del login ', user);
      console.log('Login exitoso. Redirigiendo a /inicio...');

      res.redirect('/inicio');
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      res.render('login', { error: 'Error del servidor. Intente más tarde.' });
    }
  },

  // Cerrar sesión
  logout: (req, res) => {
    req.session.destroy(() => {
      res.redirect('/login');
    });
  },
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

  buscar: async (req, res) => {
    const termino = req.query.q;
    if (!termino) {
      return res.redirect('/inicio');
    }
    try {
      const resultados = await usuarioModel.barraBusqueda(termino);
      res.render('perfil/buscar', {
        user: req.session.user,
        resultados,
        termino
      });
    } catch (error) {
      console.error('Error en la búsqueda:', error);
      res.status(500).send('Error al buscar usuarios');
    }
  },
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
        const comentarios = await comentarioModel.obtenerComentariosPorImagen(img.imagen_id);
        img.comentarios = comentarios;
      }


      console.log(JSON.stringify(albumes, null, 2));
      console.log('imagenes ' + imagenes)
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
    }
  }
};
