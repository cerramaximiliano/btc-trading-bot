const cron = require('node-cron');
const {logger} = require('../config/pino');
const BTC_USDT_BINANCE_15m = require('../models/btc-binance-15m');
const Binance = require('node-binance-api');
const binance = new Binance().options({
  APIKEY: 'kVjOuliddPpQst74Kw2EZPfjyJSSiAp9vATsrng1rLhBz6t99Iz0UFA0VYB9CrGE',
  APISECRET: 'ysORFkS6jtk6EXeb7ArycxEWVzMfluvqvFzNeHg4Pm5MHnyaL4GXxtMRR6HrLhJ5', 
  'family': 4
});
const timeout = millis => new Promise(resolve => setTimeout(resolve, millis));

const cronController = cron.schedule('*/15 * * * *', async () => {
    logger.info(`cron 15m update signal timestamp starting....`);

    try {
        const ticksPromise = () => {
            return new Promise((resolve, reject) => {
                binance.candlesticks("BTCUSDT", "15m", (error, ticks, symbol) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(ticks);
                    }
                }, { limit: 10 });
            });
        };
        await timeout(50000)
        const ticks = await ticksPromise();

        const [time, open, high, low, close] = ticks[ticks.length - 1];
        const binanceTime = time;

        const newRecord = new BTC_USDT_BINANCE_15m({
            unix: binanceTime,
            date: new Date(binanceTime),
            symbol: 'BTC-USDT',
            open: open,
            high: high,
            low: low,
            close: close
        });

        const savedRecord = await newRecord.save();
        console.log(savedRecord);
    } catch (error) {
        logger.error('Error:', error);
    }
}, {
    scheduled: true,
    timezone: "America/Argentina/Buenos_Aires"
});

module.exports = cronController;
