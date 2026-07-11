const asyncHandler = require('express-async-handler');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Course = require('../models/Course');

// @desc    Create a quiz
// @route   POST /api/quizzes
// @access  Private/Instructor
const createQuiz = asyncHandler(async (req, res) => {
  const { courseId, title, questions } = req.body;

  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (course.instructor.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to add quiz to this course');
  }

  const quiz = new Quiz({
    course: courseId,
    title,
    questions,
  });

  const createdQuiz = await quiz.save();
  res.status(201).json(createdQuiz);
});

// @desc    Get quizzes for a specific course
// @route   GET /api/quizzes/course/:courseId
// @access  Public
const getQuizzesByCourse = asyncHandler(async (req, res) => {
  const quizzes = await Quiz.find({ course: req.params.courseId });

  // Strip correct answers
  const sanitizedQuizzes = quizzes.map((quiz) => {
    const qObj = quiz.toObject();
    qObj.questions.forEach((q) => {
      delete q.correctAnswer;
    });
    return qObj;
  });

  res.json(sanitizedQuizzes);
});

// @desc    Get quiz by ID
// @route   GET /api/quizzes/:id
// @access  Public
const getQuizById = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);

  if (quiz) {
    const qObj = quiz.toObject();
    qObj.questions.forEach((q) => {
      delete q.correctAnswer;
    });
    res.json(qObj);
  } else {
    res.status(404);
    throw new Error('Quiz not found');
  }
});

// @desc    Submit a quiz
// @route   POST /api/quizzes/:id/submit
// @access  Private
const submitQuiz = asyncHandler(async (req, res) => {
  const { answers } = req.body;
  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }

  if (
    !answers ||
    !Array.isArray(answers) ||
    answers.length !== quiz.questions.length
  ) {
    res.status(400);
    throw new Error('Invalid or missing answers provided');
  }

  let score = 0;
  const totalQuestions = quiz.questions.length;

  quiz.questions.forEach((q, index) => {
    if (q.correctAnswer === answers[index]) {
      score++;
    }
  });

  const attempt = new QuizAttempt({
    student: req.user._id,
    quiz: quiz._id,
    score,
    totalQuestions,
    answers,
  });

  await attempt.save();

  res.status(201).json({
    score,
    totalQuestions,
    percentage: (score / totalQuestions) * 100,
  });
});

// @desc    Get logged in user's quiz attempts
// @route   GET /api/quizzes/attempts/me
// @access  Private
const getMyAttempts = asyncHandler(async (req, res) => {
  const attempts = await QuizAttempt.find({ student: req.user._id })
    .populate('quiz', 'title course')
    .sort('-submittedAt');

  res.json(attempts);
});

module.exports = {
  createQuiz,
  getQuizzesByCourse,
  getQuizById,
  submitQuiz,
  getMyAttempts,
};
