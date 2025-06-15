const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Validar tipo de archivo
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes JPG y PNG'), false);
  }
};

// Asegurar carpetas
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

// Carpeta base
const basePath = './uploads';

// Almacenamiento perfil
ensureDir(`${basePath}/perfil`);
const perfilStorage = multer.diskStorage({
  destination: `${basePath}/perfil`,
  filename: (req, file, cb) => {
    cb(null, 'perfil_' + Date.now() + path.extname(file.originalname));
  }
});

// Almacenamiento portada
ensureDir(`${basePath}/portada`);
const portadaStorage = multer.diskStorage({
  destination: `${basePath}/portada`,
  filename: (req, file, cb) => {
    cb(null, 'portada_' + Date.now() + path.extname(file.originalname));
  }
});

// Almacenamiento álbum
ensureDir(`${basePath}/albumes`);
const albumStorage = multer.diskStorage({
  destination: `${basePath}/albumes`,
  filename: (req, file, cb) => {
    cb(null, 'album_' + Date.now() + '_' + file.originalname);
  }
});

// Limitar a 2MB por archivo
const limits = { fileSize: 2 * 1024 * 1024 };

const uploadPerfil = multer({ storage: perfilStorage, fileFilter, limits });
const uploadPortada = multer({ storage: portadaStorage, fileFilter, limits });
const uploadAlbum = multer({ storage: albumStorage, fileFilter, limits });

module.exports = { uploadPerfil, uploadPortada, uploadAlbum };