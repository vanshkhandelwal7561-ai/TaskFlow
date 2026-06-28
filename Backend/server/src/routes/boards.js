const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  getBoards,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
} = require('../controllers/boardController');
const { getTasksByBoard } = require('../controllers/taskController');
const protect = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');


router.use(protect);

const boardValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Board title is required.')
    .isLength({ max: 150 }).withMessage('Title cannot exceed 150 characters.'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters.'),
];

router.get('/', getBoards);
router.post('/', boardValidation, validate, createBoard);
router.get('/:id', getBoard);
router.put('/:id', boardValidation, validate, updateBoard);
router.delete('/:id', deleteBoard);


router.get('/:boardId/tasks', getTasksByBoard);

module.exports = router;
