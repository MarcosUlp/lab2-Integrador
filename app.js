const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session'); // 🔧 AGREGADO
require('dotenv').config();
const imagenesRouter = require('./routes/imagenes')
const app = express();
const usuarioRoutes = require('./routes/userRoutes');
const perfilRouters = require('./routes/perfil');
const inicioRouters = require('./routes/inicio');
const expressLayouts = require('express-ejs-layouts');

// Configuración del motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//habilita los layouts
app.use(expressLayouts);
app.set('layout', 'layout');

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// 🔧 AGREGAR CONFIGURACIÓN DE SESSION
app.use(session({
  secret: process.env.SESSION_SECRET || 'secreto123', // podés poner cualquier string fuerte
  resave: false,
  saveUninitialized: false,
}));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/usuarios', usuarioRoutes);
app.use('/imagenes', imagenesRouter);
app.use('/perfil', perfilRouters);
app.use('/inicio', inicioRouters);

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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
