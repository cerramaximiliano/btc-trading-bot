const express = require('express');
const router = express.Router();
const { ticksPromise } = require('../controllers/binanceController');

router.get('/ticks', async (req, res) => {
    try {
        const { ticker, timeFrame, limit, endTime} = req.query;
        const endTimeUnix = parseInt(endTime) || Date.now();
        const ticks = await ticksPromise(ticker, timeFrame, limit, endTimeUnix);
        res.json(ticks);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
