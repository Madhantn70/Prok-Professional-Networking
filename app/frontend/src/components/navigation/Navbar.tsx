import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="glass shadow-soft rounded-2xl mx-auto mt-6 max-w-5xl px-8 py-3 flex items-center justify-between z-20 relative">
      {/* Logo and Brand */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-xl shadow">
          P
        </div>
        <span className="text-2xl font-extrabold canva-gradient-text tracking-tight">Prok</span>
      </div>
      {/* Navigation Links */}
      <div className="flex items-center gap-8">
        <Link to="/posts" className="text-blue-700 font-semibold hover:text-purple-600 transition-smooth">Posts</Link>
        <Link to="/posts/create" className="text-blue-700 font-semibold hover:text-purple-600 transition-smooth">Create Post</Link>
        <Link to="/profile" className="text-blue-700 font-semibold hover:text-purple-600 transition-smooth">Profile</Link>
      </div>
      {/* User Avatar and Logout */}
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 canva-avatar flex items-center justify-center text-blue-700 font-bold text-lg bg-white">U</div>
        <button
          onClick={handleLogout}
          className="canva-btn px-5 py-1 text-sm font-semibold"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 