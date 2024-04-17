const express = require('express');
const router = express.Router();

const binanceRoutes = require('./binanceRoutes');
const databaseRoutes = require('./databaseRoutes');
const trendingRoutes = require('./trendingRoutes');
const signalRoutes = require('./signalRoutes');
const cronRoutes = require('./cronRoutes');
const userRoutes = require('./userRoutes');
const apiKeys = require('./apiKeysRoutes');
const agendaRoutes = require('./agendaRoutes');
const filesRoutes = require('./filesRoutes');
const { authorization } = require('./middlewares');
const { agendash } = require('../utils/cronTasks');


router.use('/binance', binanceRoutes); 
router.use('/database', databaseRoutes); 
router.use('/trends', trendingRoutes);
router.use('/signals', signalRoutes);
router.use('/cron', cronRoutes);
router.use('/tasks', authorization, agendaRoutes);
router.use('/dash', authorization, agendash);
router.use('/users', userRoutes);
router.use('/api', apiKeys);
router.use('/files', filesRoutes);

module.exports = router;
