const jwt = require('jsonwebtoken');
const ApiKey = require('../models/apiKey.model');

const authorization = async (req, res, next) => {
    const token = req.cookies.token;
    const apiKey = req.headers['x-api-key'];

    if (!token && !apiKey) {
      return res.status(401).json({ message: 'No token or API key received.' });
    }
    try {
      let decoded;
      if (token) {
        decoded = jwt.verify(token, process.env.SEED);
      }
      if (apiKey) {
        const apiKeyDocument = await ApiKey.findOne({ key: apiKey });
        if (!apiKeyDocument) {
          return res.status(401).json({ message: 'Invalid API key.' });
        }
      }
      if (decoded) {
        req.user = decoded;
      }
  
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token or API key.' });
    }


  };
  

  module.exports = { authorization };