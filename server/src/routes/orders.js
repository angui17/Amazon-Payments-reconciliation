const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');

router.get('/', ordersController.list);
router.get('/:id', ordersController.getById);
router.post('/', ordersController.create);

module.exports = router;
