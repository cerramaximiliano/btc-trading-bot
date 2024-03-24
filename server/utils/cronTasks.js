const cron = require('node-cron');
const { logger } = require('../config/pino');

let cronJob = {};

const runCronTask = async (taskName, taskFunction, args, schedule, timezone) => {
    let job = cron.schedule(schedule, async () => {
        try {
            await taskFunction(...args);
        } catch (error) {
            console.log(error)
            logger.error(`[${taskName}] Error:`, error);
        }
    }, {
        scheduled: true,
        timezone
    });
    cronJob[taskName] = job
};

module.exports = { runCronTask, cronJob };
