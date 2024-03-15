const pino = require('pino');
const path = require('path');

const logger = pino({
    transport: {
    targets :[
        {
        target: 'pino-pretty',
        options: {
        colorize: true,
        translateTime: 'dd-mm-yyyy, HH:MM:ss',
        }},
        {
            target: 'pino-pretty',
            options: {
            colorize: false,
            translateTime: 'dd-mm-yyyy, HH:MM:ss',
            destination: `./logger.log`
            }},
    ]
},
},
);

const loggerError = pino({
    transport: {
    targets :[
        {
        target: 'pino-pretty',
        options: {
        colorize: true,
        translateTime: 'dd-mm-yyyy, HH:MM:ss',
        }},
        {
            target: 'pino-pretty',
            options: {
            colorize: false,
            translateTime: 'dd-mm-yyyy, HH:MM:ss',
            destination: `./logger-error.log`
            }},
    ]
},
},
);

module.exports = {logger, loggerError};