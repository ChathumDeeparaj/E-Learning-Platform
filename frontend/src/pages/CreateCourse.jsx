import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const CreateCourse = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Programming');
  const [video, setVideo] = useState(null);
  
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [createdCourse, setCreatedCourse] = useState(null);

  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([
    { question: '', options: ['', '', '', ''], correctAnswer: 0 }
  ]);
  const [quizLoading, setQuizLoading] = useState(false);

  const navigate = useNavigate();

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    if (video) {
      formData.append('video', video);
    }

    try {
      const { data } = await api.post('/courses', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      setCreatedCourse(data);
      setUploadProgress(0);
      toast.success('Course created successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[optIndex] = value;
    setQuestions(newQuestions);
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    if (!createdCourse) return;
    
    setQuizLoading(true);
    try {
      await api.post('/quizzes', {
        courseId: createdCourse._id,
        title: quizTitle,
        questions
      });
      toast.success('Quiz successfully added!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create quiz');
    } finally {
      setQuizLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Course</h2>

        <form onSubmit={handleCourseSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input 
              required type="text" value={title} onChange={e => setTitle(e.target.value)}
              disabled={createdCourse}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              required value={description} onChange={e => setDescription(e.target.value)}
              disabled={createdCourse} rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              value={category} onChange={e => setCategory(e.target.value)} disabled={createdCourse}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            >
              <option value="Programming">Programming</option>
              <option value="Design">Design</option>
              <option value="Business">Business</option>
              <option value="General">General</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Video</label>
            <input 
              type="file" accept="video/*" onChange={e => setVideo(e.target.files[0])} disabled={createdCourse}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {loading && uploadProgress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
              <div className="bg-blue-600 h-2.5 rounded-full transition-all" style={{ width: `${uploadProgress}%` }}></div>
            </div>
          )}

          {!createdCourse && (
            <button 
              type="submit" disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 mt-4"
            >
              {loading ? 'Uploading...' : 'Create Course'}
            </button>
          )}
        </form>
      </div>

      {createdCourse && (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Quiz for {createdCourse.title}</h2>
          
          <form onSubmit={handleQuizSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Title</label>
              <input 
                required type="text" value={quizTitle} onChange={e => setQuizTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
            
            <div className="space-y-6">
              {questions.map((q, qIndex) => (
                <div key={qIndex} className="p-4 border border-gray-200 rounded bg-gray-50">
                  <div className="font-medium text-gray-800 mb-2">Question {qIndex + 1}</div>
                  <input 
                    required type="text" placeholder="Enter question..." value={q.question} 
                    onChange={e => handleQuestionChange(qIndex, 'question', e.target.value)}
                    className="w-full px-3 py-2 mb-4 border border-gray-300 rounded" 
                  />
                  
                  <div className="space-y-2">
                    {q.options.map((opt, optIndex) => (
                      <div key={optIndex} className="flex items-center space-x-3">
                        <input 
                          type="radio" name={`correct-${qIndex}`} 
                          checked={q.correctAnswer === optIndex}
                          onChange={() => handleQuestionChange(qIndex, 'correctAnswer', optIndex)}
                          className="h-4 w-4 text-blue-600"
                        />
                        <input 
                          required type="text" placeholder={`Option ${optIndex + 1}`} value={opt} 
                          onChange={e => handleOptionChange(qIndex, optIndex, e.target.value)}
                          className="flex-grow px-3 py-1 border border-gray-300 rounded" 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-4">
              <button 
                type="button" onClick={handleAddQuestion}
                className="bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition"
              >
                + Add Question
              </button>
              <button 
                type="submit" disabled={quizLoading}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
              >
                {quizLoading ? 'Saving...' : 'Save Quiz & Finish'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default CreateCourse;
