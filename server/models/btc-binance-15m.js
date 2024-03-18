const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    unix: {type: Number, unique: true, required: true },
    date: {type: Date},
    symbol: {type: String},
    open: {type: Number},
    high: {type: Number},
    low: {type: Number},
    close: {type: Number},
    atr7: {type: Number},
}, {
    collection: 'btc/usdt-binance-15m'
})

module.exports = mongoose.model('BTC_USDT_BINANCE/15m', schema);