const mongoose = require('mongoose');
const { logger } = require('./pino');

const setupDatabase = () => {
    mongoose.connect(process.env.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
        if (err) {
            logger.error('Failed to connect to database:', err);
        } else {
            logger.info('Database connected successfully');
        }
    });
};

module.exports = { setupDatabase };