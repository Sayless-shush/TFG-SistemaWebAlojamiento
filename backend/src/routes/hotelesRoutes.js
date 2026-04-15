const express = require('express');
const router = express.Router();
const hotelesController = require('../controllers/hotelesController');

router.get('/', hotelesController.getHoteles);
router.post('/', hotelesController.addHotel);
router.delete('/:id', hotelesController.deleteHotel);

module.exports = router;
