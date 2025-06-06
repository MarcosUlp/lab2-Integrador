// controllers/userController.js
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
        rol: user.rol
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
  }
};
