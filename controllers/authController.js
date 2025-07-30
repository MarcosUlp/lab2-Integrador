const bcrypt = require('bcrypt');
const authModel = require('../models/auth');

module.exports = {
  showRegister: (req, res) => res.render('auth/register'),

  register: async (req, res) => {
    const { nombre, email, password } = req.body;
    try {
      const existingUser = await authModel.findByEmail(email);
      if (existingUser) return res.render('auth/register', { error: 'El email ya está registrado' });

      const hashedPassword = await bcrypt.hash(password, 10);
      await authModel.create({ nombre, email, password: hashedPassword, rol: 'usuario' });
      res.redirect('/auth/login');
    } catch (err) {
      console.error('Error al registrar usuario:', err);
      res.render('auth/register', { error: 'Error del servidor. Intente más tarde.' });
    }
  },

  showLogin: (req, res) => res.render('auth/login'),

  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return res.render('auth/login', { error: 'Por favor completá todos los campos.' });
      }
      const user = await authModel.findByEmail(email);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.render('auth/login', { error: 'Correo o contraseña inválidos' });
      }

      req.session.user = {
        id: user.usuario_id,
        username: user.username,
        email: user.email,
        rol: user.rol,
        foto_perfil: user.foto_perfil,
        foto_portada: user.foto_portada
      };
      res.redirect('/inicio');
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      res.render('login', { error: 'Error del servidor. Intente más tarde.' });
    }
  },

  logout: (req, res) => {
    req.session.destroy(() => res.redirect('/auth/login'));
  }
};
