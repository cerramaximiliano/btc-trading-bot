const mongoose = require('mongoose');
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


async function updateAtr () {
    const lastAtrRecord = await BTC_USDT_BINANCE_1h.find({atr: {$gte: 0}}).sort({unix: -1}).limit(1)
    const nextUpdateRecord = await BTC_USDT_BINANCE_1h.findOne({unix: lastAtrRecord[0].unix + 3600000})
    console.log(lastAtrRecord[0].unix, nextUpdateRecord.unix)
    const newAtr = (lastAtrRecord[0].atr * 6 + ( Math.max(Math.max(nextUpdateRecord.high - nextUpdateRecord.low, nextUpdateRecord.high - lastAtrRecord[0].close ), lastAtrRecord[0].close -  nextUpdateRecord.low ) )) / 7;
    console.log(`last Atr: ${(lastAtrRecord[0].atr)}, new Atr: ${newAtr}`);
    const updateAtr = await BTC_USDT_BINANCE_1h.findOneAndUpdate({_id: nextUpdateRecord._id}, {atr: Number(newAtr)});
};

exports.updateAtr = async () => {
    const lastAtrRecord = await BTC_USDT_BINANCE_1h.find({atr: {$gte: 0}}).sort({unix: -1}).limit(1)
    const nextUnixRecord = lastAtrRecord[0].unix + 3600000;
    const nextUpdateRecord = await BTC_USDT_BINANCE_1h.findOne({unix: nextUnixRecord});
    let date = new Date();
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    let timeFrame = date.getTime();
    if((nextUpdateRecord === null || nextUpdateRecord === undefined) && nextUpdateRecord <= timeFrame){
        logger.info(`no next record to atr update`);
        binance.candlesticks("BTCUSDT", "1h", (error, ticks, symbol) => {
            let last_tick = ticks[ticks.length - 1];
            if(last_tick[0] === nextUnixRecord){
                const high = Number(last_tick[2]);
                const low = Number(last_tick[3]);
                const open = Number(last_tick[1]);
                const close = Number(last_tick[4]);
                const newAtr = (lastAtrRecord[0].atr * 6 + ( Math.max(Math.max(high - low, high - lastAtrRecord[0].close ), lastAtrRecord[0].close - low ) )) / 7;
                console.log(`last Atr: ${(lastAtrRecord[0].atr)}, new Atr: ${newAtr}`);
                (async() => {
                    let newRecord = new BTC_USDT_BINANCE_1h({
                        unix: nextUnixRecord,
                        high: high,
                        low: low,
                        open: open,
                        close: close,
                        atr: newAtr
                    })
                    try{
                        const saveRecord = await newRecord.save();
                        logger.info(`save new 1h record`)
                    }catch(err){
                        loggerError.error(`no 1h record saved ${err}`)
                        console.log(err)
                    }
                })()
            }
        }, {limit: 1, endTime: nextUnixRecord});
    }else{
        logger.info(`next record to atr update`)
        const newAtr = (lastAtrRecord[0].atr * 6 + ( Math.max(Math.max(nextUpdateRecord.high - nextUpdateRecord.low, nextUpdateRecord.high - lastAtrRecord[0].close ), lastAtrRecord[0].close -  nextUpdateRecord.low ) )) / 7;
        console.log(`last Atr: ${(lastAtrRecord[0].atr)}, new Atr: ${newAtr}`);
        const updateAtr = await BTC_USDT_BINANCE_1h.findOneAndUpdate({_id: nextUpdateRecord._id}, {atr: Number(newAtr)});
    };
};

    exports.binance1hUpdate = async () => {
        (async () => {
            const limit = 1;
            let date = new Date();
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
            let timeFrame = date.getTime();
            try {
                const lastRecord = await BTC_USDT_BINANCE_1h.find().sort({unix: -1}).limit(1);

                binance.candlesticks("BTCUSDT", "1h", (error, ticks, symbol) => {
                    let last_tick = ticks[ticks.length - 1];
                    let newRecord;
                    
                    if(lastRecord[0].unix < timeFrame ){
                        (async () => {
                        try{
                            const lastAtrRecord = await BTC_USDT_BINANCE_1h.find({unix: lastRecord[0].unix - 3600000});
                            if( lastAtrRecord != null && lastAtrRecord != undefined ){
                                const newAtr = (lastAtrRecord[0].atr * 6 + ( Math.max(  Math.max(Number(last_tick[2]) - Number(last_tick[3]), Number(last_tick[2]) - lastAtrRecord[0].close ) , lastAtrRecord[0].close -  Number(last_tick[3]) ) )) / 7;
                                console.log(`last Atr: ${(lastAtrRecord[0].atr)}, new Atr: ${newAtr}`);

                                const lh2 = ((Number(last_tick[2]) + Number(last_tick[3])) / 2);
                                const up = lh2 - (3 * newAtr);
                                const down = lh2 + (3 * newAtr);
                                let upTrend;
                                let downTrend;
                                let buySellSignal;
                                let signal;

                                if(lastAtrRecord[0].close > lastAtrRecord[0].upTrend){
                                    upTrend = Math.max(up, lastAtrRecord[0].upTrend)
                                }else{
                                    upTrend = up;
                                }
                                if(lastAtrRecord[0].close < lastAtrRecord[0].downTrend  ){
                                    downTrend = Math.min(down, lastAtrRecord[0].downTrend)
                                }else{
                                    downTrend = down;
                                };


                                if( Number(last_tick[4]) > lastAtrRecord[0].downTrend ){
                                    buySellSignal = up;
                                    signal = 1;
                                }else {
                                    if( Number(last_tick[4]) < lastAtrRecord[0].upTrend ){
                                        buySellSignal = down;
                                        signal = -1;
                                    }else{
                                        if(lastAtrRecord[0].signal === undefined){
                                            false
                                        }else{
                                            if(lastAtrRecord[0].signal === 1){
                                                buySellSignal = up; 
                                                signal = lastAtrRecord[0].signal;
                                            }else{
                                                buySellSignal = down; 
                                                signal = lastAtrRecord[0].signal;
                                            }
                                        }
                                    }
                                };


                                newRecord =  new BTC_USDT_BINANCE_1h ({
                                    unix: last_tick[0],
                                    open: Number(last_tick[1]),
                                    high: Number(last_tick[2]),
                                    low: Number(last_tick[3]),
                                    close: Number(last_tick[4]),
                                    atr: Number(newAtr),
                                    up: up,
                                    down: down,
                                    upTrend: upTrend,
                                    downTrend: downTrend,
                                    signal: signal,
                                    buySellSignal: buySellSignal,
                                });
                                }else{
                                    newRecord =  new BTC_USDT_BINANCE_1h ({
                                        unix: last_tick[0],
                                        open: Number(last_tick[1]),
                                        high: Number(last_tick[2]),
                                        low: Number(last_tick[3]),
                                        close: Number(last_tick[4]),
                                    });
                                }
                                const result = await newRecord.save()
                                logger.info(`new Record 1h saved`)
                        }catch(error){
                            loggerError.error(`no 1h update error: ${error}`)
                        }
                        })();
                        }else{
                            logger.info(`no 1h record to update`)
                        }
                  }, {limit: 1000, endTime: lastRecord[0].unix+3600000});
                logger.info(`last unix 1h record`)
            }catch(err){
                console.log(`Error: ${err}`)
            }
        })()
    };


    exports.update1hRecords = async () => {
        let date = new Date();
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        let timeFrame = date.getTime();
        const lastRecord = await BTC_USDT_BINANCE_1h.find().sort({unix: -1}).limit(1);
        const newRecordTime = lastRecord[0].unix + 3600000;
        if( newRecordTime > timeFrame ){
            logger.info(`no 1h record to update`)
        }else{
            binance.candlesticks("BTCUSDT", "1h", (error, ticks, symbol) => {
                let last_tick = ticks[ticks.length - 1];
                if(newRecordTime === last_tick[0]){
                    const newRecord = new BTC_USDT_BINANCE_1h({
                        unix: last_tick[0],
                        open: Number(last_tick[1]),
                        high: Number(last_tick[2]),
                        low: Number(last_tick[3]),
                        close: Number(last_tick[4])
                    });
                    (async () => {
                        try{
                            const result = await newRecord.save()
                            logger.info(`new Record 1h saved`)
                        }catch(err){
                            loggerError.error(`1h record error: ${err}`)
                        }
                    })();
                }else{
                    logger.info(`no 1h record to update`)
                }
            }, {limit: 1, endTime: newRecordTime});
        }
    };

    
