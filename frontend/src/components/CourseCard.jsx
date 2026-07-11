import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
      <img 
        src={course.thumbnailUrl || 'https://via.placeholder.com/800x400?text=Course'} 
        alt={course.title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
            {course.category || 'General'}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-sm text-gray-500 mb-4 flex-grow">
          Instructor: {course.instructor?.name || 'Unknown'}
        </p>
        <Link 
          to={`/courses/${course._id}`}
          className="block w-full text-center bg-blue-50 text-blue-600 font-medium py-2 rounded hover:bg-blue-600 hover:text-white transition-colors mt-auto"
        >
          View Course
        </Link>
      </div>
    </div>
  );
};
export default CourseCard;
