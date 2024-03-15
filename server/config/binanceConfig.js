const Binance = require('node-binance-api');

const setupBinance = () => {
    const binance = new Binance().options({
        APIKEY: process.env.API_KEY_BINANCE,
        APISECRET: process.env.SECRET_KEY_BINANCE,
        'family': 4
    });
    return binance;
};

module.exports = { setupBinance };