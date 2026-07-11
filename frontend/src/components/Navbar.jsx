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
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-wider">EduCloud</Link>
        <div className="flex space-x-4 items-center">
          <Link to="/" className="hover:text-blue-200 transition">Home</Link>
          <Link to="/courses" className="hover:text-blue-200 transition">Courses</Link>
          
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-blue-200 transition">Dashboard</Link>
              <button 
                onClick={handleLogout}
                className="bg-white text-blue-600 px-4 py-1 rounded-md hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200 transition">Login</Link>
              <Link 
                to="/register"
                className="bg-white text-blue-600 px-4 py-1 rounded-md hover:bg-gray-100 transition"
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
