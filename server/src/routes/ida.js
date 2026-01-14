const express = require('express');
const router = express.Router();
const idaController = require('../controllers/idaController');

router.post('/orders', idaController.list);

module.exports = router;
