import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';
import ProfileView from '../components/profile/ProfileView';
import ProfileEdit from '../components/profile/ProfileEdit';
import PostCreate from '../components/posts/PostCreate';

function requireAuth(element: JSX.Element) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return element;
}

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  { path: '/profile', element: requireAuth(<ProfileView />) },
  { path: '/profile/edit', element: requireAuth(<ProfileEdit />) },
  { path: '/posts/create', element: requireAuth(<PostCreate />) },
]);

export { router };