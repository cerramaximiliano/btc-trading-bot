const {api, requeueJobs, deleteJobs, createJob} = require('../controllers/agendaApiController');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const {
          job,
          state,
          skip,
          limit,
          q,
          property,
          isObjectId,
        } = req.query;
        const apiResponse = await api(job, state, {
          query: q,
          property,
          isObjectId,
          skip,
          limit,
        });
        res.json(apiResponse);
      } catch (error) {
        console.log(error)
        res.status(400).json(error);
      }


});



module.exports = router;