const express = require('express');
const router = express.Router();
const clubesController = require('../controllers/clubesController');

router.get('/', clubesController.getClubes);
router.post('/', clubesController.addClub);

module.exports = router;
