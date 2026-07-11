const express = require('express');
const router = express.Router();
const {
  createQuiz,
  getQuizzesByCourse,
  getQuizById,
  submitQuiz,
  getMyAttempts,
} = require('../controllers/quizController');
const { protect, instructorOnly } = require('../middleware/authMiddleware');

router.route('/').post(protect, instructorOnly, createQuiz);

router.route('/attempts/me').get(protect, getMyAttempts);

router.route('/course/:courseId').get(getQuizzesByCourse);

router.route('/:id').get(getQuizById);

router.route('/:id/submit').post(protect, submitQuiz);

module.exports = router;
