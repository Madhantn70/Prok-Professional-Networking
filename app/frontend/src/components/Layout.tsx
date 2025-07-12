import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './navigation/Navbar';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout; 