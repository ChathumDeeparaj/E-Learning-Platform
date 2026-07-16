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
      <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white overflow-hidden mb-12 relative">
        {/* Decorative subtle background for header */}
        <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-primary-50/80 to-transparent pointer-events-none"></div>
        
        <div className="p-10 relative z-10">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">{course.title}</h1>
            <span className="px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-bold shadow-sm whitespace-nowrap ml-4">
              {course.category}
            </span>
          </div>
          <p className="text-slate-600 mb-8 whitespace-pre-line text-lg leading-relaxed">{course.description}</p>
          <div className="text-sm text-slate-500 mb-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center font-bold text-slate-700">
              {(course.instructor?.name || 'U').charAt(0)}
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Instructor</p>
              <p className="font-bold text-slate-800 text-base">{course.instructor?.name}</p>
            </div>
          </div>

          {!canViewContent && user.role === 'student' && (
            <div className="bg-slate-50/80 backdrop-blur-md p-10 rounded-3xl text-center border border-slate-200 shadow-inner my-10 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-5"></div>
              <h3 className="text-2xl font-extrabold text-slate-800 mb-4 relative z-10">Ready to start learning?</h3>
              <p className="text-slate-500 mb-8 relative z-10">Enroll now to access all video lectures and quizzes.</p>
              <button 
                onClick={handleEnroll}
                className="relative z-10 bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-10 py-4 rounded-2xl shadow-xl hover:shadow-primary-500/40 hover:-translate-y-1 transition-all font-bold text-lg"
              >
                Enroll Now
              </button>
            </div>
          )}

          {canViewContent && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {user.role === 'student' && (
                <div className="mb-8 inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm font-bold border border-green-200 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  You are enrolled in this course
                </div>
              )}
              
              {course.videoUrl ? (
                <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl bg-slate-900 aspect-video flex items-center justify-center border-4 border-slate-800 group relative">
                  <video controls src={course.videoUrl} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="mb-12 bg-slate-100 p-12 text-center text-slate-500 rounded-2xl border border-slate-200 border-dashed">
                  <p className="font-medium text-lg">No video available for this course.</p>
                </div>
              )}

              <div className="mt-12 pt-10 border-t border-slate-200">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                    Q
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900">Course Quizzes</h3>
                </div>
                
                {quizzes.length === 0 ? (
                  <p className="text-slate-500 font-medium">No quizzes available yet.</p>
                ) : (
                  <div className="grid gap-4">
                    {quizzes.map(quiz => (
                      <div key={quiz._id} className="flex justify-between items-center p-6 bg-white border border-slate-200 rounded-2xl hover:shadow-lg hover:border-primary-200 transition-all group">
                        <span className="font-bold text-slate-800 text-lg group-hover:text-primary-600 transition-colors">{quiz.title}</span>
                        {user.role === 'student' && (
                          <Link 
                            to={`/quiz/${quiz._id}`}
                            className="bg-white border-2 border-primary-100 text-primary-600 font-bold hover:bg-primary-50 hover:border-primary-200 px-6 py-2.5 rounded-xl transition-all hover:shadow-sm"
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
