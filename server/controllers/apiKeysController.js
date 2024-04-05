const ApiKey = require('../models/apiKey.model');
const { generateRandomKey } = require('../utils/apiKeyGenerator');

async function generateApiKey(req, res, next) {
  try {
    const apiKey = generateRandomKey(36);
    const newApiKey = new ApiKey({ key: apiKey });
    await newApiKey.save();
    res.status(201).json({ apiKey });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  generateApiKey,
};