//Iterador para actualizar UP / DOWN variables a partir de documento {_id: '63513e8ec7d7ad4586c65b5f'} - campo data
exports.iterateAll1hRecords = async () => {
    try{
        const factor = 3;
        const millisecondsHour = 3600000;
        const startDate = await BTC_USDT_BINANCE_1h.findOne({_id: '637b9c92212fc5e68a17e271'});
        const findStartDate = await BTC_USDT_BINANCE_1h.findOne({ unix: startDate.data });
        if(findStartDate.atr != undefined){
            const high = findStartDate.high;
            const low = findStartDate.low;
            const lh2 = ((high + low) / 2);
            const up = lh2 - (factor * findStartDate.atr);
            const down = lh2 + (factor * findStartDate.atr);
            const updateRecord = await BTC_USDT_BINANCE_1h.findOneAndUpdate({ unix: startDate.data }, { up: up, down: down });
            console.log(`resultado up y down`, up, down);
            const addOneHour = await BTC_USDT_BINANCE_1h.findOneAndUpdate({_id: '637b9c92212fc5e68a17e271'}, {data: startDate.data + millisecondsHour});
        }else{
            const addOneHour = await BTC_USDT_BINANCE_1h.findOneAndUpdate({_id: '637b9c92212fc5e68a17e271'}, {data: startDate.data + millisecondsHour});
        }
    }catch(err){
        return err
    }
};

