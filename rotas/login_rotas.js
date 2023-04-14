const express = require('express');
const usuarioController = require('../controller/usuario_controller');

const router = express.Router();

//Rota do recurso: '/api/login'

router.post('/', usuarioController.validarLogin);

module.exports = router;
