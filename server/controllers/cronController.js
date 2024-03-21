const cron = require('node-cron');
const { logger } = require('../config/pino');
const BTC_USDT_BINANCE_15m = require('../models/btc-binance-15m');
const CHECKSTATUS = require('../models/checkStatus');
const BTC_USDT_BINANCE_15m_Trending_Atr7 = require('../models/btc-binance-15m-trending');
const BTC_USDT_BINANCE_15m_Signal_Atr7 = require('../models/btc-binance-15m-signal-atr7');
const { ticksPromise } = require('./binanceController');
const { getPreviousQuarterHourUnix } = require('../utils/formatTime');
const { upDownTrending, buySellSignalFunction } = require('../utils/calcFunctions');

const timeout = millis => new Promise(resolve => setTimeout(resolve, millis));

const cronController = async () => { 
    logger.info(`[cronControler] Cron 15m update signal timestamp starting....`);
    try {
        await timeout(60000)
        const quarter = getPreviousQuarterHourUnix();
        const ticks = await ticksPromise("BTCUSDT", "15m", 1, quarter);
        const [time, open, high, low, close] = ticks[0];
        const binanceTime = time;
        logger.info(`[cronControler] Quarter to update: ${quarter}`)
        const savedRecord = await BTC_USDT_BINANCE_15m.findOneAndUpdate({unix: binanceTime}, {date: new Date(binanceTime),symbol: 'BTC-USDT',open: open,high: high,low: low,close: close}, {upsert: true, new: true});
        const update = await BTC_USDT_BINANCE_15m.findOneAndUpdate({_id: "65e63ea63f0bd0c11340c98c" }, {lastUnixRecord: binanceTime});
        const updateCheck = await CHECKSTATUS.findOneAndUpdate({_id: "65ea47f3c00ef4507c6b71a4"}, {lastUnixRecord: binanceTime});
        logger.info(`[cronControler] Record 15m saved: ${time}, ${open}, ${high}, ${low}, ${close}`);
    } catch (error) {
        logger.error('[cronControler] Error:', error);
    }
};

//Actualiza los registros hacia atrás - tomando como base el primer registro válido según fecha y campo Unix
const updateTicks = () => { cron.schedule('*/1 * * * *', async () => {
    try {
        logger.info(`Cron updating ticks starting....`);
        // Obtener el registro más antiguo guardado en la base de datos
        const oldestTick = await BTC_USDT_BINANCE_15m.findOne({ unix: { $exists: true } }).sort({ unix: 1 });
        if (!oldestTick) {
            logger.info('[updateTicks] No ticks found in the database.');
            return;
        }
        const oldestUnix = oldestTick.unix;
        // Obtener 100 registros más hacia atrás en el tiempo
        const updatedTicks = await ticksPromise("BTCUSDT", "15m", 1000, oldestUnix);
        // Construir la operación bulk para actualizar los registros
        const bulkUpdateOps = updatedTicks.map(tick => ({
            updateOne: {
                filter: { unix: tick[0] },
                update: {
                    $set: {
                        date: new Date(tick[0]),
                        symbol: 'BTC-USDT',
                        open: tick[1],
                        high: tick[2],
                        low: tick[3],
                        close: tick[4]
                    }
                }, 
                upsert: true
            }
        }));
        const bulkwrite = await BTC_USDT_BINANCE_15m.bulkWrite(bulkUpdateOps);
        logger.info(`[updateTicks] Updated ${bulkwrite.nUpserted} ticks in the database.`);
    } catch (error) {
        logger.error('[updateTicks] Error updating ticks:', error);
    }
}, {
    scheduled: true,
    timezone: "America/Argentina/Buenos_Aires"
});
}

