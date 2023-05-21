const express = require('express');
const router = express.Router();

const starknetCtrl = require('../controllers/starknetController');

router.get('/sid', starknetCtrl.getSID);

module.exports = router;