const { setupBinance } = require('../config/binanceConfig');
const binance = setupBinance();

const ticksPromise = (ticket, timeFrame, limit, endTime) => {
    return new Promise((resolve, reject) => {
        binance.candlesticks(ticket, timeFrame, (error, ticks, symbol) => {
            if (error) {
                reject('error');
            } else {
                const formattedTicks = ticks.map(tick => {
                    const date = new Date(parseInt(tick[0]));
                    const isoDate = date.toISOString();
                    const tickWithDate = [...tick];
                    tickWithDate.push(isoDate);
                    return tickWithDate;
                });
                resolve(formattedTicks);
            }
        }, { limit: limit, endTime: endTime });
    });
};

module.exports = { ticksPromise };
