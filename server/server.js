const express = require('express');
const app = express();
const { setupDatabase } = require('./config/databaseConfig.js');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const cors = require('cors');
const { logger } = require('./config/pino');
//const { cronController, updateTicks, checkCompleteness, updateAtr } = require('./controllers/cronController.js')

const { cronController, checkCompleteness, updateMissingData, updateAtr, updateWrongData } = require('./controllers/cronController.js')

const binanceRoutes = require('./routes/binanceRoutes');
const databaseRoutes = require('./routes/databaseRoutes');

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

cronController();
checkCompleteness();
updateMissingData();
updateAtr();
updateWrongData();
