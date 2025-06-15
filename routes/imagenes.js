const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer');
const imagenesController = require('../controllers/imagenesController');
const requireLogin = require('../middlewares/requireLogin');

router.post('/subiralbum', requireLogin, upload.array('imagenes', 20), imagenesController.subirAlbum);
router.get('/mostrar', requireLogin, imagenesController.mostrarAlbum);
module.exports = router;
