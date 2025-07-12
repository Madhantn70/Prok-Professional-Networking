import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-6">
            <Link to="/posts" className="text-blue-600 font-semibold hover:underline">
              Posts
            </Link>
            <Link to="/posts/create" className="text-blue-600 font-semibold hover:underline">
              Create Post
            </Link>
            <Link to="/profile" className="text-blue-600 font-semibold hover:underline">
              Profile
            </Link>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="text-red-600 font-semibold hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 