const express = require('express');
const router = express.Router();

const asignacionController = require('../controllers/asignacionController');


router.post('/', asignacionController.ejecutarAsignacion);

module.exports = router;