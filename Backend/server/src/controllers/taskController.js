const Task = require('../models/Task');
const Board = require('../models/Board');
const { createError } = require('../utils/ApiError');

const verifyBoardOwnership = async (boardId, userId) => {
  const board = await Board.findOne({ _id: boardId, owner: userId });
  if (!board) throw createError(404, 'Board not found.');
  return board;
};

exports.getTasksByBoard = async (req, res) => {
  await verifyBoardOwnership(req.params.boardId, req.user._id);

  const { status, priority, sortBy = 'createdAt', order = 'desc' } = req.query;

  const filter = { board: req.params.boardId, owner: req.user._id };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  const sortOrder = order === 'asc' ? 1 : -1;
  const allowedSortFields = ['createdAt', 'dueDate', 'priority', 'title'];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';

  const tasks = await Task.find(filter).sort({ [sortField]: sortOrder });

  res.json({ success: true, count: tasks.length, data: tasks });
};

exports.getTask = async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
    .populate('board', 'title');

  if (!task) throw createError(404, 'Task not found.');
  res.json({ success: true, data: task });
};

exports.createTask = async (req, res) => {
  const { title, description, status, priority, dueDate, estimatedEffort, board } = req.body;

  await verifyBoardOwnership(board, req.user._id);

  const task = await Task.create({
    title,
    description,
    status,
    priority,
    dueDate: dueDate || null,
    estimatedEffort,
    board,
    owner: req.user._id,
  });

  res.status(201).json({ success: true, data: task });
};

exports.updateTask = async (req, res) => {
  const { title, description, status, priority, dueDate, estimatedEffort, aiSuggestion } = req.body;

  const updateFields = {};
  if (title !== undefined) updateFields.title = title;
  if (description !== undefined) updateFields.description = description;
  if (status !== undefined) updateFields.status = status;
  if (priority !== undefined) updateFields.priority = priority;
  if (dueDate !== undefined) updateFields.dueDate = dueDate || null;
  if (estimatedEffort !== undefined) updateFields.estimatedEffort = estimatedEffort;
  if (aiSuggestion !== undefined) updateFields.aiSuggestion = aiSuggestion;

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    updateFields,
    { new: true, runValidators: true }
  );

  if (!task) throw createError(404, 'Task not found.');
  res.json({ success: true, data: task });
};

exports.deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!task) throw createError(404, 'Task not found.');
  res.json({ success: true, message: 'Task deleted.' });
};
