const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const path = require('path');
const session = require('express-session'); 
const expressLayouts = require('express-ejs-layouts');

//rutas principales
const imagenesRoutes = require('./routes/imagenes')
const usuarioRoutes = require('./routes/userRoutes');
const perfilRoutes = require('./routes/perfil');
const inicioRoutes = require('./routes/inicio');
const solicitudesRoutes = require('./routes/solicitudes');



const PORT = process.env.PORT || 3000;

// Configuración del motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//habilita los layouts
app.use(expressLayouts);
app.set('layout', 'layout');

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// cpnfiguracion de sesion
app.use(session({
  secret: process.env.SESSION_SECRET || 'secreto123',
  resave: false,
  saveUninitialized: false,
}));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/usuarios', usuarioRoutes);
app.use('/imagenes', imagenesRoutes);
app.use('/perfil', perfilRoutes);
app.use('/inicio', inicioRoutes);
app.use('/solicitudes', solicitudesRoutes);

// Vistas
app.get('/login', (req, res) => {
  res.render('auth/login');
});

app.get('/register', (req, res) => {
  res.render('auth/register');
});

app.get('/', (req, res) => {
  res.redirect('/login');
});

// Middleware de error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
});

// Puerto
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