//Iterador para actualizar UP / DOWN y UpTrend  / DownTren a partir de documento  {_id: '63513e8ec7d7ad4586c65b5f'} - campo data
exports.iterateAll1hRecordsTrendUpDown = async () => {
    try {
        const factor = 3;
        const millisecondsHour = 3600000;
        const startDate = await BTC_USDT_BINANCE_1h.findOne({_id: '637b9c92212fc5e68a17e271'});
        const findStartDate = await BTC_USDT_BINANCE_1h.findOne({ unix: startDate.data2 });
        const lastRecord = await BTC_USDT_BINANCE_1h.findOne({ unix: startDate.data2  - millisecondsHour});
        const lastHour = await BTC_USDT_BINANCE_1h.find().sort({unix: -1}).limit(1);

        if(startDate.data2 > lastHour[0].unix){
            false
        }else{
            if( findStartDate.atr != undefined && findStartDate.atr != null ){
                const high = findStartDate.high;
                const low = findStartDate.low;
                const lh2 = ((high + low) / 2);
                const up = lh2 - (factor * findStartDate.atr);
                const down = lh2 + (factor * findStartDate.atr);
                const updateRecord = await BTC_USDT_BINANCE_1h.findOneAndUpdate({ unix: startDate.data2 }, { up: up, down: down });
            }
            if(startDate.data2 === startDate.firstUnixUpDown){
                const upTrend = findStartDate.up;
                const downTrend = findStartDate.down;
                const updateRecord = await BTC_USDT_BINANCE_1h.findOneAndUpdate({ unix: startDate.data2 }, { upTrend: upTrend, downTrend: downTrend });
                const addOneHour = await BTC_USDT_BINANCE_1h.findOneAndUpdate({_id: '637b9c92212fc5e68a17e271'}, {data2: startDate.data2 + millisecondsHour});
            }else{
                const lastRecord = await BTC_USDT_BINANCE_1h.findOne({ unix: startDate.data2 - millisecondsHour });
                if(lastRecord.close > lastRecord.upTrend){
                    let upTrend = Math.max(findStartDate.up, lastRecord.upTrend)
                    let updateRecord = await BTC_USDT_BINANCE_1h.findOneAndUpdate({ unix: startDate.data2 }, { upTrend: upTrend});
                }else{
                    let upTrend = findStartDate.up;
                    let updateRecord = await BTC_USDT_BINANCE_1h.findOneAndUpdate({ unix: startDate.data2 }, { upTrend: upTrend});
                }
                if(lastRecord.close < lastRecord.downTrend  ){
                    let downTrend = Math.min(findStartDate.down, lastRecord.downTrend)
                    const updateRecord = await BTC_USDT_BINANCE_1h.findOneAndUpdate({ unix: startDate.data2 }, { downTrend: downTrend});
                }else{
                    let downTrend = findStartDate.down;
                    let updateRecord = await BTC_USDT_BINANCE_1h.findOneAndUpdate({ unix: startDate.data2 }, { downTrend: downTrend});
                }
                const addOneHour = await BTC_USDT_BINANCE_1h.findOneAndUpdate({_id: '637b9c92212fc5e68a17e271'}, {data2: startDate.data2 + millisecondsHour});
            }
        }
    }catch (err){
        loggerError.error(`error update up/down trend: ${err}`)
    }
};


exports.iterateAllRecordAndUpdateSignalTimeStamp = async () => {
    try{
        const millisecondsHour = 3600000;
        const startDate = await BTC_USDT_BINANCE_1h.findOne({_id: '637b9c92212fc5e68a17e271'});
        const findStartDate = await BTC_USDT_BINANCE_1h.findOne({ unix: startDate.data4 });
        const lastRecord = await BTC_USDT_BINANCE_1h.findOne({ unix: startDate.data4 - millisecondsHour });
        if(findStartDate === null){
            false
        }else{
            if(findStartDate.signal === 1 && (lastRecord.signal === -1 || lastRecord.signal === undefined) ){
                console.log(true, 'buy')
                await BTC_USDT_BINANCE_1h.findOneAndUpdate({_id: '637b9c92212fc5e68a17e271'}, {$push: {signals: {unix: findStartDate.unix, signal: "BUY"}} });
            }else if(findStartDate.signal === -1 && (lastRecord.signal === 1 || lastRecord.signal === undefined) ){
                console.log(true, 'sell')
                await BTC_USDT_BINANCE_1h.findOneAndUpdate({_id: '637b9c92212fc5e68a17e271'}, {$push: {signals: {unix: findStartDate.unix, signal: "SELL"}}  });
            }else{
                false
            }
            const addOneHour = await BTC_USDT_BINANCE_1h.findOneAndUpdate({_id: '637b9c92212fc5e68a17e271'}, {data4: startDate.data4 + millisecondsHour});
        }
    }catch(err){
        loggerError.error(`error update signal stamp: ${err}`)
    }
};

