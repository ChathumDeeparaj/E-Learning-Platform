import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (user.role === 'student') {
          const courseRes = await api.get('/courses/enrolled/me');
          setCourses(courseRes.data);
          const attemptsRes = await api.get('/quizzes/attempts/me');
          setAttempts(attemptsRes.data);
        } else {
          const courseRes = await api.get('/courses');
          const myCourses = courseRes.data.filter(c => c.instructor._id === user._id);
          setCourses(myCourses);
        }
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete(`/courses/${id}`);
        setCourses(courses.filter(c => c._id !== id));
        toast.success('Course deleted');
      } catch (err) {
        toast.error('Failed to delete course');
      }
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] shadow-sm border border-slate-200/60 mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-100/40 to-indigo-100/40 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Welcome, {user.name}! 👋</h1>
          <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Role: <span className="capitalize">{user.role}</span>
          </p>
        </div>
        {user.role === 'instructor' && (
          <Link 
            to="/create-course" 
            className="bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-8 py-3 rounded-xl shadow-lg shadow-primary-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all font-bold"
          >
            + Create New Course
          </Link>
        )}
      </div>
      
      {error && <div className="bg-red-50 text-red-600 p-4 rounded mb-4">{error}</div>}

      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {user.role === 'instructor' ? 'My Created Courses' : 'My Enrolled Courses'}
        </h2>
        
        {courses.length === 0 ? (
          <p className="text-gray-500">You don't have any courses yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <div key={course._id} className="relative group">
                <CourseCard course={course} />
                {user.role === 'instructor' && (
                  <button 
                    onClick={() => handleDeleteCourse(course._id)}
                    className="absolute top-2 right-2 bg-red-100 text-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 hover:text-white transition-all shadow"
                    title="Delete Course"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {user.role === 'student' && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 tracking-tight">My Quiz Attempts</h2>
          {attempts.length === 0 ? (
            <div className="bg-white/50 border border-slate-200 rounded-2xl p-8 text-center">
              <p className="text-slate-500 font-medium">No quizzes attempted yet. Start learning!</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 font-bold text-sm tracking-wider uppercase">Quiz</th>
                      <th className="px-6 py-4 font-bold text-sm tracking-wider uppercase">Course</th>
                      <th className="px-6 py-4 font-bold text-sm tracking-wider uppercase">Score</th>
                      <th className="px-6 py-4 font-bold text-sm tracking-wider uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {attempts.map(attempt => (
                      <tr key={attempt._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 text-slate-800 font-bold">{attempt.quiz?.title || 'Deleted Quiz'}</td>
                        <td className="px-6 py-4 text-slate-500 font-medium">{attempt.quiz?.course?.title || '-'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wide ${
                            (attempt.score / attempt.totalQuestions) >= 0.7 ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-orange-100 text-orange-700 border border-orange-200'
                          }`}>
                            {attempt.score} / {attempt.totalQuestions} ({Math.round(attempt.score/attempt.totalQuestions * 100)}%)
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-medium">{new Date(attempt.submittedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default Dashboard;
