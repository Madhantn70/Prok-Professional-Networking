import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-6">
            {/* Navigation items will be implemented here */}
            <Link to="/posts/create" className="text-blue-600 font-semibold hover:underline">
              Create Post
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 