const checkCompleteness = async () => {
        try {
            const {checkCompleteness, startUnixMissingData} = await CHECKSTATUS.findOne({_id: '65ea47f3c00ef4507c6b71a4'});
            if ( !checkCompleteness.run ){
                return
            }
            const quarter = getPreviousQuarterHourUnix();; // Tiempo actual en milisegundos
            logger.info(`[checkCompleteness] Cron checking completeness starting....`);
            if ( !startUnixMissingData || startUnixMissingData >= quarter ) {
                const updatedDocument = await CHECKSTATUS.findOneAndUpdate(
                    { _id: '65ea47f3c00ef4507c6b71a4' }, 
                    { $set: { 'checkCompleteness.run': false } },
                );
                logger.info('[checkCompleteness] No start unix found in the database or start unix is equal to last unix record.');
                logger.warn(`[checkCompleteness] Process will stop until user restart it.`)
                return;
            }
            const INTERVAL_DIFFERENCE = 60000 * 15; 
            const missingUnixArray = [];
            let currentUnix = startUnixMissingData;
            while (missingUnixArray.length < 500 && currentUnix < quarter) {
                missingUnixArray.push(currentUnix);
                currentUnix += INTERVAL_DIFFERENCE;
            };
            const minUnix = missingUnixArray[0]; // último elemento
            const maxUnix = missingUnixArray[missingUnixArray.length - 1]; // primer elemento
            const existingTicks = await BTC_USDT_BINANCE_15m.find({
                unix: { $gte: minUnix, $lte: maxUnix }
            });
            // Obtener los valores de unix de los ticks existentes
            const existingUnixValues = existingTicks.map(tick => tick.unix);
            // Filtrar los elementos de missingUnixArray que no están presentes en la base de datos
            const missingUnixValues = missingUnixArray.filter(unix => !existingUnixValues.includes(unix));
            if ( missingUnixValues.length > 0 ){
                const updatedDocument = await CHECKSTATUS.findOneAndUpdate(
                    { _id: '65ea47f3c00ef4507c6b71a4' }, 
                    { $set: { 'updateMissingData.run': true }},
                );
                logger.warn(`[checkCompleteness] updateMissingData set to true.`)
            }
            await CHECKSTATUS.findOneAndUpdate(
                {_id: '65ea47f3c00ef4507c6b71a4'},
                {
                    $set: { startUnixMissingData: maxUnix + INTERVAL_DIFFERENCE }, // Establece el campo 'start' al valor de minUnix
                    $addToSet: { missingData: { $each: missingUnixValues } } // Agrega los valores de missingUnixValues al campo 'missingData' sin duplicados
                },
                { upsert: true }
            );
            logger.info(`[checkCompleteness] Database completeness check completed. Missing ${missingUnixValues.length} records.`);
        } catch (error) {
            logger.error('[checkCompleteness] Error checking completeness:', error);
        }
} 

const updateMissingData = async () => {
        try {
            const {updateMissingData, missingData} = await CHECKSTATUS.findOne({_id: '65ea47f3c00ef4507c6b71a4'});
            if ( !updateMissingData.run ){
                return
            }
            logger.info(`[updateMissingData] Cron find and update missing data....`);
            if ( !missingData || missingData.length === 0 ) {
                const updatedDocument = await CHECKSTATUS.findOneAndUpdate(
                    { _id: '65ea47f3c00ef4507c6b71a4' }, 
                    { $set: { 'updateMissingData.run': false } },
                );
                logger.info(`[updateMissingData] No missing data to find and update.`)
                logger.warn(`[updateMissingData] Process will stop until user restart it.`)
                return
            }
            const ticks = await ticksPromise("BTCUSDT", "15m", 1, missingData[0]);
            if (missingData[0] === ticks[0][0]){
                const [time, open, high, low, close] = ticks[0];
                const newRecord = {
                    unix: time,
                    date: new Date(time),
                    symbol: 'BTC-USDT',
                    open: open,
                    high: high,
                    low: low,
                    close: close
                };
                const savedRecord = await BTC_USDT_BINANCE_15m.findOneAndUpdate({unix: time}, newRecord, {upsert: true});
                const pullElement = await CHECKSTATUS.findOneAndUpdate(
                    {_id: '65ea47f3c00ef4507c6b71a4'},
                    { $pull: { missingData: { $in: [missingData[0]] } } },
                    { multi: true }
                );
                logger.info(`[updateMissingData] Record missed added`);
            }else {
                await CHECKSTATUS.findOneAndUpdate(
                    { _id: '65ea47f3c00ef4507c6b71a4' },
                    { $push: { missingDataHandled: missingData[0] } },
                );
                await CHECKSTATUS.findOneAndUpdate(
                    { _id: '65ea47f3c00ef4507c6b71a4' },
                    { $pull: { missingData: missingData[0] } },
                );
                logger.info(`[updateMissingData] Unix time not found on Binance API`)
            }   
        }catch (err){
            logger.error(`error: ${err}`)
        }
} 

