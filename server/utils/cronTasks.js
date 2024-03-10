const cron = require('node-cron');
const { logger } = require('../config/pino');

const runCronTask = async (taskName, taskFunction, schedule, timezone) => {
    cron.schedule(schedule, async () => {
        try {
            await taskFunction();
        } catch (error) {
            logger.error(`[${taskName}] Error:`, error);
        }
    }, {
        scheduled: true,
        timezone
    });
};

module.exports = { runCronTask };
