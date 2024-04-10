const express = require('express');
const { getFiles } = require('../controllers/filesController');
const router = express.Router();



// Ruta para buscar archivos .log en la ruta raíz
router.get('/', getFiles);

module.exports = router;
