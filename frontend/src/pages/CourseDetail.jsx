import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const { data } = await api.get(`/courses/${id}`);
        setCourse(data);
        
        const quizRes = await api.get(`/quizzes/course/${id}`);
        setQuizzes(quizRes.data);
      } catch (err) {
        setError('Failed to load course details.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [id]);

  const handleEnroll = async () => {
    try {
      await api.post(`/courses/${id}/enroll`);
      toast.success('Successfully enrolled!');
      setCourse({ ...course, enrolledStudents: [...(course.enrolledStudents || []), user._id] });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to enroll');
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!course) return null;

  const isEnrolled = course.enrolledStudents?.includes(user._id);
  const isInstructor = user.role === 'instructor';
  const canViewContent = isEnrolled || (isInstructor && course.instructor._id === user._id);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="p-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
              {course.category}
            </span>
          </div>
          <p className="text-gray-600 mb-6 whitespace-pre-line">{course.description}</p>
          <div className="text-sm text-gray-500 mb-6">
            Created by: <span className="font-medium text-gray-800">{course.instructor?.name}</span>
          </div>

          {!canViewContent && user.role === 'student' && (
            <div className="bg-gray-50 p-6 rounded-lg text-center border border-gray-100">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Enroll to access course content</h3>
              <button 
                onClick={handleEnroll}
                className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition"
              >
                Enroll Now
              </button>
            </div>
          )}

          {canViewContent && (
            <div>
              {user.role === 'student' && (
                <div className="mb-6 inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  ✓ You are enrolled
                </div>
              )}
              
              {course.videoUrl ? (
                <div className="mb-8 rounded overflow-hidden shadow bg-black aspect-video flex items-center justify-center">
                  <video controls src={course.videoUrl} className="w-full h-full" />
                </div>
              ) : (
                <div className="mb-8 bg-gray-100 p-8 text-center text-gray-500 rounded">
                  No video available for this course.
                </div>
              )}

              <div className="mt-8 border-t pt-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Course Quizzes</h3>
                {quizzes.length === 0 ? (
                  <p className="text-gray-500">No quizzes available yet.</p>
                ) : (
                  <div className="space-y-4">
                    {quizzes.map(quiz => (
                      <div key={quiz._id} className="flex justify-between items-center p-4 border rounded hover:bg-gray-50">
                        <span className="font-medium text-gray-800">{quiz.title}</span>
                        {user.role === 'student' && (
                          <Link 
                            to={`/quiz/${quiz._id}`}
                            className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-1 rounded transition"
                          >
                            Take Quiz
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default CourseDetail;
