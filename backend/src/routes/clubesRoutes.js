const express = require('express');
const router = express.Router();
const clubesController = require('../controllers/clubesController');

router.get('/', clubesController.getClubes);
router.post('/', clubesController.addClub);
router.put('/:id/hotel', clubesController.updateClubHotel);
router.delete('/:id', clubesController.deleteClub);

module.exports = router;