async function updateBuySellSignal (startDate, findStartDate, lastRecord, millisecondsHour) {
    const close = findStartDate.close;
    const up = findStartDate.downTrend;
    const down = findStartDate.upTrend;
    try{
        if(findStartDate.close != undefined){
            logger.info(`update buy - sell signal`)
                if( close > lastRecord.downTrend ){
                    const update = await BTC_USDT_BINANCE_1h.findOneAndUpdate({ unix: startDate.data3 },  {buySellSignal: up, signal: 1} )
                }else {
                    if( close < lastRecord.upTrend ){
                        const update = await BTC_USDT_BINANCE_1h.findOneAndUpdate({ unix: startDate.data3 },  {buySellSignal: down, signal: -1} )
                    }else{
                        if(lastRecord.signal === undefined){
                            false
                        }else{
                            if(lastRecord.signal === 1){
                                const update = await BTC_USDT_BINANCE_1h.findOneAndUpdate({ unix: startDate.data3 },  {buySellSignal: up, signal: lastRecord.signal} )
                            }else{
                                const update = await BTC_USDT_BINANCE_1h.findOneAndUpdate({ unix: startDate.data3 },  {buySellSignal: down, signal: lastRecord.signal} )
                            }
                        }
                    }
                }
            const addOneHour = await BTC_USDT_BINANCE_1h.findOneAndUpdate({_id: '637b9c92212fc5e68a17e271'}, {data3: startDate.data3 + millisecondsHour});
        }else{
            logger.info(`add 1h to record data2`)
            const addOneHour = await BTC_USDT_BINANCE_1h.findOneAndUpdate({_id: '637b9c92212fc5e68a17e271'}, {data2: startDate.data3 + millisecondsHour});
        }
    }catch(err){
        loggerError.error(``)
    }
};


exports.iterateAll1hRecordsAndUpdateSignal = async () => {
    try{
        const millisecondsHour = 3600000;
        const startDate = await BTC_USDT_BINANCE_1h.findOne({_id: '637b9c92212fc5e68a17e271'});
        const findStartDate = await BTC_USDT_BINANCE_1h.findOne({ unix: startDate.data3 });
        if(findStartDate === null){
            false
        }else{
            const close = findStartDate.close;
            const up = findStartDate.downTrend;
            const down = findStartDate.upTrend;
            const lastRecord = await BTC_USDT_BINANCE_1h.findOne({ unix: startDate.data3 - millisecondsHour });
            if(findStartDate.close != undefined){
                logger.info(`update buy - sell signal`)
                    if( close > lastRecord.downTrend ){
                        const update = await BTC_USDT_BINANCE_1h.findOneAndUpdate({ unix: startDate.data3 },  {buySellSignal: up, signal: 1} )
                    }else {
                        if( close < lastRecord.upTrend ){
                            const update = await BTC_USDT_BINANCE_1h.findOneAndUpdate({ unix: startDate.data3 },  {buySellSignal: down, signal: -1} )
                        }else{
                            if(lastRecord.signal === undefined){
                                false
                            }else{
                                if(lastRecord.signal === 1){
                                    const update = await BTC_USDT_BINANCE_1h.findOneAndUpdate({ unix: startDate.data3 },  {buySellSignal: up, signal: lastRecord.signal} )
                                }else{
                                    const update = await BTC_USDT_BINANCE_1h.findOneAndUpdate({ unix: startDate.data3 },  {buySellSignal: down, signal: lastRecord.signal} )
                                }
                            }
                        }
                    }
                const addOneHour = await BTC_USDT_BINANCE_1h.findOneAndUpdate({_id: '637b9c92212fc5e68a17e271'}, {data3: startDate.data3 + millisecondsHour});
            }else{
                logger.info(`add 1h to record data2`)
                const addOneHour = await BTC_USDT_BINANCE_1h.findOneAndUpdate({_id: '637b9c92212fc5e68a17e271'}, {data2: startDate.data3 + millisecondsHour});
            }
        }
    }catch(err){
        loggerError.error(`error update 1h signal: ${err}`)
    }
};

