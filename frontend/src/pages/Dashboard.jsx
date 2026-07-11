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
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}!</h1>
          <p className="text-gray-500 capitalize">Role: {user.role}</p>
        </div>
        {user.role === 'instructor' && (
          <Link 
            to="/create-course" 
            className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition font-medium"
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
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-6">My Quiz Attempts</h2>
          {attempts.length === 0 ? (
            <p className="text-gray-500">No quizzes attempted yet.</p>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 font-medium">Quiz</th>
                      <th className="px-6 py-3 font-medium">Course</th>
                      <th className="px-6 py-3 font-medium">Score</th>
                      <th className="px-6 py-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {attempts.map(attempt => (
                      <tr key={attempt._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-gray-800 font-medium">{attempt.quiz?.title || 'Deleted Quiz'}</td>
                        <td className="px-6 py-4 text-gray-500">{attempt.quiz?.course?.title || '-'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-sm font-semibold ${
                            (attempt.score / attempt.totalQuestions) >= 0.7 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {attempt.score} / {attempt.totalQuestions} ({Math.round(attempt.score/attempt.totalQuestions * 100)}%)
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{new Date(attempt.submittedAt).toLocaleDateString()}</td>
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
