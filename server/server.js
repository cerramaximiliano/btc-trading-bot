const express = require('express');
const app = express();
const { setupDatabase } = require('./config/databaseConfig.js');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { logger } = require('./config/pino');
const { runCronTask, cronJob } = require('./utils/cronTasks');
const { cronController, checkCompleteness, updateMissingData, updateAtr, updateWrongData, updateTrending } = require('./controllers/cronController.js')
const BTC_USDT_BINANCE_15m_Trending_Atr7 = require('./models/btc-binance-15m-trending');
const BTC_USDT_BINANCE_15m_Trending_Atr10 = require('./models/trending/btc-binance-15m-trendingAtr10');
const BTC_USDT_BINANCE_15m_Trending_Atr14 = require('./models/trending/btc-binance-15m-trendingAtr14');

const binanceRoutes = require('./routes/binanceRoutes');
const databaseRoutes = require('./routes/databaseRoutes');
const trendingRoutes = require('./routes/trendingRoutes');
const signalRoutes = require('./routes/signalRoutes');
const cronRoutes = require('./routes/cronRoutes');

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(9000, () => {
    setupDatabase();
    logger.info('listen on PORT 9000');
});



//runCronTask("updateWrongData", updateWrongData, [], '*/2 * * * * *', 'America/Argentina/Buenos_Aires');
//runCronTask("updateMissingData", updateMissingData, [], '*/20 * * * * *', 'America/Argentina/Buenos_Aires');
//runCronTask("checkCompleteness", checkCompleteness, [], '*/10 * * * * *', 'America/Argentina/Buenos_Aires');
//runCronTask("cronController", cronController, [], '*/15 * * * *', 'America/Argentina/Buenos_Aires');
//runCronTask("updateAtr", updateAtr, [7, 'atr7', 'startArt7', 'updateUpDown', 'updateAtr'], '*/2 * * * *', 'America/Argentina/Buenos_Aires');
//runCronTask("updateAtr", updateAtr, [10, 'atr10', 'startArt10', 'updateUpDownArt10Trend3', 'updateAtr10'], '*/2 * * * *', 'America/Argentina/Buenos_Aires');
//runCronTask("updateAtr", updateAtr, [14, 'atr14', 'startAtr14', 'updateUpDownArt14Trend3', 'updateAtr14'], '*/2 * * * *', 'America/Argentina/Buenos_Aires');
//runCronTask("updateTrendingAtr7", updateTrending, ['startUpDown', 'updateUpDown', 'atr7', 3,  BTC_USDT_BINANCE_15m_Trending_Atr7], '*/5 * * * * *', 'America/Argentina/Buenos_Aires'); 
//runCronTask("updateTrendingAtr14", updateTrending, ['startUpDownArt14Trending3', 'updateUpDownArt14Trend3', 'atr14', 3,  BTC_USDT_BINANCE_15m_Trending_Atr14], '*/1 * * * * *', 'America/Argentina/Buenos_Aires'); 
//runCronTask("updateTrendingAtr10", updateTrending, ['startUpDownArt10Trending3', 'updateUpDownArt10Trend3', 'atr10', 3,  BTC_USDT_BINANCE_15m_Trending_Atr10], '*/1 * * * *', 'America/Argentina/Buenos_Aires'); 

app.use('/binance', binanceRoutes); 
app.use('/database', databaseRoutes); 
app.use('/trends', trendingRoutes);
app.use('/signals', signalRoutes);
app.use('/tasks', cronRoutes)
