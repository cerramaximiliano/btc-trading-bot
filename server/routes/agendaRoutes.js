const {api, findJobById, requeueJobs, deleteJobs, createJob} = require('../controllers/agendaApiController');
const express = require('express');
const router = express.Router();
const moment = require('moment');

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

router.get('/:id', async (req, res) => {
  const {id} = req.params;
  try {
    const find = await findJobById(id);
    if (find) {
      find.title = find.name;
      find.notes = `Next run at: ${moment(find.nextRunAt).format('DD-MM-YYTHH:mm')}\n\nLast run at: ${moment(find.lastRunAt).format('DD-MM-YYTHH:mm')}`
      res.json(find)
    }else{
       res.json('Job not found')
      }
  }catch(err){
    console.log(err)
    res.json(err)
  }
})

module.exports = router;