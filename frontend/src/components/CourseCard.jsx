import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col hover:-translate-y-1">
      <div className="relative overflow-hidden h-48">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
        <img 
          src={course.thumbnailUrl || 'https://via.placeholder.com/800x400?text=Course'} 
          alt={course.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute bottom-3 left-3 z-20">
          <span className="text-xs font-bold px-3 py-1 bg-white/90 backdrop-blur-sm text-primary-700 rounded-full shadow-sm">
            {course.category || 'General'}
          </span>
        </div>
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">{course.title}</h3>
        <p className="text-sm text-slate-500 mb-6 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xs">
            {(course.instructor?.name || 'U').charAt(0)}
          </span>
          <span className="font-medium">{course.instructor?.name || 'Unknown'}</span>
        </p>
        <Link 
          to={`/courses/${course._id}`}
          className="block w-full text-center bg-slate-50 text-slate-700 font-semibold py-2.5 rounded-xl hover:bg-gradient-to-r hover:from-primary-600 hover:to-indigo-600 hover:text-white transition-all hover:shadow-md mt-auto"
        >
          View Course
        </Link>
      </div>
    </div>
  );
};
export default CourseCard;
