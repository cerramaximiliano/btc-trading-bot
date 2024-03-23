const mongoose = require('mongoose');

const trendingSchema = new mongoose.Schema({
    unix: { type: Number, unique: true, required: true },
    date: {type: Date},
    trending3: {
            up: { type: Number },
            down: { type: Number },
            upTrend: { type: Number },
            downTrend: { type: Number },
            buySellSignal: {type: Number},
            signal: {type: Number},
    },
}, {
    collection: 'btc/usdt-binance-15m-trending-atr14'
});

module.exports = mongoose.model('BTC_USDT_BINANCE_15m_Trending_Atr14', trendingSchema);