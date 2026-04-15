const express = require('express');
const router = express.Router();
const habitacionesController = require('../controllers/habitacionesController');

router.get('/', habitacionesController.getHabitaciones);
router.post('/', habitacionesController.addHabitacion);
router.delete('/:id', habitacionesController.deleteHabitacion);

module.exports = router;
