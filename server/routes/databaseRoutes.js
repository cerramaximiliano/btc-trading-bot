const express = require('express');
const router = express.Router();
const { findTicks, deleteTicksByUnix } = require('../controllers/databaseController');
const { logger } = require('../config/pino');

router.get('/ticks', async (req, res) => {
    try {
        const { ticker, timeFrame, limit, startTime, endTime, atr7, pageNumber, order } = req.query;

        // Llamar a la función findTicks con los parámetros proporcionados
        const ticks = await findTicks(ticker, timeFrame, limit, startTime, endTime, atr7, pageNumber, order);
        res.json(ticks);
    } catch (error) {
        logger.error(`error: ${error}`)
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/ticks/delete', async (req, res) => {
    try {
        const { unixValues } = req.body;
        if (!unixValues || !Array.isArray(unixValues)) {
            return res.status(400).json({ error: 'Los valores de unix deben ser proporcionados como un array' });
        }
        const result = await deleteTicksByUnix(unixValues);
        res.json({ message: `${result.deletedCount} documentos eliminados` });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


module.exports = router;