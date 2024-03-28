const Agenda = require("agenda");
const agenda = new Agenda({ db: { address: process.env.MONGO_DB_URL } });

module.exports = {agenda};