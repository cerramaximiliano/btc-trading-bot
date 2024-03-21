const cron = require('node-cron');
const { logger } = require('../config/pino');

const runCronTask = async (taskName, taskFunction, args, schedule, timezone) => {
    cron.schedule(schedule, async () => {
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
};

module.exports = { runCronTask };
