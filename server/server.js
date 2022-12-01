const express = require('express');
const app = express();
const https = require('https');
const retrieveSecrets = require('./config/env.js');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const pino = require('pino');
const cors = require('cors');
const {logger} = require('./config/pino');
const cron = require('node-cron');
const mongoose = require('mongoose');
const BTC_USDT_BINANCE_1h = require('./models/btc-binance-1h.js');
const path = require('path');
const cryptoControllers = require('./controllers/cryptoControllers');
const crytoUtils = require('./utils/cryptoUtils');
const ATR = require('technicalindicators').ATR
const Binance = require('node-binance-api');
const { time } = require('console');
const binance = new Binance().options({
  APIKEY: 'kVjOuliddPpQst74Kw2EZPfjyJSSiAp9vATsrng1rLhBz6t99Iz0UFA0VYB9CrGE',
  APISECRET: 'ysORFkS6jtk6EXeb7ArycxEWVzMfluvqvFzNeHg4Pm5MHnyaL4GXxtMRR6HrLhJ5'
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(9000, () => {
    mongoose.connect( 'mongodb+srv://maxcerra:988703ab@cluster0.ueaes.azure.mongodb.net/cimenti?retryWrites=true&w=majority' , {useNewUrlParser: true, useUnifiedTopology: true}, (err, res) => {
    if(err) throw err;
    logger.info('database Online');
});
    logger.info('listen on PORT 9000');
});
app.use(express.static('public'));
const timeout = millis => new Promise(resolve => setTimeout(resolve, millis));

    cron.schedule(`1 */1 * * *`, () => {
            logger.info(`cron 1h 1m starting....`)
            cryptoControllers.binance1hUpdate();
    }, {
        scheduled: true,
        timezone: "America/Argentina/Buenos_Aires"
    });
    

    cron.schedule(`*/10 * * * *`, () => {
        logger.info(`cron 10m starting....`)
        cryptoControllers.binance1hUpdate();
    }, {
        scheduled: true,
        timezone: "America/Argentina/Buenos_Aires"
    });


    cryptoControllers.binance1hUpdate();

    // cron.schedule(`*/10 * * * * *`, () => {
    //     logger.info(`cron 10s update atr starting....`)
    //     cryptoControllers.updateAtr();
    // }, {
    // scheduled: true,
    // timezone: "America/Argentina/Buenos_Aires"
    // });

    // cron.schedule(`*/15 * * * * *`, () => {
    //     logger.info(`cron 15s update up/down starting....`)
    //     cryptoControllers.iterateAll1hRecordsTrendUpDown()
    // }, {
    // scheduled: true,
    // timezone: "America/Argentina/Buenos_Aires"
    // });

    // cron.schedule(`*/15 * * * * *`, () => {
    //     logger.info(`cron 15s update signal starting....`)
    //     cryptoControllers.iterateAll1hRecordsAndUpdateSignal();
    // }, {
    // scheduled: true,
    // timezone: "America/Argentina/Buenos_Aires"
    // });


    cron.schedule(`*/20 * * * * *`, () => {
        logger.info(`cron 20s update signal timestamp starting....`)
        cryptoControllers.iterateAllRecordAndUpdateSignalTimeStamp();
    }, {
    scheduled: true,
    timezone: "America/Argentina/Buenos_Aires"
    });
