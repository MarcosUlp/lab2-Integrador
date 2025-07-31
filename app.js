const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');

//app para iniciar el servidor
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server);
//guardar istancia para usar en otros archivos
const socketInstance = require('./utils/socketInstance');
socketInstance.setIo(io);
//y aca manejo los soket

const socketStore = require('./utils/socketStore');


io.on('connection', (socket) => {
  console.log('Usuario conectado ', socket.id );

  // Escuchá un evento para registrar al usuario conectado
  socket.on('registrarUsuario', (userId) => {
     console.log('Registrando usuario:', userId, 'con socket:', socket.id);
    console.log(`Usuario ${userId} registrado en socket ${socket.id}`);
    socketStore.registrarSocket(userId, socket.id);
  });
  socket.on('disconnect', () => {

    console.log('🔴 Usuario desconectado', socket.id);
    socketStore.eliminarSocket(socket.id);
  });
});


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
const albumRoutes = require('./routes/album');//ruta para visitar album especifico
const explorarRoutes = require('./routes/explorar');//ruta para visitantes


const PORT = process.env.PORT || 3000;


// Configuración del motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//guardar io en app

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
app.use((req, res, next) => {
  if (req.session && req.session.user) {
    res.locals.user = req.session.user;
  } else {
    res.locals.user = null;
  }
  next();
});


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
app.use('/album', albumRoutes);
app.use('/explorar', explorarRoutes);




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
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// probando para socket

