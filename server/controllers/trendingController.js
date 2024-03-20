const Trending = require('../models/btc-binance-15m-trending');

const findTrends = async (start, end, trend, page, order) => {
    try {
        let query = {};

        // Construir la parte del query para unix
        let unixQuery = {};
        if (start !== undefined && end !== undefined) {
            unixQuery.$gte = parseInt(start);
            unixQuery.$lte = parseInt(end);
        } else if (start !== undefined) {
            unixQuery.$gte = parseInt(start);
        } else if (end !== undefined) {
            unixQuery.$lte = parseInt(end);
        }

        // Agregar búsqueda por fecha a la consulta
        if (Object.keys(unixQuery).length !== 0) {
            query.unix = unixQuery;
        }

        // Construir la parte del query para el trending específico
        if (trend !== undefined) {
            query[`trending3.${trend}`] = { $exists: true };
        }

        // Realizar la consulta a la base de datos
        const [trends, totalCount] = await Promise.all([
            Trending.find(query)
                .sort({ unix: order || 1 }) // Ordenar por fecha Unix ascendente por defecto
                .limit(100) // Límite predeterminado
                .skip((page - 1) * 100) // Calcular el offset
                .select('unix trending3'), // Seleccionar solo los campos requeridos
            Trending.countDocuments(query) // Contar la cantidad total de elementos encontrados
        ]);

        return { totalCount, trends };
    } catch (error) {
        throw error;
    }
};

module.exports = { findTrends };
