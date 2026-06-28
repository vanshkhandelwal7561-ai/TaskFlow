const Board = require('../models/Board');
const Task = require('../models/Task');
const { createError } = require('../utils/ApiError');


exports.getBoards = async (req, res) => {
  const boards = await Board.find({ owner: req.user._id })
    .sort({ createdAt: -1 })
    .populate('taskCount');

  res.json({ success: true, count: boards.length, data: boards });
};

exports.getBoard = async (req, res) => {
  const board = await Board.findOne({ _id: req.params.id, owner: req.user._id })
    .populate('taskCount');

  if (!board) throw createError(404, 'Board not found.');
  res.json({ success: true, data: board });
};

exports.createBoard = async (req, res) => {
  const { title, description } = req.body;

  const board = await Board.create({
    title,
    description,
    owner: req.user._id,
  });

  res.status(201).json({ success: true, data: board });
};


exports.updateBoard = async (req, res) => {
  const { title, description } = req.body;

  const board = await Board.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    { title, description },
    { new: true, runValidators: true }
  );

  if (!board) throw createError(404, 'Board not found.');
  res.json({ success: true, data: board });
};

exports.deleteBoard = async (req, res) => {
  const board = await Board.findOne({ _id: req.params.id, owner: req.user._id });
  if (!board) throw createError(404, 'Board not found.');

  await Task.deleteMany({ board: board._id });
  await board.deleteOne();

  res.json({ success: true, message: 'Board and all its tasks deleted.' });
};
