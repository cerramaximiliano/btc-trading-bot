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
const path = require('path');
const moment = require('moment');

const BTC_USDT_BINANCE_15m = require('./models/btc-binance-15m.js');
// const cryptoControllers = require('./controllers/cryptoControllers');
// const crytoUtils = require('./utils/cryptoUtils');
const ATR = require('technicalindicators').ATR

const { time, log } = require('console');
const AWS = require('aws-sdk');

const Binance = require('node-binance-api');
const binance = new Binance().options({
  APIKEY: 'kVjOuliddPpQst74Kw2EZPfjyJSSiAp9vATsrng1rLhBz6t99Iz0UFA0VYB9CrGE',
  APISECRET: 'ysORFkS6jtk6EXeb7ArycxEWVzMfluvqvFzNeHg4Pm5MHnyaL4GXxtMRR6HrLhJ5', 
  'family': 4
});
const cronController = require('./controllers/cronController');

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'html');
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.listen(9000, () => {
    mongoose.connect( 'mongodb+srv://cerramaximiliano:988703ab@cluster0.5zirhy3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0' , {useNewUrlParser: true, useUnifiedTopology: true}, (err, res) => {
    if(err) throw err;
    logger.info('database Online');
});
    logger.info('listen on PORT 9000');
});
app.use(express.static('public'));
const timeout = millis => new Promise(resolve => setTimeout(resolve, millis));


//     cron.schedule(`1 */1 * * *`, () => {
//             logger.info(`cron 1h 1m starting....`)
//             cryptoControllers.binance1hUpdate();
//     }, {
//         scheduled: true,
//         timezone: "America/Argentina/Buenos_Aires"
//     });
    

//     cron.schedule(`*/10 * * * *`, () => {
//         logger.info(`cron 10m starting....`)
//         cryptoControllers.binance1hUpdate();
//     }, {
//         scheduled: true,
//         timezone: "America/Argentina/Buenos_Aires"
//     });





    // cron.schedule('*/15 * * * *', async () => {
    //     logger.info(`cron 15m update signal timestamp starting....`)

    //     await timeout(50000)

    //     binance.candlesticks("BTCUSDT", "15m", (error, ticks, symbol) => {
    //         if ( error ){
    //             logger.error('error')
    //         }else{                
    //             const date = new Date();
    //             date.setSeconds(0);
    //             date.setMilliseconds(0);
    //             const timeFrame = date.getTime();
    //             const isoDate = moment(timeFrame).toISOString();
    //             const [time, open, high, low, close] = ticks[ticks.length-1]
    //             const binanceTime = time;
    //             const binanceTimeISO = moment(time).toISOString();
                
                    
    //             const newRecord = new BTC_USDT_BINANCE_15m({
    //                 unix: binanceTime,
    //                 date: binanceTimeISO,
    //                 symbol: 'BTC-USDT',
    //                 open: open,
    //                 high: high,
    //                 low: low,
    //                 close: close 
    //             });

    //             const save =  newRecord.save()
    //                         .then(res => console.log(res))
    //                         .catch(err => console.log(err))
    //         }
    //       }, {limit: 10});

    // }, {
    // scheduled: true,
    // timezone: "America/Argentina/Buenos_Aires"
    // });




    // binance.candlesticks("BTCUSDT", "15m", (error, ticks, symbol) => {
    //     if ( error ){
    //         console.error('Error')
    //     }else{
    //         const date = new Date();
    //         date.setSeconds(0);
    //         date.setMilliseconds(0);
    //         const timeFrame = date.getTime();
    //         const isoDate = moment(timeFrame).toISOString();
    //         const [time, open, high, low, close] = ticks[ticks.length-1]
    //         const binanceTime = time;
    //         const binanceTimeISO = moment(time).toISOString();
            
    //         //console.log(timeFrame, binanceTime)
    //         //console.log(isoDate, binanceTimeISO)
    //         console.log(ticks[ticks.length-1])
    //         const newRecord = new BTC_USDT_BINANCE_15m({
    //             unix: binanceTime,
    //             date: binanceTimeISO,
    //             symbol: 'BTC-USDT',
    //             open: open,
    //             high: high,
    //             low: low,
    //             close: close 
    //         });
    //         console.log(newRecord)
    //     }
    //   }, {limit: 10});



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
