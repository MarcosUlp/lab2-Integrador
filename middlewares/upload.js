const multer = require('multer');
const path = require('path');

// Configuración del almacenamiento perfil
const perfilStorage = multer.diskStorage({
  destination: './uploads/perfil',
  filename: (req, file, cb) => {
    cb(null, 'perfil_' + Date.now() + path.extname(file.originalname));
  }
});

// Portada
const portadaStorage = multer.diskStorage({
  destination: './uploads/portada',
  filename: (req, file, cb) => {
    cb(null, 'portada_' + Date.now() + path.extname(file.originalname));
  }
});

// Álbumes
const albumStorage = multer.diskStorage({
  destination: './uploads/albumes',
  filename: (req, file, cb) => {
    cb(null, 'album_' + Date.now() + '_' + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes JPG y PNG'));
  }
};

// Límite de tamaño (1MB)
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 },
  fileFilter
});
const uploadPerfil = multer({ storage: perfilStorage });
const uploadPortada = multer({ storage: portadaStorage });
const uploadAlbum = multer({ storage: albumStorage });

module.exports = { uploadPerfil, uploadPortada, uploadAlbum, upload };
