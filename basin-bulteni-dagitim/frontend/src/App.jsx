import { Outlet, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import PressReleaseList from './pages/PressReleaseList'
import PressReleaseForm from './pages/PressReleaseForm'
import PressReleaseDetail from './pages/PressReleaseDetail'
import Profile from './pages/Profile'
import UserManagement from './pages/UserManagement'
import SystemReport from './pages/SystemReport'
import PendingApprovals from './pages/PendingApprovals'
import Layout from './components/Layout'

function PrivateRoute() {
  const { user } = useAuth()
  return user ? <Layout /> : <Navigate to="/login" />
}

export const routes = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: <PrivateRoute />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'press-releases', element: <PressReleaseList /> },
      { path: 'press-releases/new', element: <PressReleaseForm /> },
      { path: 'press-releases/:id', element: <PressReleaseDetail /> },
      { path: 'press-releases/:id/edit', element: <PressReleaseForm /> },
      { path: 'profile', element: <Profile /> },
      { path: 'user-management', element: <UserManagement /> },
      { path: 'system-report', element: <SystemReport /> },
      { path: 'pending-approvals', element: <PendingApprovals /> },
    ],
  },
]

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Outlet />
      </div>
    </AuthProvider>
  )
}

export default App 