const { agenda } = require("../config/agendaConfig");
const Agendash = require('agendash');
const agendash = Agendash(agenda);
const runCronTask = async (objectArg) => {
    const {taskName, handler, args, schedule, timezone} = objectArg;
    agenda.define(taskName, async (job) => {
            console.log(taskName, 'start', new Date(), handler)
            handler(...args);
      });
      await agenda.start();
      await agenda.every(schedule, taskName);

      async function graceful() {
        await agenda.cancel({repeatInterval: { $exists: true, $ne: null }})
        await agenda.stop();
        process.exit(0);
      };
        process.on("SIGTERM", graceful);
        process.on("SIGINT", graceful);
};

module.exports = { runCronTask, agenda, agendash };