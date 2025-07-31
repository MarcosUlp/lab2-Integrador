const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albumController');
const requireLogin = require('../middlewares/requireLogin');

router.get('/:id', albumController.verAlbum);

module.exports = router;
