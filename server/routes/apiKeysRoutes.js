const express = require('express');
const { generateApiKey } = require('../controllers/apiKeysController');
const router = express.Router();

router.post('/keys', generateApiKey);

module.exports = router;