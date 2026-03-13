const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const logger = require('../utils/logger'); // Assuming a logger utility is available

const authMiddleware = async (req, res, next) => {
  const authorizationHeader = req.header('Authorization');
  const token = authorizationHeader?.replace('Bearer ', '');

  if (!token) {
    logger.warn('No token provided');
    return res.status(401).json({ error: 'No token' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.id);

    if (!user) {
      logger.warn('User not found for token');
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    logger.error('Token verification failed', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { authMiddleware };
