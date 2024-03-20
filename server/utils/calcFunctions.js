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

function simulateResultTrading(signalsData, comisionCompra, comisionVenta, saldoInicial, accionesIniciales) {
    let saldoParcial = saldoInicial; // Saldo parcial
    let acciones = accionesIniciales || 0; // Cantidad de acciones en cartera
    let operaciones = []; // Array para almacenar las operaciones realizadas

    signalsData.signals.forEach((signal) => {
        let comision = 0; // Comisión por esta transacción
        let variacionSaldo = 0; // Variación del saldo parcial en esta transacción

        if (signal.trending3Signal === 'BUY') {
            // Realizar compra si hay saldo suficiente
            if (saldoParcial >= signal.close + comisionCompra) {
                acciones += 1;
                saldoParcial -= signal.close + comisionCompra;
                comision = comisionCompra;
                operaciones.push({ fecha: signal.date, accion: 'COMPRA', precio: signal.close, comision });
            }
        } else if (signal.trending3Signal === 'SELL') {
            // Realizar venta si se tienen acciones en cartera
            if (acciones > 0) {
                saldoParcial += signal.close - comisionVenta;
                variacionSaldo = signal.close; // Variación respecto al precio de compra
                acciones -= 1;
                comision = comisionVenta;
                operaciones.push({ fecha: signal.date, accion: 'VENTA', precio: signal.close, variacionSaldo, comision });
            }
        }

        // Actualizar saldo parcial con la variación de esta transacción y la comisión
        saldoParcial += variacionSaldo - comision;
    });

    // Calcular rendimiento final
    const saldoFinal = saldoParcial + (acciones * signalsData.signals[signalsData.signals.length - 1].close);
    const rendimiento = saldoFinal - saldoInicial; // Rendimiento neto

    return { saldoInicial, saldoFinal, rendimiento, operaciones };
}


module.exports = {upDownTrending, buySellSignalFunction, simulateResultTrading}