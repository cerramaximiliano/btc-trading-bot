const cron = require('node-cron');
const BTC_USDT_BINANCE_1h = require('../models/btc-binance-1h.js');
const ATR = require('technicalindicators').ATR
const {logger} = require('../config/pino');
const {loggerError} = require('../config/pino');
const Binance = require('node-binance-api');
const binance = new Binance().options({
  APIKEY: 'kVjOuliddPpQst74Kw2EZPfjyJSSiAp9vATsrng1rLhBz6t99Iz0UFA0VYB9CrGE',
  APISECRET: 'ysORFkS6jtk6EXeb7ArycxEWVzMfluvqvFzNeHg4Pm5MHnyaL4GXxtMRR6HrLhJ5'
});

let high = 0;
let low = 0;


cron.schedule(`3 */1 * * *`, () => {
    (async () => {
        try{
            const findLastRecord = await BTC_USDT_BINANCE_1h.find().sort({unix: -1}).limit(1);
            const result = await binance.candlesticks("BTCUSDT", "1h");
            if(findLastRecord[0].unix === result[0] ){
                low = Number(result[3]);
                high = Number(result[2]);
            }else{
                false
            }
        }catch(err){
            console.log(err)
        }
    })()
}, {
    scheduled: true,
    timezone: "America/Argentina/Buenos_Aires"
});




