import { Link } from 'react-router-dom';
import { PlayCircle, Target, TrendingUp, BookOpen, Users, Award } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen -mt-8">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-indigo-800 text-white py-32 text-center rounded-b-[3rem] shadow-2xl px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob animation-delay-2000"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-primary-100 text-sm font-semibold tracking-wide mb-6">
            ✨ Welcome to the Future of Learning
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight leading-tight">
            Unlock Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">Potential</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-blue-100/90 font-light max-w-2xl mx-auto leading-relaxed">
            Cloud-powered e-learning platform for the modern student. Master new skills with expert-led courses.
          </p>
          <Link 
            to="/courses" 
            className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-10 py-4 rounded-full text-lg shadow-xl hover:shadow-2xl hover:bg-slate-50 transition-all hover:-translate-y-1"
          >
            Start Learning Now
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Why Choose EduCloud?</h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-primary-500 to-indigo-500 mx-auto rounded-full"></div>
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
