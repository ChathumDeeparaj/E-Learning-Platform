import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await api.get(`/quizzes/${id}`);
        setQuiz(data);
        setAnswers(new Array(data.questions.length).fill(null));
      } catch (err) {
        setError('Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleOptionSelect = (optIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentIdx] = optIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (answers.includes(null)) {
      if (!window.confirm('You have unanswered questions. Are you sure you want to submit?')) return;
    }
    
    setSubmitting(true);
    try {
      const { data } = await api.post(`/quizzes/${id}/submit`, { answers });
      setResult(data);
      toast.success('Quiz submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!quiz) return null;

  if (result) {
    return (
      <div className="max-w-2xl mx-auto text-center mt-12 bg-white p-12 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Quiz Completed!</h2>
        <div className="text-6xl font-black text-blue-600 mb-6">{Math.round(result.percentage)}%</div>
        <p className="text-xl text-gray-600 mb-8">You scored {result.score} out of {result.totalQuestions}</p>
        <button 
          onClick={() => navigate(`/courses/${quiz.course}`)}
          className="bg-blue-600 text-white px-8 py-3 rounded shadow hover:bg-blue-700 transition font-medium"
        >
          Back to Course
        </button>
      </div>
    );
  }

  const question = quiz.questions[currentIdx];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-blue-50 px-8 py-4 border-b border-blue-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-blue-900">{quiz.title}</h2>
          <span className="text-blue-600 font-medium whitespace-nowrap ml-4">
            Question {currentIdx + 1} of {quiz.questions.length}
          </span>
        </div>
        
        <div className="p-8">
          <h3 className="text-xl text-gray-800 mb-6 font-medium">{question.question}</h3>
          
          <div className="space-y-3 mb-8">
            {question.options.map((opt, i) => (
              <label 
                key={i} 
                className={`block p-4 border rounded cursor-pointer transition ${
                  answers[currentIdx] === i ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'hover:bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    name="quizOption" 
                    checked={answers[currentIdx] === i}
                    onChange={() => handleOptionSelect(i)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-3 text-gray-700">{opt}</span>
                </div>
              </label>
            ))}
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-gray-100">
            <button 
              onClick={() => setCurrentIdx(prev => prev - 1)}
              disabled={currentIdx === 0}
              className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition"
            >
              Previous
            </button>
            
            {currentIdx === quiz.questions.length - 1 ? (
              <button 
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-green-600 text-white px-8 py-2 rounded hover:bg-green-700 transition shadow font-medium"
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            ) : (
              <button 
                onClick={() => setCurrentIdx(prev => prev + 1)}
                className="bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700 transition shadow"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default QuizPage;
