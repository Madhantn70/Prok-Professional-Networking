import { createBrowserRouter } from 'react-router-dom';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';
import ProfileView from '../components/profile/ProfileView';
import ProfileEdit from '../components/profile/ProfileEdit';

import { RouterProvider, Navigate } from "react-router-dom";
// ...other imports

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/profile", element: <ProfileView /> },
  { path: "/profile/edit", element: <ProfileEdit /> },
  // ...other routes
]);

export { router };