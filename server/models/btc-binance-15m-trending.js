const mongoose = require('mongoose');

const trendingSchema = new mongoose.Schema({
    unix: { type: Number, unique: true, required: true },
    atr7: {
        type: Map,
        of: {
            up: { type: Number },
            down: { type: Number },
            upTrend: { type: Number },
            downTrend: { type: Number }
        }
    },
    atr14: {
        type: Map,
        of: {
            up: { type: Number },
            down: { type: Number },
            upTrend: { type: Number },
            downTrend: { type: Number }
        }
    },
    // Otros valores de ATR y sus tendencias aquí
}, {
    collection: 'btc/usdt-binance-15m-trending'
});

module.exports = mongoose.model('BTC_USDT_BINANCE_15m_Trending', trendingSchema);