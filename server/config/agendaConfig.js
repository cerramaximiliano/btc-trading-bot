const Agenda = require("agenda");
const agenda = new Agenda({ db: { address: process.env.MONGO_DB_URL, collection: process.env.AGENDA_COLLECTION } });

module.exports = {agenda};