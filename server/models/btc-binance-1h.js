const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    unix: {type: Number},
    date: {type: Date},
    symbol: {type: String},
    open: {type: Number},
    high: {type: Number},
    low: {type: Number},
    close: {type: Number},
    atr: {type: Number},
    up: {type: Number},
    down: {type: Number},
    upTrend: {type: Number},
    downTrend:  {type: Number},
    chartOHLC: {type: Array},
    data: {type: Number},
    data2: {type: Number},
    data3: {type: Number},
    data4: {type: Number},
    firstUnixUpDown: {type: Number},
    firstAtrRecord: {type: Number},
    firstBuySellSignal: {type: Number},
    buySellSignal: {type: Number},
    signal: {type: Number},
    signals: {type: Array}
}, {
    collection: 'btc/usd-binance-1h'
})

module.exports = mongoose.model('BTC_USDT_BINANCE/1h', schema);