const bcrypt = require('bcrypt');
const usuarioModel = require('../models/usuario');

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
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        foto_perfil: user.foto_perfil,
        foto_portada: user.foto_portada
      };
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
      const archivo = req.file.filename;
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
      const archivo = req.file.filename;
      await usuarioModel.actualizarFotoPortada(usuarioId, archivo);
      req.session.user.foto_portada = archivo;
      res.redirect('/perfil');
    } catch (err) {
      console.error('Error al subir foto de portada:', err);
      res.status(500).send('Error al subir la imagen.');
    }
  }
};
