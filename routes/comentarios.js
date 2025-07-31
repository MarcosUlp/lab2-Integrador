const express = require('express');
const router = express.Router();
const comentarioController = require('../controllers/comentarioController');
const requireLogin = require('../middlewares/requireLogin');

router.post('/:imagenId', requireLogin, comentarioController.agregarComentario);

module.exports = router;
