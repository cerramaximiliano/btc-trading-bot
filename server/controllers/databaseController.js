const BTC_USDT_BINANCE_15m = require('../models/btc-binance-15m');
const BTC_USDT_BINANCE_15m_Trending_Atr7 = require('../models/btc-binance-15m-trending');
const BTC_USDT_BINANCE_15m_Trending_Atr10 = require('../models/trending/btc-binance-15m-trendingAtr10');
const BTC_USDT_BINANCE_15m_Trending_Atr14 = require('../models/trending/btc-binance-15m-trendingAtr14');

const trendAtr7 = async (ticker, timeFrame, limit, startTime, endTime, atr7, pageNumber, order) => {
    try {
        let query = {};
        query.ticker = ticker;
        query.timeFrame = timeFrame;

                let unixQuery = {};
                if (startTime !== undefined && endTime !== undefined) {
                    unixQuery.$gte = parseInt(startTime);
                    unixQuery.$lte = parseInt(endTime);
                } else if (startTime !== undefined) {
                    unixQuery.$gte = parseInt(startTime);
                } else if (endTime !== undefined) {
                    unixQuery.$lte = parseInt(endTime);
                }
                
                if (Object.keys(unixQuery).length !== 0) {
                    query.unix = unixQuery;
                }
        let options = { date: 1, trending3: 1};
        if (limit !== undefined) {
            limit = parseInt(limit);
        } else {
            limit = 100;
        }
        if (pageNumber !== undefined && pageNumber > 0) {
            pageNumber = (pageNumber - 1) * limit;
        }
        const [data] = await Promise.all([
            BTC_USDT_BINANCE_15m_Trending_Atr7.find(query)
                                .sort({ unix: order || 1 }) // Ordenar por fecha Unix descendente
                                .limit(limit)
                                .skip(pageNumber || 0)
                                .select(options), // Seleccionar solo los campos requeridos
        ]);
        return data;
    } catch (error) {
        throw error;
    }
};

const trendAtr10 = async (ticker, timeFrame, limit, startTime, endTime, atr7, pageNumber, order) => {
    try {
        let query = {};
        // Construir la consulta básica para el ticker y el timeFrame
        query.ticker = ticker;
        query.timeFrame = timeFrame;
        // Agregar búsqueda por fecha si startTime y endTime no son undefined
                // Construir la parte del query para unix
                let unixQuery = {};
                if (startTime !== undefined && endTime !== undefined) {
                    // Si startTime y endTime están definidos, buscar entre ellos
                    unixQuery.$gte = parseInt(startTime);
                    unixQuery.$lte = parseInt(endTime);
                } else if (startTime !== undefined) {
                    // Si solo startTime está definido, buscar a partir de ese momento
                    unixQuery.$gte = parseInt(startTime);
                } else if (endTime !== undefined) {
                    // Si solo endTime está definido, buscar hasta ese momento
                    unixQuery.$lte = parseInt(endTime);
                }
                
                // Agregar búsqueda por fecha a la consulta
                if (Object.keys(unixQuery).length !== 0) {
                    query.unix = unixQuery;
                }

        // Inicializar options con los campos a seleccionar
        let options = { date: 1, trending3: 1};
        // Si limit está definido, añadirlo a las opciones
        if (limit !== undefined) {
            limit = parseInt(limit);
        } else {
            limit = 100; // Establecer un límite predeterminado si no se proporciona limit
        }
        // Calcular el número de documentos para saltar (offset) basado en el número de página
        if (pageNumber !== undefined && pageNumber > 0) {
            pageNumber = (pageNumber - 1) * limit;
        }
        // Realizar la consulta a la base de datos
        const [data] = await Promise.all([
            BTC_USDT_BINANCE_15m_Trending_Atr10.find(query)
                                .sort({ unix: order || 1 }) // Ordenar por fecha Unix descendente
                                .limit(limit)
                                .skip(pageNumber || 0)
                                .select(options), // Seleccionar solo los campos requeridos
        ]);
        return data;
    } catch (error) {
        throw error;
    }
};

const trendAtr14 = async (ticker, timeFrame, limit, startTime, endTime, atr7, pageNumber, order) => {
    try {
        let query = {};
        // Construir la consulta básica para el ticker y el timeFrame
        query.ticker = ticker;
        query.timeFrame = timeFrame;
        // Agregar búsqueda por fecha si startTime y endTime no son undefined
                // Construir la parte del query para unix
                let unixQuery = {};
                if (startTime !== undefined && endTime !== undefined) {
                    // Si startTime y endTime están definidos, buscar entre ellos
                    unixQuery.$gte = parseInt(startTime);
                    unixQuery.$lte = parseInt(endTime);
                } else if (startTime !== undefined) {
                    // Si solo startTime está definido, buscar a partir de ese momento
                    unixQuery.$gte = parseInt(startTime);
                } else if (endTime !== undefined) {
                    // Si solo endTime está definido, buscar hasta ese momento
                    unixQuery.$lte = parseInt(endTime);
                }
                
                // Agregar búsqueda por fecha a la consulta
                if (Object.keys(unixQuery).length !== 0) {
                    query.unix = unixQuery;
                }

        // Inicializar options con los campos a seleccionar
        let options = { date: 1, trending3: 1};
        // Si limit está definido, añadirlo a las opciones
        if (limit !== undefined) {
            limit = parseInt(limit);
        } else {
            limit = 100; // Establecer un límite predeterminado si no se proporciona limit
        }
        // Calcular el número de documentos para saltar (offset) basado en el número de página
        if (pageNumber !== undefined && pageNumber > 0) {
            pageNumber = (pageNumber - 1) * limit;
        }
        // Realizar la consulta a la base de datos
        const [data] = await Promise.all([
            BTC_USDT_BINANCE_15m_Trending_Atr14.find(query)
                                .sort({ unix: order || 1 }) // Ordenar por fecha Unix descendente
                                .limit(limit)
                                .skip(pageNumber || 0)
                                .select(options), // Seleccionar solo los campos requeridos
        ]);
        return data;
    } catch (error) {
        throw error;
    }
};

