const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const { suggest } = require('../controllers/aiController');
const protect = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

router.use(protect);

router.post(
  '/suggest',
  [
    body('title').trim().notEmpty().withMessage('Task title is required for AI suggestion.'),
    body('description').optional().trim(),
  ],
  validate,
  suggest
);

module.exports = router;
