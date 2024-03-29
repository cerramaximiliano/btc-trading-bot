const { updateWrongData, updateMissingData, checkCompleteness, cronController, updateAtr, updateTrending } = require("../controllers/cronController");
const deleteFile = require('../controllers/fsController');
const BTC_USDT_BINANCE_15m_Trending_Atr7 = require('../models/btc-binance-15m-trending')
const BTC_USDT_BINANCE_15m_Trending_Atr10 = require('../models/trending/btc-binance-15m-trendingAtr10');
const BTC_USDT_BINANCE_15m_Trending_Atr14 = require('../models/trending/btc-binance-15m-trendingAtr14');
const BTC_USDT_BINANCE_15m_Signal_Atr7 = require('../models/signal/btc-binance-15m-signal-atr7');
const BTC_USDT_BINANCE_15m_Signal_Atr10 = require('../models/signal/btc-binance-15m-signal-atr10');
const BTC_USDT_BINANCE_15m_Signal_Atr14 = require('../models/signal/btc-binance-15m-signal-atr14');

const cronConfig = {
    deleteFileLogger: {
        taskName: 'deleteFile',
        handler: deleteFile,
        args: ['logger.log'],
        schedule: '59 23 * * 1',
        timeZone: 'America/Argentina/Buenos_Aires',
    },
    deleteFileLoggerError: {
        taskName: 'deleteFileError',
        handler: deleteFile,
        args: ['logger-error.log'],
        schedule: '58 23 * * 1',
        timeZone: 'America/Argentina/Buenos_Aires',
    },
    updateWrongData: {
        taskName: 'updateWrongData',
        handler: updateWrongData,
        args: [],
        schedule: '*/2 * * * *',
        timeZone: 'America/Argentina/Buenos_Aires',
        route: '/update-wrong-data'
    },
    updateMissingData: {
        taskName: 'updateMissingData',
        handler: updateMissingData,
        args: [],
        schedule: '*/20 * * * * *',
        timeZone: 'America/Argentina/Buenos_Aires',
        route: '/update-missing-data'
    },
    checkCompleteness: {
        taskName: 'checkCompleteness',
        handler: checkCompleteness,
        args: [],
        schedule: '*/10 * * * *',
        timeZone: 'America/Argentina/Buenos_Aires',
        route: '/check-completeness'
    },
    cronController: {
        taskName: 'cronController',
        handler: cronController,
        args: [],
        schedule: '*/15 * * * *',
        timeZone: 'America/Argentina/Buenos_Aires',
        route: '/cron-controller'
    },
    updateAtr7: {
        taskName: 'updateAtr7',
        handler: updateAtr,
        args: [7, 'atr7', 'startArt7', 'updateUpDown', 'updateAtr'],
        schedule: '*/2 * * * *',
        timeZone: 'America/Argentina/Buenos_Aires',
        route: '/update-atr7'
    },
    updateAtr10: {
        taskName: 'updateAtr10',
        handler: updateAtr,
        args: [10, 'atr10', 'startArt10', 'updateUpDownArt10Trend3', 'updateAtr10'],
        schedule: '*/2 * * * *',
        timeZone: 'America/Argentina/Buenos_Aires',
        route: '/update-atr10'
    },
    updateAtr14: {
        taskName: 'updateAtr14',
        handler: updateAtr,
        args: [14, 'atr14', 'startAtr14', 'updateUpDownArt14Trend3', 'updateAtr14'],
        schedule: '*/2 * * * *',
        timeZone: 'America/Argentina/Buenos_Aires',
        route: '/update-atr14'
    },
    updateTrendingAtr7: {
        taskName: 'updateTrendingAtr7',
        handler: updateTrending,
        args: ['startUpDown', 'updateUpDown', 'atr7', 3, BTC_USDT_BINANCE_15m_Trending_Atr7, BTC_USDT_BINANCE_15m_Signal_Atr7],
        schedule: '*/1 * * * *',
        timeZone: 'America/Argentina/Buenos_Aires',
        route: '/update-trending-atr7'
    },
    updateTrendingAtr14: {
        taskName: 'updateTrendingAtr14',
        handler: updateTrending,
        args: ['startUpDownArt14Trending3', 'updateUpDownArt14Trend3', 'atr14', 3, BTC_USDT_BINANCE_15m_Trending_Atr14, BTC_USDT_BINANCE_15m_Signal_Atr14],
        schedule: '*/1 * * * *',
        timeZone: 'America/Argentina/Buenos_Aires',
        route: '/update-trending-atr14'
    },
    updateTrendingAtr10: {
        taskName: 'updateTrendingAtr10',
        handler: updateTrending,
        args: ['startUpDownArt10Trending3', 'updateUpDownArt10Trend3', 'atr10', 3, BTC_USDT_BINANCE_15m_Trending_Atr10, BTC_USDT_BINANCE_15m_Signal_Atr10],
        schedule: '*/1 * * * *',
        timeZone: 'America/Argentina/Buenos_Aires',
        route: '/update-trending-atr10'
    }
};

module.exports = cronConfig;
