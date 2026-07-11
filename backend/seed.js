const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Course = require('./models/Course');
const Quiz = require('./models/Quiz');
const QuizAttempt = require('./models/QuizAttempt');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding');

    await User.deleteMany();
    await Course.deleteMany();
    await Quiz.deleteMany();
    await QuizAttempt.deleteMany();
    console.log('Cleared existing data');

    // Create Users
    const users = await User.create([
      { name: 'Instructor John', email: 'john@instructor.com', password: 'password123', role: 'instructor' },
      { name: 'Instructor Jane', email: 'jane@instructor.com', password: 'password123', role: 'instructor' },
      { name: 'Student Alice', email: 'alice@student.com', password: 'password123', role: 'student' },
      { name: 'Student Bob', email: 'bob@student.com', password: 'password123', role: 'student' },
      { name: 'Student Charlie', email: 'charlie@student.com', password: 'password123', role: 'student' }
    ]);
    
    console.log('Created Users');

    const instructor1 = users[0];
    const instructor2 = users[1];

    // Create Courses
    const courses = await Course.insertMany([
      {
        title: 'React for Beginners',
        description: 'Learn React from scratch. Building modern web applications.',
        instructor: instructor1._id,
        category: 'Programming',
        videoUrl: null,
        thumbnailUrl: 'https://via.placeholder.com/800x400?text=React+Course'
      },
      {
        title: 'Advanced Node.js',
        description: 'Deep dive into Node.js, Express, and MongoDB.',
        instructor: instructor1._id,
        category: 'Programming',
        videoUrl: null,
        thumbnailUrl: 'https://via.placeholder.com/800x400?text=Node+Course'
      },
      {
        title: 'UI/UX Masterclass',
        description: 'Design beautiful user interfaces and user experiences.',
        instructor: instructor2._id,
        category: 'Design',
        videoUrl: null,
        thumbnailUrl: 'https://via.placeholder.com/800x400?text=UI/UX+Course'
      },
      {
        title: 'Business Strategy 101',
        description: 'Learn how to scale businesses successfully.',
        instructor: instructor2._id,
        category: 'Business',
        videoUrl: null,
        thumbnailUrl: 'https://via.placeholder.com/800x400?text=Business+Course'
      }
    ]);

    console.log('Created Courses');

    // Create Quizzes
    await Quiz.insertMany([
      {
        course: courses[0]._id,
        title: 'React Basics Quiz',
        questions: [
          { question: 'What is JSX?', options: ['JavaScript XML', 'Java Syntax Extension', 'JSON X', 'None of the above'], correctAnswer: 0 },
          { question: 'What hook is used for state?', options: ['useEffect', 'useState', 'useContext', 'useRef'], correctAnswer: 1 },
          { question: 'Can React be used for mobile apps?', options: ['Yes, via React Native', 'No, only web', 'Yes, via Angular', 'Maybe'], correctAnswer: 0 }
        ]
      },
      {
        course: courses[2]._id,
        title: 'Design Principles',
        questions: [
          { question: 'What is white space?', options: ['Empty space between elements', 'A color palette', 'A typography rule', 'None'], correctAnswer: 0 },
          { question: 'Which color mode is for screens?', options: ['CMYK', 'RGB', 'Pantone', 'Grayscale'], correctAnswer: 1 },
          { question: 'What does UX stand for?', options: ['User X-ray', 'Universal Experience', 'User Experience', 'United X'], correctAnswer: 2 }
        ]
      }
    ]);

    console.log('Created Quizzes');
    
    console.log('=================================');
    console.log('SEEDING COMPLETE!');
    console.log('Test Credentials:');
    console.log('Instructor 1: john@instructor.com / password123');
    console.log('Instructor 2: jane@instructor.com / password123');
    console.log('Student 1:   alice@student.com / password123');
    console.log('Student 2:   bob@student.com / password123');
    console.log('=================================');
    
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
