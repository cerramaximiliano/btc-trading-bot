const express = require('express');
const app = express();
const { setupDatabase } = require('./config/databaseConfig.js');

const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { logger } = require('./config/pino');
const { runCronTask, agendash } = require('./utils/cronTasks');
const emmiter = require('./config/eventEmmiterConfig.js');


const binanceRoutes = require('./routes/binanceRoutes');
const databaseRoutes = require('./routes/databaseRoutes');
const trendingRoutes = require('./routes/trendingRoutes');
const signalRoutes = require('./routes/signalRoutes');
const cronRoutes = require('./routes/cronRoutes');
const cronConfig = require('./config/cronConfig.js');

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(3000, async () => {
    setupDatabase();
    logger.info('listen on PORT 9000');
});
/* 
runCronTask(cronConfig.updateWrongData);
runCronTask(cronConfig.updateMissingData);
runCronTask(cronConfig.checkCompleteness);
runCronTask(cronConfig.cronController);
runCronTask(cronConfig.updateAtr7);
runCronTask(cronConfig.updateAtr10);
runCronTask(cronConfig.updateAtr14);
runCronTask(cronConfig.updateTrendingAtr7); 
runCronTask(cronConfig.updateTrendingAtr14); 
runCronTask(cronConfig.updateTrendingAtr10);  */
runCronTask(cronConfig.deleteFileLogger);
runCronTask(cronConfig.deleteFileLoggerError);

app.use('/binance', binanceRoutes); 
app.use('/database', databaseRoutes); 
app.use('/trends', trendingRoutes);
app.use('/signals', signalRoutes);
app.use('/tasks', cronRoutes);
app.use('/dash', agendash);