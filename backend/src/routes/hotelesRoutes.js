const express = require('express');
const router = express.Router();
const hotelesController = require('../controllers/hotelesController');

router.get('/', hotelesController.getHoteles);
router.post('/', hotelesController.addHotel);

module.exports = router;
