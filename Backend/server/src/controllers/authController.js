const User = require('../models/User');
const { signToken } = require('../utils/jwt');
const { createError } = require('../utils/ApiError');

// Helper: build auth response
const sendAuthResponse = (res, statusCode, user) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw createError(409, 'An account with this email already exists.');

  const user = await User.create({ name, email, passwordHash: password });
  sendAuthResponse(res, 201, user);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;


  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) throw createError(401, 'Invalid email or password.');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw createError(401, 'Invalid email or password.');

  sendAuthResponse(res, 200, user);
};

exports.getMe = async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      createdAt: req.user.createdAt,
    },
  });
};
