const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getMyEnrolledCourses,
} = require('../controllers/courseController');
const { protect, instructorOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router
  .route('/')
  .get(getCourses)
  .post(protect, instructorOnly, upload.single('video'), createCourse);

router.route('/enrolled/me').get(protect, getMyEnrolledCourses);

router
  .route('/:id')
  .get(getCourseById)
  .put(protect, instructorOnly, updateCourse)
  .delete(protect, instructorOnly, deleteCourse);

router.route('/:id/enroll').post(protect, enrollCourse);

module.exports = router;
