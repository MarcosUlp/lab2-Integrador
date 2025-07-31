const express = require('express');
const router = express.Router();
const explorarController = require('../controllers/explorarController');

router.get('/', explorarController.verExplorar);

module.exports = router;
