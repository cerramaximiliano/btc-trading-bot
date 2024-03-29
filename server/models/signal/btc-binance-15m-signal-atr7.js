const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    unix: {type: Number, unique: true, required: true },
    date: {type: Date},
    trending3Signal: {type: String}
}, {
    collection: 'btc/usdt-binance-15m-signal-atr7'
})

module.exports = mongoose.model('BTC_USDT_BINANCE/15m-signal-atr7', schema);