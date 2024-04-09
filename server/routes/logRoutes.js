const express = require('express');
const { getLogFiles } = require('../controllers/logController');
const router = express.Router();



// Ruta para buscar archivos .log en la ruta raíz
router.get('/logs', getLogFiles);

module.exports = router;
