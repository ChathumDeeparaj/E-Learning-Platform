import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/20">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-extrabold tracking-tight text-primary-600 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
            E
          </div>
          EduCloud
        </Link>
        <div className="flex space-x-6 items-center text-slate-600 font-medium">
          <Link to="/" className="hover:text-primary-600 transition">Home</Link>
          <Link to="/courses" className="hover:text-primary-600 transition">Courses</Link>
          
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-primary-600 transition">Dashboard</Link>
              <button 
                onClick={handleLogout}
                className="bg-white/50 text-slate-700 px-5 py-2 rounded-full hover:bg-red-50 hover:text-red-600 transition shadow-sm border border-slate-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-primary-600 transition">Login</Link>
              <Link 
                to="/register"
                className="bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-6 py-2 rounded-full hover:shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
