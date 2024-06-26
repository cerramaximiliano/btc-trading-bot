const express = require('express');
const app = express();
const { setupDatabase } = require('./config/databaseConfig.js');
const path = require('path')
app.use(express.static(path.resolve(__dirname, '../dist')));

const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const cors = require('cors');
const allowedOrigins = ['http://localhost:3001','https://adminboards.app', 'https://www.adminboards.app'];
app.use(cors());

const { logger } = require('./config/pino');
const { runCronTask } = require('./utils/cronTasks');

const cronConfig = require('./config/cronConfig.js');
const routes = require('./routes/indexRoutes');

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(process.env.PORT || 3000, '0.0.0.0', async () => {
    setupDatabase();
    logger.info(`listen on PORT ${process.env.PORT || 3000}`);
});

if( process.env.ENVIROMENT === 'PRODUCTION'){
    runCronTask(cronConfig.updateWrongData);
    runCronTask(cronConfig.updateMissingData);
    runCronTask(cronConfig.checkCompleteness);
    runCronTask(cronConfig.cronController);
    runCronTask(cronConfig.updateAtr7);
    runCronTask(cronConfig.updateAtr10);
    runCronTask(cronConfig.updateAtr14);
    runCronTask(cronConfig.updateTrendingAtr7); 
    runCronTask(cronConfig.updateTrendingAtr14); 
    runCronTask(cronConfig.updateTrendingAtr10);
    runCronTask(cronConfig.deleteFileLogger);
    runCronTask(cronConfig.deleteFileLoggerError);
}

app.use(routes);