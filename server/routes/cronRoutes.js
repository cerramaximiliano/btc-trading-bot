const express = require('express');
const router = express.Router();
const { stopCronJob, startCronJob, cancelCronJob, modifyCronSchedule } = require('../controllers/cronConfigControllers');
const { agenda } = require('../utils/cronTasks');



router.get('/all', async (req, res) => {
    const jobs = await agenda.jobs({ nextRunAt: { $exists: true } });
    let result = [];
    jobs.forEach((job) => {
        result.push({
            id: job.attrs._id,
            name: job.attrs.name,
            nextRun: job.attrs.nextRunAt,
            disabled: job.attrs.disabled || false,
            schedule: job.attrs.repeatInterval
        })
    });
    res.json({
        count: result.length,
        result
    });
});

router.get('/stop', async (req, res) => {
    const jobName = req.query.jobName;
    try {
        const result = await stopCronJob(jobName);
        res.status(200).json({status: result})
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/start', async (req, res) => {
    const jobName = req.query.jobName;
    try {
        const result = await startCronJob(jobName);
        res.status(200).json({status: result})
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/cancel', async (req, res) => {
    const {name} = req.body;
    try {
        const result = await cancelCronJob(name);
        res.status(200).json({status: result})
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/modify', async (req, res) => {
    const jobName = req.query.jobName;
    const {newSchedule} = req.body;
    try {
        const result = await modifyCronSchedule(jobName, newSchedule);
        res.status(200).json({status: result})
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