const updateWrongData = async () => {
        try {
            const {startUnix, lastUnixRecord, updateWrongData} = await CHECKSTATUS.findOne({_id: '65ea47f3c00ef4507c6b71a4'});
            const nextData = startUnix + (60000 * 15);
            if ( !updateWrongData.run ) {
                return
            }
            if (startUnix >= lastUnixRecord){
                const updatedDocument = await CHECKSTATUS.findOneAndUpdate(
                    { _id: '65ea47f3c00ef4507c6b71a4' }, 
                    { $set: { 'updateAtr.run': false } },
                    { new: true }
                );
                logger.info(`[updateWrongData] No longer data to update.`)
                logger.warn(`[updateWrongData] Process will stop until user restart it.`)
                return
            }
            const ticks = await ticksPromise("BTCUSDT", "15m", 1, startUnix);
            const [time, open, high, low, close] = ticks[0];
            const binanceTime = time;
            const updateCurrent = await BTC_USDT_BINANCE_15m.findOneAndUpdate({unix: startUnix}, {open: open, high: high, low: low, close: close, date: new Date(startUnix)}, {upsert: true})
            await CHECKSTATUS.findOneAndUpdate({_id: '65ea47f3c00ef4507c6b71a4'}, {startUnix: nextData});
                logger.info(`[updateWrongData] Item update successfully: ${startUnix}  ${new Date(startUnix).toISOString()}`)
                logger.info(`[updateWrongData] Next data to update: ${nextData}  ${new Date(nextData).toISOString()}`)
        }catch(err){
            logger.error(`[updateWrongData] Error: ${err}`)
        }
};


const updateAtr = async (atrType, atrField, startField) => {
    try{
        const {[startField]: start, lastUnixRecord, updateAtr, startUnixMissingData} = await CHECKSTATUS.findOne({_id: '65ea47f3c00ef4507c6b71a4'});
        if ( !updateAtr.run ){
            return
        }
        const lastAtrRecord = await BTC_USDT_BINANCE_15m.findOne({unix: start});
        const nextTime = start + (60000 * 15);
        const currentQuarter = getPreviousQuarterHourUnix();
        if ( nextTime > lastUnixRecord ){
            if ( lastUnixRecord < currentQuarter ){
                const updateLastUnixRecord = await CHECKSTATUS.findOneAndUpdate({_id: '65ea47f3c00ef4507c6b71a4'}, {startUnixMissingData: nextTime});
                const updatedDocument = await CHECKSTATUS.findOneAndUpdate(
                    { _id: '65ea47f3c00ef4507c6b71a4' }, 
                    { $set: { 'checkCompleteness.run': true } },
                    logger.warn(`[checkCompleteness] Process turn on.`)
                    );
                    logger.info(`[updateAtr${atrType}] Update last record`)
                }
                logger.info(`[updateAtr${atrType}] No data to update. Last atr: ${lastAtrRecord[atrField]}`)
                return
            }
        const nextUpdateRecord = await BTC_USDT_BINANCE_15m.findOne({unix: nextTime});
        if ( nextUpdateRecord ){
            const newAtr = (lastAtrRecord[atrField] * (atrType - 1) + ( Math.max(Math.max(nextUpdateRecord.high - nextUpdateRecord.low, nextUpdateRecord.high - lastAtrRecord.close ), lastAtrRecord.close -  nextUpdateRecord.low ) )) / atrType;
            await BTC_USDT_BINANCE_15m.findOneAndUpdate({_id: nextUpdateRecord._id}, {[atrField]: newAtr})
            await CHECKSTATUS.findOneAndUpdate({_id: '65ea47f3c00ef4507c6b71a4'}, {[startField]: nextTime});
            const updatedDocument = await CHECKSTATUS.findOneAndUpdate(
                { _id: '65ea47f3c00ef4507c6b71a4' }, 
                { $set: { 'updateUpDown.run': true } },
            );
            logger.warn(`[updateTrending] Process turn on.`)
            logger.info(`[updateAtr${atrType}] New atr value to update document unix ${nextUpdateRecord.unix}`)
        }else{
            let unixMissing = startUnixMissingData > nextTime ? nextTime : startUnixMissingData;
            const update = await CHECKSTATUS.findOneAndUpdate({_id: '65ea47f3c00ef4507c6b71a4'}, {$set: { 'checkCompleteness.run': true, startUnixMissingData: unixMissing } });
            logger.warn(`[updateAtr${atrType}] checkCompleteness set to true starting on ${unixMissing}`)
            logger.info(`[updateAtr${atrType}] No next document to update atr. Next document ${nextTime} ${new Date(nextTime).toISOString()}`)
        }
    }catch(err){
        console.log(err)
        logger.error(`[updateAtr${atrType}] Error: `, err)
    }
};

