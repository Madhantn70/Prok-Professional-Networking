import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';
import Layout from '../components/Layout';
import ProfileView from '../components/profile/ProfileView';
import ProfileEdit from '../components/profile/ProfileEdit';
import PostCreate from '../components/posts/PostCreate';
import PostList from '../components/posts/PostList';

function requireAuth(element: JSX.Element) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return element;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: localStorage.getItem('token') ? <Navigate to="/posts" /> : <Navigate to="/signup" />,
  },
  { path: '/signup', element: <Signup /> },
  { path: '/login', element: <Login /> },
  {
    path: '/',
    element: requireAuth(<Layout />),
    children: [
      { path: 'profile', element: <ProfileView /> },
      { path: 'profile/edit', element: <ProfileEdit /> },
      { path: 'posts', element: <PostList /> },
      { path: 'posts/create', element: <PostCreate /> },
    ],
  },
]);

export { router };