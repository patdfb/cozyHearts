import { createBrowserRouter, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login/Login'
import Register from '../pages/Register/Register'
import RegisterChoice from '../pages/Register/RegisterChoice'
import RegisterFam from '../pages/Register/RegisterFam'
import Main from '../pages/Main'


const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register-choice',
    element: <RegisterChoice />,
  },
    {
    path: '/register-family',
    element: <RegisterFam />,
  },
    {
    path: '/register',
    element: <Register />,
  },
    {
    path: '/main',
    element: <Main />,
  },

  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

export default router
