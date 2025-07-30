const express = require('express');
const router = express.Router();
const  requireLogin  = require('../middlewares/requireLogin');
const solicitudController = require('../controllers/solicitudController');


// Enviar solicitud
router.post('/enviar/:id', requireLogin, solicitudController.enviarSolicitud);

//ver solicitudes pendientes
router.get('/pendientes', requireLogin, solicitudController.verPendientes);

//aceptar solicitud
router.post('/aceptar/:id', requireLogin, solicitudController.aceptarSolicitud);

//rechazar solicitud
router.post('/rechazar/:id', requireLogin, solicitudController.rechazarSolicitud);

router.post('/aceptar', requireLogin, solicitudController.aceptarSolicitudDesdeFormulario);

router.post('/rechazar', requireLogin, solicitudController.aceptarSolicitudDesdeFormulario);
module.exports = router;
