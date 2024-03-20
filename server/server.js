const express = require('express');
const app = express();
const { setupDatabase } = require('./config/databaseConfig.js');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { logger } = require('./config/pino');
const { runCronTask } = require('./utils/cronTasks');
const { cronController, checkCompleteness, updateMissingData, updateAtr, updateAtr10, updateAtr14, updateWrongData, updateTrending } = require('./controllers/cronController.js')

const binanceRoutes = require('./routes/binanceRoutes');
const databaseRoutes = require('./routes/databaseRoutes');
const trendingRoutes = require('./routes/trendingRoutes');
const signalRoutes = require('./routes/signalRoutes');

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(9000, () => {
    setupDatabase();
    logger.info('listen on PORT 9000');
});

app.use('/binance', binanceRoutes); 
app.use('/database', databaseRoutes); 
app.use('/trends', trendingRoutes);
app.use('/signals', signalRoutes);

runCronTask("updateWrongData", updateWrongData, '*/2 * * * * *', 'America/Argentina/Buenos_Aires');
runCronTask("updateMissingData", updateMissingData, '*/20 * * * * *', 'America/Argentina/Buenos_Aires');
runCronTask("checkCompleteness", checkCompleteness, '*/10 * * * * *', 'America/Argentina/Buenos_Aires');
runCronTask("cronController", cronController, '*/15 * * * *', 'America/Argentina/Buenos_Aires');
runCronTask("updateAtr", updateAtr, '*/2 * * * *', 'America/Argentina/Buenos_Aires');
runCronTask("updateAtr10", updateAtr10, '*/2 * * * *', 'America/Argentina/Buenos_Aires');
runCronTask("updateTrending", updateTrending, '*/1 * * * *', 'America/Argentina/Buenos_Aires');