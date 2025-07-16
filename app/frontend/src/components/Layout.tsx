import { Outlet } from 'react-router-dom';
import Navbar from './navigation/Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50 flex flex-col">
      {/* Gradient Banner */}
      <div className="w-full h-32 bg-gradient-to-r from-blue-400 via-purple-300 to-blue-200 opacity-70 absolute top-0 left-0 z-0" />
      <Navbar />
      <main className="flex-1 flex justify-center items-start pt-12 z-10 relative">
        <div className="w-full max-w-5xl px-4">
          <div className="glass p-6 rounded-3xl shadow-soft mt-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
} 