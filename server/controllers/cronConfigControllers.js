const { logger } = require('../config/pino');
const { cronJob } = require('../utils/cronTasks');
const CHECKSTATUS = require('../models/checkStatus');

const stopCronJob = (job, jobName) => {
    if (!job) {
        throw new Error(`Cron job '${jobName}' not found.`);
    }
    job[jobName].stop(); // Detener el cron job
    return `${jobName} status off`
};

const startCronJob = (job, jobName) => {
    if (!job) {
        throw new Error(`Cron job '${jobName}' not found.`);
    }
    job[jobName].start(); // Iniciar nuevamente el cron job
    return `${jobName} status on`
};

// Función para modificar la variable de tiempo de un cron job
const modifyCronSchedule = (job, jobName, newSchedule) => {
    if (!job) {
        throw new Error(`Cron job '${jobName}' not found.`);
    }
    job[jobName].schedule(newSchedule); // Modificar la programación del cron job
    return `${jobName} new schedule: ${newSchedule}`
};

module.exports = {stopCronJob, startCronJob, modifyCronSchedule};