const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Configuración del motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos (si usás views públicas o imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
const usuarioRoutes = require('./routes/userRoutes');
app.use('/api/usuarios', usuarioRoutes);

// Rutas para mostrar las páginas
app.get('/login', (req, res) => {
  res.render('login'); // busca views/login.ejs
});


app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/', (req, res) => {
  res.redirect('/login'); // o res.render('login') si preferís mostrarlo directamente
});

// Middleware de error simple
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
