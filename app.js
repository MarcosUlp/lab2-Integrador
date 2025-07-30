const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');

// Cargar rutas
const imagenesRoutes = require('./routes/imagenes');
const inicioRoutes = require('./routes/inicio');
const solicitudesRoutes = require('./routes/solicitudes');
const comentarioRoutes = require('./routes/comentarios');
const authRoutes = require('./routes/auth');
const perfilRoutes = require('./routes/perfil'); // incluye perfil propio y visitado
const busquedaRoutes = require('./routes/busqueda'); // barra de búsqueda
const userRoutes = require('./routes/userRoutes');
const editarPerfilRoutes = require('./routes/editarPerfil');
const contarNotificaciones = require('./middlewares/notificaciones');//middleware del contador de notificaciones
const notificacionesRoutes = require('./routes/notificaciones');//ruta para las notificaciones
const PORT = process.env.PORT || 3000;


// Configuración del motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Layouts
app.use(expressLayouts);
app.set('layout', 'layout');

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // por si usás fetch/AJAX

// Configuración de sesión
app.use(session({
  secret: process.env.SESSION_SECRET || 'secreto123',
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: 'lax'
  }
}));

app.use(contarNotificaciones);// contador de notificaciones

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 📌 Rutas organizadas por funcionalidad
app.use('/notificaciones', notificacionesRoutes);
app.use('/auth', authRoutes);                // login, register, logout
app.use('/perfil', perfilRoutes);            // perfil propio y visitado
app.use('/buscar', busquedaRoutes);          // barra de búsqueda
app.use('/imagenes', imagenesRoutes);        // subir álbumes
app.use('/inicio', inicioRoutes);            // página de inicio
app.use('/solicitudes', solicitudesRoutes);  // solicitudes de seguimiento
app.use('/comentar', comentarioRoutes);      // comentarios
app.use('/usuarios', userRoutes);            // foto perfil, portada y ver perfil de otro usuario   
app.use('/editarPerfil', editarPerfilRoutes);


// Redirecciones base
app.get('/', (req, res) => {
  res.redirect('/auth/login');
});

// Middleware de error general
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
