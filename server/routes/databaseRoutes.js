const express = require('express');
const router = express.Router();
const { findTicks, deleteTicksByUnix } = require('../controllers/databaseController');
const { logger } = require('../config/pino');
const CHECKSTATUS = require('../models/checkStatus');

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

router.get('/lastdata', async (req, res) => {
    try {
        const document = await CHECKSTATUS.findOne({ _id: '65ea47f3c00ef4507c6b71a4' });
        // Transformar los valores UNIX a fechas ISO
        const startArt7ISO = new Date(parseInt(document.startArt7)).toISOString();
        const startArt10ISO = new Date(parseInt(document.startArt10)).toISOString();
        const startAtr14ISO = new Date(parseInt(document.startAtr14)).toISOString();
        const lastUnixRecordISO = new Date(parseInt(document.lastUnixRecord)).toISOString();
        const startUnixISO = new Date(parseInt(document.startUnix)).toISOString();
        const startUnixMissingDataISO = new Date(parseInt(document.startUnixMissingData)).toISOString();
        const startUpDownISO = new Date(parseInt(document.startUpDown)).toISOString();
        // Construir el nuevo documento con los valores transformados
        const transformedDocument = {
            startArt7: startArt7ISO,
            startArt10: startArt10ISO,
            startAtr14: startAtr14ISO,
            lastUnixRecord: lastUnixRecordISO,
            startUnix: startUnixISO,
            checkCompleteness: document.checkCompleteness,
            updateMissingData: document.updateMissingData,
            updateWrongData: document.updateWrongData,
            updateAtr: document.updateAtr,
            startUnixMissingData: startUnixMissingDataISO,
/*            missingData: document.missingData,
            missingDataHandled: document.missingDataHandled,
             firstValues: {
                startUpDown: startUpDownISO
            },
            trendingData: document.trendingData, */
        };
        // Enviar el documento transformado como respuesta
        res.json(transformedDocument);
    } catch (error) {
        res.status(500).json({ error: 'Error en la consulta' });
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