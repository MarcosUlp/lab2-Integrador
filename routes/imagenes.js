const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer');
const imagenesController = require('../controllers/imagenesController');

router.post('/subir', upload.single('imagen'), imagenesController.subirImagen);

module.exports = router;
