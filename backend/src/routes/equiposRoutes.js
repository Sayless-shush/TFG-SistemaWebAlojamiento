const express = require('express');
const router = express.Router();
const equiposController = require('../controllers/equiposController');

router.get('/', equiposController.getEquipos);
router.post('/', equiposController.addEquipo);

module.exports = router;
