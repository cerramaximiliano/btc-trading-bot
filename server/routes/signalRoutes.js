const express = require('express');
const router = express.Router();
const {getSignals} = require('../controllers/signalController');


router.get('/btc', getSignals);

module.exports = router;