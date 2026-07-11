import { Link } from 'react-router-dom';
import { PlayCircle, Target, TrendingUp, BookOpen, Users, Award } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen -mt-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-24 text-center rounded-b-3xl shadow-lg px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">Learn Without Limits</h1>
        <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-2xl mx-auto font-light">
          Cloud-powered e-learning platform for the modern student. Master new skills with expert-led courses.
        </p>
        <Link 
          to="/courses" 
          className="bg-white text-blue-700 font-semibold px-8 py-4 rounded-full text-lg shadow-lg hover:bg-blue-50 hover:shadow-xl transition transform hover:-translate-y-1"
        >
          Browse Courses
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose EduCloud?</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition text-center group">
            <div className="bg-blue-50 w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition">
              <PlayCircle className="w-8 h-8 text-blue-600 group-hover:text-white transition" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Video Lessons</h3>
            <p className="text-gray-600">High-quality, on-demand video lectures that you can watch anytime, anywhere at your own pace.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition text-center group">
            <div className="bg-indigo-50 w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition">
              <Target className="w-8 h-8 text-indigo-600 group-hover:text-white transition" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Interactive Quizzes</h3>
            <p className="text-gray-600">Test your knowledge immediately after learning with engaging, instant-feedback quizzes.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition text-center group">
            <div className="bg-teal-50 w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-600 transition">
              <TrendingUp className="w-8 h-8 text-teal-600 group-hover:text-white transition" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Track Progress</h3>
            <p className="text-gray-600">Monitor your learning journey with detailed analytics, course tracking, and personalized dashboards.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-20 px-4 rounded-3xl mb-12 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
          <div className="text-center">
            <div className="bg-white w-20 h-20 mx-auto rounded-full shadow flex items-center justify-center mb-6 border-4 border-blue-50">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">1. Create an Account</h4>
            <p className="text-gray-600">Sign up as a student or instructor to get started in seconds.</p>
          </div>
          <div className="text-center">
            <div className="bg-white w-20 h-20 mx-auto rounded-full shadow flex items-center justify-center mb-6 border-4 border-blue-50">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">2. Enroll in Courses</h4>
            <p className="text-gray-600">Browse our catalog and enroll in subjects that interest you.</p>
          </div>
          <div className="text-center">
            <div className="bg-white w-20 h-20 mx-auto rounded-full shadow flex items-center justify-center mb-6 border-4 border-blue-50">
              <Award className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">3. Learn and Achieve</h4>
            <p className="text-gray-600">Watch videos, take quizzes, and master new skills effortlessly.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-10 text-center mt-auto">
        <div className="text-gray-500 font-medium">
          &copy; {new Date().getFullYear()} EduCloud Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
export default Home;
