const { logger } = require('../config/pino');
const { cronJob, agenda } = require('../utils/cronTasks');
const CHECKSTATUS = require('../models/checkStatus');

const stopCronJob = async (jobName) => {
    try {
        const stop = await agenda.disable({name: jobName});
        return stop
    }catch(err){
        throw new Error(err)
    }
};

const startCronJob = async (jobName) => {
    try {
        const start = await agenda.enable({name: jobName});
        return start
    }catch(err){
        throw new Error(err)
    }
};

const cancelCronJob = async (name) => {
    try{
        const cancel = await agenda.cancel({name: name})
        return cancel
    }catch(err){
        throw new Error(err)
    }
}

const modifyCronSchedule = async (jobName, newSchedule) => {
    try {
        const modify = await agenda.define(jobName);
        await agenda.every(schedule, taskName);
        await agenda.start();
        return modify;
    }catch(err){
        throw new Error
    }
};

module.exports = {stopCronJob, startCronJob, modifyCronSchedule, cancelCronJob};