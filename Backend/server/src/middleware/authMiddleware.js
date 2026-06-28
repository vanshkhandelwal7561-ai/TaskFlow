const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');
const { createError } = require('../utils/ApiError');

const protect = async (req, res, next) => {
 
  let token;
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(createError(401, 'Authentication required. Please log in.'));
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(createError(401, 'Session expired. Please log in again.'));
    }
    return next(createError(401, 'Invalid token. Please log in again.'));
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return next(createError(401, 'User no longer exists.'));
  }

  req.user = user;
  next();
};

module.exports = protect;
