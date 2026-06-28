const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const protect = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

router.use(protect);

const STATUSES = ['todo', 'in-progress', 'done'];
const PRIORITIES = ['low', 'medium', 'high'];

const taskCreateValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Task title is required.')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters.'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters.'),
  body('status')
    .optional()
    .isIn(STATUSES).withMessage(`Status must be one of: ${STATUSES.join(', ')}.`),
  body('priority')
    .optional()
    .isIn(PRIORITIES).withMessage(`Priority must be one of: ${PRIORITIES.join(', ')}.`),
  body('dueDate')
    .optional({ nullable: true })
    .isISO8601().withMessage('Due date must be a valid ISO 8601 date.'),
  body('board')
    .notEmpty().withMessage('Board ID is required.')
    .isMongoId().withMessage('Invalid board ID.'),
];

const taskUpdateValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty.')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters.'),
  body('status')
    .optional()
    .isIn(STATUSES).withMessage(`Status must be one of: ${STATUSES.join(', ')}.`),
  body('priority')
    .optional()
    .isIn(PRIORITIES).withMessage(`Priority must be one of: ${PRIORITIES.join(', ')}.`),
  body('dueDate')
    .optional({ nullable: true })
    .isISO8601().withMessage('Due date must be a valid ISO 8601 date.'),
];

router.get('/:id', getTask);
router.post('/', taskCreateValidation, validate, createTask);
router.put('/:id', taskUpdateValidation, validate, updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
