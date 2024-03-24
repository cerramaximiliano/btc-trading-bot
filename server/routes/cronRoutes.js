const express = require('express');
const router = express.Router();
const { stopCronJob, startCronJob, modifyCronSchedule } = require('../controllers/cronConfigControllers');
const { cronJob } = require('../utils/cronTasks');

router.get('/stop', async (req, res) => {
    const jobName = req.query.jobName;
    try {
        const result = await stopCronJob(cronJob, jobName);
        res.status(200).json({status: result})
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/start', async (req, res) => {
    const jobName = req.query.jobName;
    try {
        const result = await startCronJob(cronJob, jobName);
        res.status(200).json({status: result})
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/modify', async (req, res) => {
    const jobName = req.query.jobName;
    const {newSchedule} = req.body;
    console.log(newSchedule)
    try {
        const result = await modifyCronSchedule(cronJob, jobName, newSchedule);
        res.status(200).json({status: result})
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
