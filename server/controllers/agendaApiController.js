"use strict";
const semver = require("semver");
const { ObjectId } = require("mongodb"); // We rely on the Agenda's "mongodb", thus our package.json lists "*" as required version
const { agenda } = require("../config/agendaConfig");



  let options = {};

  agenda.on("ready", () => {
    const collection = agenda._collection.collection || agenda._collection;
    collection.createIndexes(
      [
        { key: { nextRunAt: -1, lastRunAt: -1, lastFinishedAt: -1 } },
        { key: { name: 1, nextRunAt: -1, lastRunAt: -1, lastFinishedAt: -1 } },
      ],
      (error) => {
        if (error) {
          // Ignoring for now
        }
      }
    );
    const mdb = agenda._mdb.admin ? agenda._mdb : agenda._mdb.db;
    mdb.admin().serverInfo((error, serverInfo) => {
      if (error) {
        throw error;
      }
      if (!semver.satisfies(semver.coerce(serverInfo.version), ">=3.6.0")) {
        throw new Error("MongoDB version not supported");
      }
    });
  });

  // Options = {query = '', property = '', isObjectId = false, limit, skip}
  const getJobs = function (job, state, options) {
    const preMatch = {};
    if (job) {
        preMatch.name = job; // Mantenemos 'name' para la búsqueda
    }

    if (options.query && options.property) {
        if (options.isObjectId) {
            preMatch[options.property] = new ObjectId(options.query);
        } else if (/^\d+$/.test(options.query)) {
            preMatch[options.property] = Number.parseInt(options.query, 10);
        } else {
            preMatch[options.property] = { $regex: options.query, $options: "i" };
        }
    }

    const postMatch = {};
    if (state) {
        postMatch[state] = true;
    }

    const collection = agenda._collection.collection || agenda._collection;
    return collection
        .aggregate([
            { $match: preMatch },
            {
                $sort: {
                    repeatInterval: -1,
                    nextRunAt: -1,
                    lastRunAt: -1,
                    lastFinishedAt: -1,
                },
            },
            {
                $project: {
                    title: "$name", // Cambiamos el nombre del campo 'name' a 'title'
                    id: "$_id",
                    repeatInterval: 1, // Incluimos la propiedad 'repeatInterval'
                    nextRunAt: 1, // Incluimos la propiedad 'nextRunAt'
                    lastRunAt: 1, // Incluimos la propiedad 'lastRunAt'
                    lastFinishedAt: 1, // Incluimos la propiedad 'lastFinishedAt'
                    running: {
                        $and: ["$lastRunAt", { $gt: ["$lastRunAt", "$lastFinishedAt"] }],
                    },
                    scheduled: {
                        $and: ["$nextRunAt", { $gte: ["$nextRunAt", new Date()] }],
                    },
                    queued: {
                        $and: [
                            "$nextRunAt",
                            { $gte: [new Date(), "$nextRunAt"] },
                            { $gte: ["$nextRunAt", "$lastFinishedAt"] },
                        ],
                    },
                    completed: {
                        $and: [
                            "$lastFinishedAt",
                            { $gt: ["$lastFinishedAt", "$failedAt"] },
                        ],
                    },
                    failed: {
                        $and: [
                            "$lastFinishedAt",
                            "$failedAt",
                            { $eq: ["$lastFinishedAt", "$failedAt"] },
                        ],
                    },
                    repeating: {
                        $and: ["$repeatInterval", { $ne: ["$repeatInterval", null] }],
                    },
                },
            },
            { $match: postMatch },
            { 
                $project: { 
                    id: "$_id",
                    title: 1,
                    repeatInterval: 1,
                    nextRunAt: 1,
                    lastRunAt: 1,
                    lastFinishedAt: 1,
                    running: 1,
                    scheduled: 1,
                    queued: 1,
                    completed: 1,
                    failed: 1,
                    repeating: 1
                } 
            },
            {
                $facet: {
                    pages: [
                        { $count: "totalMatchs" },
                        {
                            $project: {
                                totalPages: {
                                    $ceil: { $divide: ["$totalMatchs", options.limit] },
                                },
                            },
                        },
                    ],
                    filtered: [{ $skip: options.skip }, { $limit: options.limit }],
                },
            },
        ])
        .toArray();
        
};





  const getOverview = async () => {
    const collection = agenda._collection.collection || agenda._collection;
    const results = await collection
      .aggregate([
        {
          $group: {
            _id: "$name",
            displayName: { $first: "$name" },
            meta: {
              $addToSet: {
                type: "$type",
                priority: "$priority",
                repeatInterval: "$repeatInterval",
                repeatTimezone: "$repeatTimezone",
              },
            },
            total: { $sum: 1 },
            running: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      "$lastRunAt",
                      { $gt: ["$lastRunAt", "$lastFinishedAt"] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            scheduled: {
              $sum: {
                $cond: [
                  {
                    $and: ["$nextRunAt", { $gte: ["$nextRunAt", new Date()] }],
                  },
                  1,
                  0,
                ],
              },
            },
            queued: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      "$nextRunAt",
                      { $gte: [new Date(), "$nextRunAt"] },
                      { $gte: ["$nextRunAt", "$lastFinishedAt"] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            completed: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      "$lastFinishedAt",
                      { $gt: ["$lastFinishedAt", "$failedAt"] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            failed: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      "$lastFinishedAt",
                      "$failedAt",
                      { $eq: ["$lastFinishedAt", "$failedAt"] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            repeating: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      "$repeatInterval",
                      { $ne: ["$repeatInterval", null] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ])
      .toArray();
    const states = {
      total: 0,
      running: 0,
      scheduled: 0,
      queued: 0,
      completed: 0,
      failed: 0,
      repeating: 0,
    };
    const totals = { title: "BTC Agenda Cron Tasks", type: "section", ...states };
    for (const job of results) {
      for (const state of Object.keys(states)) {
        totals[state] += job[state];
      }
    }
    results.unshift(totals);
    const randomId = new ObjectId();
      results[0].id = randomId;
    return [results[0]];
};


  const api = async function (
    job,
    state,
    { query: q, property, isObjectId, skip, limit }
  ) {
    if (!agenda) {
      return Promise.reject(new Error("Agenda instance is not ready"));
    }

    limit = Number.parseInt(limit, 10) || 200;
    skip = Number.parseInt(skip, 10) || 0;

    const [overview, jobs] = await Promise.all([
      getOverview(),
      getJobs(job, state, { query: q, property, isObjectId, skip, limit }),
    ]);
    const apiResponse = {
      ...{overview},
      jobs: jobs[0].filtered
    };
    const overviewArray = apiResponse.overview;
    const jobsArray = apiResponse.jobs;

    const overviewOnly = overviewArray.map(item => {
      const { title, type, total, running, scheduled, queued, completed, failed, repeating } = item;
      return { title, id: new ObjectId(), type, total, running, scheduled, queued, completed, failed, repeating, order: 0 };
  });
  
  const jobsOnly = jobsArray.map((item, index) => {
    const { nextRunAt, repeatInterval, title, _id, running, scheduled, queued, completed, failed, repeating } = item;
    return { nextRunAt, repeatInterval, title, id: _id, running, scheduled, queued, completed, failed, repeating, type: "task", order:index+1 };
});

  
  const filteredApiResponse = overviewOnly.concat(jobsOnly);
  return filteredApiResponse
  };

  const findJobById = async (jobId) => {
    console.log(jobId)
    if (!agenda) {
      return Promise.reject(new Error("Agenda instance is not ready"));
    }
    const collection = agenda._collection.collection || agenda._collection;
    try {
      const job = await collection.findOne({_id: ObjectId(jobId)})
      if (job.length === 0) {
        throw new Error("Job not found");
      }
      return job;
    }catch(err){
      throw new Error(err)
    }
  }

  const requeueJobs = async (jobIds) => {
    if (!agenda) {
      return Promise.reject(new Error("Agenda instance is not ready"));
    }

    const collection = agenda._collection.collection || agenda._collection;
    const jobs = await collection
      .find({
        _id: { $in: jobIds.map((jobId) => new ObjectId(jobId)) },
      })
      .toArray();
    if (jobs.length === 0) {
      throw new Error("Job not found");
    }

    for (const job of jobs) {
      const newJob = agenda.create(job.name, job.data);
      // eslint-disable-next-line no-await-in-loop
      await newJob.save();
    }

    return "Jobs create successfully";
  };

  const deleteJobs = (jobIds) => {
    if (!agenda) {
      return Promise.reject(new Error("Agenda instance is not ready"));
    }

    return agenda.cancel({
      _id: { $in: jobIds.map((jobId) => new ObjectId(jobId)) },
    });
  };

  const createJob = (jobName, jobSchedule, jobRepeatEvery, jobData) => {
    if (!agenda) {
      return Promise.reject(new Error("Agenda instance is not ready"));
    }

    // @TODO: Need to validate user input.
    const job = agenda.create(jobName, jobData);
    if (jobSchedule && jobRepeatEvery) {
      job.repeatAt(jobSchedule);
      job.repeatEvery(jobRepeatEvery);
    } else if (jobSchedule) {
      job.schedule(jobSchedule);
    } else if (jobRepeatEvery) {
      job.repeatEvery(jobRepeatEvery);
    } else {
      return Promise.reject(new Error("Jobs not created"));
    }

    return job.save();
  };


module.exports = {api, requeueJobs, deleteJobs, createJob, findJobById};