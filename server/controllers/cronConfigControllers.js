const { logger } = require('../config/pino');
const { cronJob, agenda } = require('../utils/cronTasks');
const CHECKSTATUS = require('../models/checkStatus');
const cronConfig = require('../config/cronConfig');

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


// stop y definir nuevamente repeatInterval
const modifyCronSchedule = async (jobName, newSchedule) => {

    try {
        const jobs = await agenda.jobs({ nextRunAt: { $exists: true } });
        const found = jobs.find(element => element.attrs.name === jobName);
        if (found){
            const cancel = await agenda.cancel({name: jobName})
            agenda.define(jobName, async (job) => {
                console.log(jobName, 'start', new Date())
                //handler(...args);
          });
          await agenda.start();
          await agenda.every(newSchedule, jobName);
    
          async function graceful() {
            await agenda.cancel({repeatInterval: { $exists: true, $ne: null }})
            await agenda.stop();
            process.exit(0);
          };
            process.on("SIGTERM", graceful);
            process.on("SIGINT", graceful);
    
        }else{
            console.log('no se encontro el job, retornar error')
        }

        return true

    }catch(err){
        console.log(err)
        throw new Error
    }
};

module.exports = {stopCronJob, startCronJob, modifyCronSchedule, cancelCronJob};