const BTC_USDT_BINANCE_15m_signal_atr7 = require('../models/btc-binance-15m-signal-atr7');
const BTC_USDT_BINANCE_15m = require('../models/btc-binance-15m');

// Controlador para manejar la consulta de señales
const getSignals = async (req, res) => {
    try {
        // Parámetros de consulta
        const { start, end, signal, page, order, calcularRendimiento, saldoInicial, limit } = req.query;
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
            rendimientoTotal = calcularRendimientoFuncion(signals, closeValues, saldoInicial);
        }

        // Respuesta
        res.json({ totalCount, signals: result, rendimientoTotal });
    } catch (error) {
        res.status(500).json({ error: 'Error en la consulta' });
    }
};

// Función para calcular el rendimiento
const calcularRendimientoFuncion = (signals, closeValues, saldoInicial) => {
    let saldoFinal = saldoInicial; // Saldo final inicialmente igual al saldo inicial
    let rendimientoTotal = 0; // Rendimiento total inicialmente 0
    let operaciones = []; // Lista para almacenar detalles de operaciones

    // Iterar sobre las señales
    for (let i = 0; i < signals.length; i++) {
        const signal = signals[i];
        const close = closeValues[i].close;

        // Determinar si es una señal de compra o venta
        if (signal.trending3Signal === 'BUY') {
            // Calcular el saldo final después de la compra
            saldoFinal = (saldoFinal * (1 - 0.005)) / close;
            // Registrar la operación de compra
            operaciones.push({
                type: 'BUY',
                price: close,
                balance: saldoFinal
            });
        } else if (signal.trending3Signal === 'SELL') {
            // Calcular el saldo final después de la venta
            saldoFinal = saldoFinal * (1 - 0.003) * close;
            // Registrar la operación de venta
            operaciones.push({
                type: 'SELL',
                price: close,
                balance: saldoFinal
            });
        }
    }

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
