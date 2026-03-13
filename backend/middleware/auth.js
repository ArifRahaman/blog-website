const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const logger = require('../utils/logger'); // Assuming a logger utility is available

const STATUS_UNAUTHORIZED = 401;
const BEARER_PREFIX = 'Bearer ';
const ERROR_NO_TOKEN = 'No token';
const ERROR_USER_NOT_FOUND = 'User not found';
const ERROR_INVALID_TOKEN = 'Invalid token';

const authMiddleware = async (req, res, next) => {
  const authorizationHeader = req.header('Authorization');
  const token = authorizationHeader?.replace(BEARER_PREFIX, '');

  if (!token) {
    logger.warn('No token provided');
    return res.status(STATUS_UNAUTHORIZED).json({ error: ERROR_NO_TOKEN });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.id);

    if (!user) {
      logger.warn('User not found for token');
      return res.status(STATUS_UNAUTHORIZED).json({ error: ERROR_USER_NOT_FOUND });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      logger.error('Token verification failed', error);
      return res.status(STATUS_UNAUTHORIZED).json({ error: ERROR_INVALID_TOKEN });
    }
    logger.error('Unexpected error during token verification', error);
    res.status(STATUS_UNAUTHORIZED).json({ error: ERROR_INVALID_TOKEN });
  }
};

module.exports = { authMiddleware };