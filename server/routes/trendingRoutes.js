const express = require('express');
const router = express.Router();
const { findTrends } = require('../controllers/trendingController');

// Ruta para buscar tendencias
router.get('/', async (req, res) => {
    try {
        const { start, end, trend, page = 1, order } = req.query;
        const result = await findTrends(start, end, trend, parseInt(page), parseInt(order));
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;