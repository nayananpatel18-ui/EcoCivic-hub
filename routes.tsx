import type { ReactNode } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TreeList from './pages/trees/TreeList';
import AddTree from './pages/trees/AddTree';
import TreeDetail from './pages/trees/TreeDetail';
import AddTreeUpdate from './pages/trees/AddTreeUpdate';
import IssueList from './pages/issues/IssueList';
import ReportIssue from './pages/issues/ReportIssue';
import Awareness from './pages/Awareness';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import Admin from './pages/Admin';

export interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
  requireAuth?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <Home />,
    visible: false,
  },
  {
    name: 'Login',
    path: '/login',
    element: <Login />,
    visible: false,
  },
  {
    name: 'Register',
    path: '/register',
    element: <Register />,
    visible: false,
  },
  {
    name: 'Trees',
    path: '/trees',
    element: <TreeList />,
    visible: false,
  },
  {
    name: 'Add Tree',
    path: '/trees/add',
    element: <AddTree />,
    visible: false,
    requireAuth: true,
  },
  {
    name: 'Tree Detail',
    path: '/trees/:id',
    element: <TreeDetail />,
    visible: false,
  },
  {
    name: 'Add Tree Update',
    path: '/trees/:id/update',
    element: <AddTreeUpdate />,
    visible: false,
    requireAuth: true,
  },
  {
    name: 'Issues',
    path: '/issues',
    element: <IssueList />,
    visible: false,
  },
  {
    name: 'Report Issue',
    path: '/issues/report',
    element: <ReportIssue />,
    visible: false,
    requireAuth: true,
  },
  {
    name: 'Awareness',
    path: '/awareness',
    element: <Awareness />,
    visible: false,
  },
  {
    name: 'Profile',
    path: '/profile',
    element: <Profile />,
    visible: false,
    requireAuth: true,
  },
  {
    name: 'Leaderboard',
    path: '/leaderboard',
    element: <Leaderboard />,
    visible: false,
  },
  {
    name: 'Admin',
    path: '/admin',
    element: <Admin />,
    visible: false,
    requireAuth: true,
  },
];

export default routes;
