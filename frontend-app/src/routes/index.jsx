import { createBrowserRouter, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login/Login'
import Register from '../pages/Register/Register'
import RegisterChoice from '../pages/Register/RegisterChoice'
import RegisterFam from '../pages/Register/RegisterFam'
import Main from '../pages/Main'
import Profile from '../pages/Profile'
import MyGroups from '../pages/GroupsAndEvents/MyGroups'
import GroupDetails from '../pages/GroupsAndEvents/GroupDetails'
import MyEvents from '../pages/GroupsAndEvents/MyEvents'
import EventDetails from '../pages/GroupsAndEvents/EventDetails'
import EventsNearMe from '../pages/EventsNearMe'
import MyInterests from '../pages/Interests/MyInterests'
import OtherInterests from '../pages/Interests/OtherInterests'

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
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/myGroups',
    element: <MyGroups />,
  },
  {
    path: '/groupDetails',
    element: <GroupDetails />,
  },
  {
    path: '/myEvents',
    element: <MyEvents />,
  },
  {
    path: '/eventDetails',
    element: <EventDetails />,
  },
  {
    path: '/eventsNearMe',
    element: <EventsNearMe />,
  },
  {
    path: '/myInterests',
    element: <MyInterests />,
  },
  {
    path: '/otherInterests',
    element: <OtherInterests />,
  },
])

export default router
