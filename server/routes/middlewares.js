const jwt = require('jsonwebtoken');


const authorization = (req, res, next) => {
    const token = req.cookies.token;
    console.log(token)
    if (!token) {
      return res.status(401).json({ message: 'No token recived.' });
    }
    try {
    const decoded = jwt.verify(token, process.env.SEED);
    req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token.' });
    }
  };
  

  module.exports = { authorization };