binance.websockets.candlesticks(['BTCUSDT'], "1h", (candlesticks) => {
    (async() => {
    let { e:eventType, E:eventTime, s:symbol, k:ticks } = candlesticks;
    let { o:open, h:highBinance, l:lowBinance, c:close, v:volume, n:trades, i:interval, x:isFinal, q:quoteVolume, V:buyVolume, Q:quoteBuyVolume } = ticks;
        let date = new Date();
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        let timeFrame = date.getTime();
        let currentTimeFrame = (new Date()).getTime()
        let lowWebSocket = Number(lowBinance);
        let highWebSocket = Number(highBinance);
        const resultLastPrice = await BTC_USDT_BINANCE_1h.find().sort({unix: -1}).limit(1);
                if( currentTimeFrame  > timeFrame+150000){
                    console.log('time to update')
                    console.log(`Variable low = ${low}, Variable high = ${high}`)
                    console.log(`Variable lowWebSocket = ${lowWebSocket}, Variable highWebSocket = ${highWebSocket}`)
                if( low === 0 || high === 0 || low === undefined || high === undefined ){
                console.log(`low/high without price. Find Market price: ${low} ${high}`)
                const resultLastPrice = await BTC_USDT_BINANCE_1h.find().sort({unix: -1}).limit(1)
                let lowDataBase = resultLastPrice[0].low;
                let highDataBase = resultLastPrice[0].high;
                let unix = resultLastPrice[0].unix;
                if( lowDataBase > lowWebSocket ){
                    logger.info(`low update`);
                    const resultLastPrice = await BTC_USDT_BINANCE_1h.find().sort({unix: -1}).limit(1);
                    let unix = resultLastPrice[0].unix;
                    const lastAtrRecord = await BTC_USDT_BINANCE_1h.findOne({unix: unix - 3600000});
                    if(lastAtrRecord === null){
                        return false
                    }else{
                        const newAtr = (lastAtrRecord.atr * 6 + ( Math.max(Math.max(resultLastPrice[0].high - resultLastPrice[0].low, resultLastPrice[0].high - lastAtrRecord.close ), lastAtrRecord.close -  lastAtrRecord.low ) )) / 7;
                        await BTC_USDT_BINANCE_1h.findOneAndUpdate({unix: unix}, {low: lowWebSocket})
                        low = lowWebSocket
                    }
                }else{
                    low = lowDataBase;
                };

                if( highDataBase < highWebSocket ){
                    logger.info(`high update`);
                    const resultLastPrice = await BTC_USDT_BINANCE_1h.find().sort({unix: -1}).limit(1);
                    let unix = resultLastPrice[0].unix;
                    const lastAtrRecord = await BTC_USDT_BINANCE_1h.findOne({unix: unix - 3600000});
                    if(lastAtrRecord === null){
                        return false
                    }else{
                        const newAtr = (lastAtrRecord.atr * 6 + ( Math.max(Math.max(resultLastPrice[0].high - resultLastPrice[0].low, resultLastPrice[0].high - lastAtrRecord.close ), lastAtrRecord.close -  lastAtrRecord.low ) )) / 7;
                        await BTC_USDT_BINANCE_1h.findOneAndUpdate({unix: unix}, {high: highWebSocket, atr: Number(newAtr)})
                    }

                    high = highWebSocket
                }else {
                    high = highDataBase;
                }

                
                }else{
                if(low > lowWebSocket){
                    const resultLastPrice = await BTC_USDT_BINANCE_1h.find().sort({unix: -1}).limit(1);
                    let unix = resultLastPrice[0].unix;
                    const lastAtrRecord = await BTC_USDT_BINANCE_1h.findOne({unix: unix - 3600000});
                    if(lastAtrRecord === null){
                        return false
                    }else{
                        const newAtr = (lastAtrRecord.atr * 6 + ( Math.max(Math.max(resultLastPrice[0].high - resultLastPrice[0].low, resultLastPrice[0].high - lastAtrRecord.close ), lastAtrRecord.close -  lastAtrRecord.low ) )) / 7;
                        await BTC_USDT_BINANCE_1h.findOneAndUpdate({unix: unix}, {low: lowWebSocket, atr: newAtr});
                        low = lowWebSocket;
                    }
                }
                if(high < highWebSocket){
                    const resultLastPrice = await BTC_USDT_BINANCE_1h.find().sort({unix: -1}).limit(1);
                    let unix = resultLastPrice[0].unix;
                    const lastAtrRecord = await BTC_USDT_BINANCE_1h.findOne({unix: unix - 3600000});
                    if(lastAtrRecord === null){
                        return false
                    }else{
                        const newAtr = (lastAtrRecord.atr * 6 + ( Math.max(Math.max(resultLastPrice[0].high - resultLastPrice[0].low, resultLastPrice[0].high - lastAtrRecord.close ), lastAtrRecord.close -  lastAtrRecord.low ) )) / 7;
                        await BTC_USDT_BINANCE_1h.findOneAndUpdate({unix: resultLastPrice[0].unix}, {high: highWebSocket, atr: newAtr});
                        high = highWebSocket;
                    }
                }
                }
                }else{
                    console.log('no time to update')
                    false;
                }

            })();
            });




    //function to calculate atr since first unix record to {limit} next record
    //period {period}
    function result (period, limit) { BTC_USDT_BINANCE_1h.find().sort({unix: 1}).limit(limit)
    .then(res => {
        const open = [];
        const high = [];
        const low = [];
        const close = [];
        res.forEach(function(x, i) {
            open.push(x.open);
            high.push(x.high);
            close.push(x.close);
            low.push(x.low);
        });
        const input = {
            high: high,
            low: low,
            close: close,
            period: period
        };
        const atrResult = ATR.calculate(input);
        const update = [];
        atrResult.forEach(function(ele, index) {
            update.push(
                {
                    updateOne: {
                        filter: {
                            unix: res[index+7].unix, 
                        },
                        update: {
                            atr: atrResult[index], 
                        },
                        upsert: true
                    }
                }
            )
        });
        const bulkOperation = BTC_USDT_BINANCE_1h.bulkWrite(update).then(result => {
            console.log(result)
        })
        .catch(err => console.log(err))
    })
    .catch(err =>{
        console.log(err)
    })
};


    //FUNCTION TO UPDATE BACK RECORDS
    // (async() => {
    //     const newRecords = [];
    //     const lastRecord = await BTC_USDT_BINANCE_1h.find().sort({unix: 1}).limit(1);
    //     binance.candlesticks("BTCUSDT", "1h", (error, ticks, symbol) => {
    //         console.log(ticks)
    //     ticks.forEach(function(element, index) {
    //         newRecords.push({
    //             unix: element[0],
    //             open: Number(element[1]),
    //             high: Number(element[2]),
    //             low: Number(element[3]),
    //             close: Number(element[4])
    //         })
    //     });
    //     (async() => {
    //         const result = await BTC_USDT_BINANCE_1h.insertMany(newRecords);
    //         console.log(result);
    //     })();

    // }, {limit: 500, endTime: lastRecord[0].unix - 3600000});
    // })();
    


    //FUNCTION TO CANDLESTICK FIND LAST HOUR DATA
        // (async() => {
    //     const result = await binance.candlesticks("BTCUSDT", "1h");
    //     console.log(result[result.length-1])
    // })()
