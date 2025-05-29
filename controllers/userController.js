const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const usersFilePath = path.join(__dirname, '../data/users.json');

// Cargar usuarios desde archivo JSON
function loadUsers() {
  if (!fs.existsSync(usersFilePath)) return [];
  return JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
}

// Guardar usuarios
function saveUsers(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

module.exports = {
  // Mostrar formulario de login
  showLogin: (req, res) => {
    res.render('login');
  },

  // Procesar login
  login: (req, res) => {
    const { email, password } = req.body;
    const users = loadUsers();
    const user = users.find(u => u.email === email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.render('login', { error: 'Credenciales inválidas' });
    }

    req.session.user = user;
    res.redirect('/perfil');
  },

  // Mostrar formulario de registro
  showRegister: (req, res) => {
    res.render('register');
  },

  // Procesar registro
  register: (req, res) => {
    const { nombre, email, password } = req.body;
    const users = loadUsers();

    if (users.find(u => u.email === email)) {
      return res.render('register', { error: 'El email ya está registrado' });
    }

    const newUser = {
      id: Date.now(),
      nombre,
      email,
      password: bcrypt.hashSync(password, 10),
      rol: 'usuario' // 👈 Asignación fija del rol
    };

    users.push(newUser);
    saveUsers(users);

    req.session.user = newUser;
    res.redirect('/perfil');
  },

  // Cerrar sesión
  logout: (req, res) => {
    req.session.destroy();
    res.redirect('/');
  }
};
