const upDownTrending = (currentRecord, lastRecord, lastRecordTrending, atrLevel) => {
    const lh2 = (currentRecord.low + currentRecord.high) / 2;
    const up = lh2 - (atrLevel * currentRecord.atr7);
    const down = lh2 + (atrLevel * currentRecord.atr7);

    let upTrend, downTrend;
    if (lastRecordTrending && lastRecordTrending.trending3) {
        upTrend = lastRecord.close > lastRecordTrending.trending3.upTrend ? Math.max(up, lastRecordTrending.trending3.upTrend) : up;
        downTrend = lastRecord.close < lastRecordTrending.trending3.downTrend ? Math.min(down, lastRecordTrending.trending3.downTrend) : down;
    } else {
        upTrend = up;
        downTrend = down;
    }
    return { up, down, upTrend, downTrend };
};

const buySellSignalFunction = (currentRecord, lastRecordTrending, startUnix, up, down) => {
    let buySellSignal, signal;
    /* if currentRecord is equal to first atr7 value on database, skip this process -because there is no trend data in no atr record data
    in lastRecord */
    if (currentRecord.unix === startUnix.firstValues.atr7){
        logger.info(`[updateTrending] Current record is first atr record. Couldn't update buy sell signal`)
    }else{
    if( currentRecord.close > lastRecordTrending.trending3.downTrend ){
        buySellSignal = up;
        signal = 1;
    }else {
        if( currentRecord.close  < lastRecordTrending.trending3.upTrend ){
            buySellSignal = down;
            signal = -1;
        }else{
            if(lastRecordTrending.trending3.signal === undefined){
                false
            }else{
                if(lastRecordTrending.trending3.signal === 1){
                    buySellSignal = up; 
                    signal = lastRecordTrending.trending3.signal;
                }else{
                    buySellSignal = down; 
                    signal = lastRecordTrending.trending3.signal;
                }
            }
        }
    }
    };
    return { buySellSignal, signal }
};

module.exports = {upDownTrending, buySellSignalFunction}