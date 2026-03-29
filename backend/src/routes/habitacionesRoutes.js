const express = require('express');
const router = express.Router();
const habitacionesController = require('../controllers/habitacionesController');

router.get('/', habitacionesController.getHabitaciones);
router.post('/', habitacionesController.addHabitacion);

module.exports = router;