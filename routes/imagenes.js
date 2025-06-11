const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer');
const imagenesController = require('../controllers/imagenesController');
const {requireLogin} = require('../middlewares/requireLogin');

router.post('/subir', requireLogin, upload.single('imagen'), imagenesController.subirImagen);

module.exports = router;
