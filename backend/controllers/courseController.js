const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');
const User = require('../models/User');
const deleteFromS3 = require('../utils/deleteFromS3');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({}).populate('instructor', 'name email');
  res.json(courses);
});

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate(
    'instructor',
    'name email'
  );

  if (course) {
    res.json(course);
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
});

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Instructor
const createCourse = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;

  let videoUrl = '';
  let videoKey = '';

  if (req.file) {
    videoUrl = req.file.location;
    videoKey = req.file.key;
  }

  const course = new Course({
    title,
    description,
    category,
    instructor: req.user._id,
    videoUrl,
    videoKey,
  });

  const createdCourse = await course.save();
  res.status(201).json(createdCourse);
});

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Instructor
const updateCourse = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;

  const course = await Course.findById(req.params.id);

  if (course) {
    if (course.instructor.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to update this course');
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.category = category || course.category;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
});

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Instructor
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course) {
    if (course.instructor.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to delete this course');
    }

    if (course.videoKey) {
      await deleteFromS3(course.videoKey);
    }

    await course.deleteOne();
    res.json({ message: 'Course removed' });
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
});

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private
const enrollCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  const user = await User.findById(req.user._id);

  if (course && user) {
    const alreadyEnrolled = course.enrolledStudents.includes(req.user._id);

    if (alreadyEnrolled) {
      res.status(400);
      throw new Error('You are already enrolled in this course');
    }

    course.enrolledStudents.push(req.user._id);
    await course.save();

    user.enrolledCourses.push(course._id);
    await user.save();

    res.json({ message: 'Successfully enrolled in course' });
  } else {
    res.status(404);
    throw new Error('Course or User not found');
  }
});

// @desc    Get enrolled courses for logged in user
// @route   GET /api/courses/enrolled/me
// @access  Private
const getMyEnrolledCourses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'enrolledCourses',
    populate: {
      path: 'instructor',
      select: 'name email',
    },
  });

  if (user) {
    res.json(user.enrolledCourses);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getMyEnrolledCourses,
};