const findTicks = async (ticker, timeFrame, limit, startTime, endTime, atr7, pageNumber, order) => {
    try {
        let query = {};
        // Construir la consulta básica para el ticker y el timeFrame
        query.ticker = ticker;
        query.timeFrame = timeFrame;
        // Agregar búsqueda por fecha si startTime y endTime no son undefined
                // Construir la parte del query para unix
                let unixQuery = {};
                if (startTime !== undefined && endTime !== undefined) {
                    // Si startTime y endTime están definidos, buscar entre ellos
                    unixQuery.$gte = parseInt(startTime);
                    unixQuery.$lte = parseInt(endTime);
                } else if (startTime !== undefined) {
                    // Si solo startTime está definido, buscar a partir de ese momento
                    unixQuery.$gte = parseInt(startTime);
                } else if (endTime !== undefined) {
                    // Si solo endTime está definido, buscar hasta ese momento
                    unixQuery.$lte = parseInt(endTime);
                }
                
                // Agregar búsqueda por fecha a la consulta
                if (Object.keys(unixQuery).length !== 0) {
                    query.unix = unixQuery;
                }

        // Inicializar options con los campos a seleccionar
        let options = { date: 1, open: 1, high: 1, low: 1, close: 1, atr7: 1, atr10: 1, atr14: 1};
        // Si limit está definido, añadirlo a las opciones
        if (limit !== undefined) {
            limit = parseInt(limit);
        } else {
            limit = 100; // Establecer un límite predeterminado si no se proporciona limit
        }
        // Calcular el número de documentos para saltar (offset) basado en el número de página
        if (pageNumber !== undefined && pageNumber > 0) {
            pageNumber = (pageNumber - 1) * limit;
        }
        // Realizar la consulta a la base de datos
        const [ data ] = await Promise.all([
            BTC_USDT_BINANCE_15m.find(query)
                                .sort({ unix: order || 1 }) // Ordenar por fecha Unix descendente
                                .limit(limit)
                                .skip(pageNumber || 0)
                                .select(options), // Seleccionar solo los campos requeridos
        ]);
        return data;
    } catch (error) {
        throw error;
    }
};

const totalsTicks = async ( ticker, timeFrame, limit, startTime, endTime, atr7, pageNumber, order ) => {
    try {
        let query = {};
        // Construir la consulta básica para el ticker y el timeFrame
        query.ticker = ticker;
        query.timeFrame = timeFrame;
        // Agregar búsqueda por fecha si startTime y endTime no son undefined
                // Construir la parte del query para unix
                let unixQuery = {};
                if (startTime !== undefined && endTime !== undefined) {
                    // Si startTime y endTime están definidos, buscar entre ellos
                    unixQuery.$gte = parseInt(startTime);
                    unixQuery.$lte = parseInt(endTime);
                } else if (startTime !== undefined) {
                    // Si solo startTime está definido, buscar a partir de ese momento
                    unixQuery.$gte = parseInt(startTime);
                } else if (endTime !== undefined) {
                    // Si solo endTime está definido, buscar hasta ese momento
                    unixQuery.$lte = parseInt(endTime);
                }
                
                // Agregar búsqueda por fecha a la consulta
                if (Object.keys(unixQuery).length !== 0) {
                    query.unix = unixQuery;
                }
        // Si limit está definido, añadirlo a las opciones
        if (limit !== undefined) {
            limit = parseInt(limit);
        } else {
            limit = 100; // Establecer un límite predeterminado si no se proporciona limit
        }
        // Calcular el número de documentos para saltar (offset) basado en el número de página
        if (pageNumber !== undefined && pageNumber > 0) {
            pageNumber = (pageNumber - 1) * limit;
        }
        // Realizar la consulta a la base de datos
        const totalCount = await Promise.all([
            BTC_USDT_BINANCE_15m.countDocuments(query) // Contar la cantidad total de elementos encontrados
        ]);
        return totalCount;
    } catch (error) {
        throw error;
    }
};


const deleteTicksByUnix = async (unixValues) => {
    try {
        // Realizar la eliminación de documentos basada en los valores de unix
        const result = await BTC_USDT_BINANCE_15m.deleteMany({ unix: { $in: unixValues } });
        return result;
    } catch (error) {
        throw error;
    }
};


module.exports = { findTicks, totalsTicks, deleteTicksByUnix, trendAtr7, trendAtr10, trendAtr14 };