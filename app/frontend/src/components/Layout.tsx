import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './navigation/Navbar';

export default function Layout() {
  const token = localStorage.getItem('token');
  const tokenStatus = token ? '✅ Token exists' : '❌ No token';
  
  return (
    <div>
      {/* Debug info - remove in production */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        right: 0, 
        background: '#333', 
        color: '#fff', 
        padding: '4px 8px', 
        fontSize: '10px', 
        zIndex: 1000 
      }}>
        {tokenStatus}
      </div>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
} 