const updateTrending = async () => {
    try {
        const INTERVAL_DIFFERENCE = 15 * 60000;
        const startUnix = await CHECKSTATUS.findOne({_id: "65ea47f3c00ef4507c6b71a4"});
        const currentRecord = await BTC_USDT_BINANCE_15m.findOne({ unix: startUnix.startUpDown });
        if ( !startUnix.updateUpDown.run){
            return
        }
        if ( !currentRecord || currentRecord.unix > startUnix.lastUnixRecord  ){
            logger.info(`[updateTrending] Couldn't update current record: current record is greater than last Unix Record`)
            const updatedDocument = await CHECKSTATUS.findOneAndUpdate(
                { _id: '65ea47f3c00ef4507c6b71a4' }, 
                { $set: { 'updateUpDown.run': false } },
                );
                logger.warn(`[updateTrending] Process turn off un user restart it.`)
                return
        }
        const lastRecord = await BTC_USDT_BINANCE_15m.findOne({unix: currentRecord.unix - INTERVAL_DIFFERENCE });
        const lastRecordTrending = await BTC_USDT_BINANCE_15m_Trending_Atr7.findOne({unix: lastRecord.unix})
        if ( !currentRecord.atr7 ){
            logger.warn(`[updateTrending] Current Record missing atr7 data: ${currentRecord.unix}`)
            return
        }
        /* Last record doesn'nt exist and Last record is not first ATR value -because there is not minus value than first atr record value- */
        if ( !lastRecordTrending && currentRecord.unix !== startUnix.firstValues.atr7 ){
            logger.warn(`[updateTrending] Missing last record trending data`)
            return
        }

        let { up, down, upTrend, downTrend } = upDownTrending(currentRecord, lastRecord, lastRecordTrending, 3);
        let { buySellSignal, signal } = buySellSignalFunction( currentRecord, lastRecordTrending, startUnix, up, down );

                                    const trendingObject = {
                                        up: up !== undefined ? up : undefined,
                                        down: down !== undefined ? down : undefined,
                                        upTrend: upTrend !== undefined ? upTrend : undefined,
                                        downTrend: downTrend !== undefined ? downTrend : undefined,
                                        buySellSignal: buySellSignal !== undefined ? buySellSignal : undefined,
                                        signal: signal !== undefined ? signal : undefined
                                    };

                                    //console.log(lastRecordTrending.trending3.signal)
                                    //console.log(trendingObject)
                                    const update = await BTC_USDT_BINANCE_15m_Trending_Atr7.findOneAndUpdate({unix: currentRecord.unix}, {unix: currentRecord.unix, date: new Date(currentRecord.unix), trending3: trendingObject}, {upsert: true, new: true});
                                    const updateCurrent = await CHECKSTATUS.findOneAndUpdate({_id: "65ea47f3c00ef4507c6b71a4"}, {startUpDown: currentRecord.unix + INTERVAL_DIFFERENCE});
                                    //console.log(update.trending3.signal)
                                    let obj = {};
                                    if ( lastRecordTrending ){
                                        if (lastRecordTrending.trending3.signal === -1 && update.trending3.signal === 1){
                                            logger.warn(`[updateTrending] Fire BUY signal`)
                                            obj.signal = 'BUY';
                                            obj.date = new Date(currentRecord.unix);
                                            obj.unix = currentRecord.unix
    
                                        }
                                        if (lastRecordTrending.trending3.signal === 1 && update.trending3.signal === -1){
                                            logger.warn(`[updateTrending] Fire SELL signal`)
                                            obj.signal = 'SELL';
                                            obj.date = new Date(currentRecord.unix);
                                            obj.unix = currentRecord.unix
                                        }
                                        if ( obj.signal ){
                                            const signal = await BTC_USDT_BINANCE_15m_Signal_Atr7.findOneAndUpdate(
                                                {unix: currentRecord.unix},
                                                {   date: obj.date,
                                                    trending3Signal: obj.signal
                                                },
                                                {   upsert: true,
                                                    new: true
                                                }
                                            );
                                            //console.log(signal)
                                            logger.info(`[updateTrending] Updated signal alert to ${obj.signal}`)
                                        }
                                    }
                                    logger.info(`[updateTrending] Updated current record ${currentRecord.unix}-${new Date(currentRecord.unix).toISOString()}. Current signal: ${trendingObject.signal}`)
    }catch(err){
        console.log(err)
        logger.error(`[updateTrending] Error: ${err}`)
    }

};

module.exports = { cronController, checkCompleteness, updateMissingData, updateAtr, updateWrongData, updateTrending };