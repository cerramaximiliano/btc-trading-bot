const BTC_USDT_BINANCE_15m_signal_atr7 = require('../models/signal/btc-binance-15m-signal-atr7');
const BTC_USDT_BINANCE_15m = require('../models/btc-binance-15m');

// Controlador para manejar la consulta de señales
const getSignals = async (req, res) => {
    try {
        // Parámetros de consulta
        const { start, end, signal, page, order, calcularRendimiento, saldoInicial, limit, feeBuy, feeSell, tipoSaldo } = req.query;
        // Construir la consulta
        let query = {};
        if (start || end) {
            query.unix = {};
            if (start) query.unix.$gte = parseInt(start);
            if (end) query.unix.$lte = parseInt(end);
        }
        if (signal) {
            query.trending3Signal = signal;
        }
        // Opciones de paginación
        const pageNumber = parseInt(page) || 1;

        const skip = (pageNumber - 1) * limit;
        // Realizar la consulta
        const totalCount = await BTC_USDT_BINANCE_15m_signal_atr7.countDocuments(query);
        let signals = await BTC_USDT_BINANCE_15m_signal_atr7.find(query)
                                    .limit(limit)
                                    .skip(skip)
                                    .sort({ unix: order });

        // Obtener los valores CLOSE correspondientes a los unix encontrados
        const unixValues = signals.map(signal => signal.unix);
        const closeValues = await BTC_USDT_BINANCE_15m.find({ unix: { $in: unixValues } }).select('close');

        // Mapear los valores CLOSE al resultado original de la consulta
        const result = signals.map((signal, index) => ({
            ...signal.toJSON(),
            close: closeValues[index].close
        }));

        // Calcular el rendimiento si es necesario
        let rendimientoTotal = null;
        if (calcularRendimiento === 'true') {
            rendimientoTotal = calcularRendimientoFuncion(signals, closeValues, saldoInicial, feeBuy, feeSell, tipoSaldo);
        }

        // Respuesta
        res.json({ totalCount, signals: result, rendimientoTotal });
    } catch (error) {
        res.status(500).json({ error: 'Error en la consulta' });
    }
};

// Función para calcular el rendimiento
const calcularRendimientoFuncion = (signals, closeValues, saldoInicial, comisionCompra, comisionVenta, tipoSaldoInicial) => {
    let saldoFinal = saldoInicial; // Saldo final inicialmente igual al saldo inicial
    let rendimientoTotal = 0; // Rendimiento total inicialmente 0
    let operaciones = []; // Lista para almacenar detalles de operaciones

    // Iterar sobre las señales
    let tipoOperacionInicial = tipoSaldoInicial === 'USDT' ? 'BUY' : 'SELL';
    console.log(tipoOperacionInicial, tipoOperacionInicial)
    for (let i = 0; i < signals.length; i++) {
        const signal = signals[i];
        const close = closeValues[i].close;

        if (operaciones.length === 0){
            if (tipoOperacionInicial === signal.trending3Signal && tipoOperacionInicial === 'SELL') {
                console.log('SELL', tipoOperacionInicial, tipoOperacionInicial, signal.trending3Signal)
                // Registrar la operación de venta
                saldoFinal = saldoFinal * (1 - comisionCompra) / close;
                operaciones.push({
                    type: 'SELL',
                    price: close,
                    balance: saldoFinal,
                    date: new Date(signal.unix).toISOString(),
                    first: signal.trending3Signal
                });

            } else if (tipoOperacionInicial === signal.trending3Signal  && tipoOperacionInicial === 'BUY') {
                console.log('BUY')
                saldoFinal = saldoFinal * (1 - comisionVenta) / close;
                // Registrar la operación de venta
                operaciones.push({
                    type: 'BUY',
                    price: close,
                    balance: saldoFinal,
                    date: new Date(signal.unix).toISOString(),
                    first: signal.trending3Signal
                });
            }
        }else {
        // Determinar si es una señal de compra o venta
        if (signal.trending3Signal === 'BUY') {
            // Calcular el saldo final después de la compra
            saldoFinal = (saldoFinal * (1 - comisionCompra)) / close;
            // Registrar la operación de compra
            operaciones.push({
                type: 'BUY',
                price: close,
                balance: saldoFinal,
                date: new Date(signal.unix).toISOString()
            });
        } else if (signal.trending3Signal === 'SELL') {
            // Calcular el saldo final después de la venta
            saldoFinal = saldoFinal * (1 - comisionVenta) * close;
            // Registrar la operación de venta
            operaciones.push({
                type: 'SELL',
                price: close,
                balance: saldoFinal,
                date: new Date(signal.unix).toISOString()
            });
        }
        }
    };

    // Calcular el rendimiento total
    rendimientoTotal = ((saldoFinal - saldoInicial) / saldoInicial) * 100;

    // Devolver el rendimiento total y detalles de operaciones
    return {
        saldoInicial,
        saldoFinal,
        rendimientoTotal,
        operaciones
    };
};



module.exports = { getSignals };
