import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Home, 
  FileText, 
  Plus, 
  User, 
  LogOut,
  Menu,
  X,
  Users,
  Settings,
  Shield,
  Newspaper,
  Clock
} from 'lucide-react'
import { useState } from 'react'

function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isAdmin = user?.role === 'ADMIN'

  const menuItems = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Basın Bültenleri', icon: FileText, path: '/press-releases' },
    { name: 'Yeni Bülten', icon: Plus, path: '/press-releases/new' },
    { name: 'Profil', icon: User, path: '/profile' },
    ...(isAdmin ? [
      { name: 'Onay Bekleyenler', icon: Clock, path: '/pending-approvals' },
      { name: 'Kullanıcı Yönetimi', icon: Users, path: '/user-management' },
      { name: 'Sistem Ayarları', icon: Settings, path: '/settings' }
    ] : [])
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-gradient-to-b from-blue-900 via-blue-800 to-indigo-900 shadow-2xl">
          <div className="flex h-16 items-center justify-between px-4 bg-gradient-to-r from-blue-800 to-indigo-800 border-b border-blue-700">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-lg">
                <Newspaper className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Basın Bülteni</h1>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="text-blue-200 hover:text-white">
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center px-3 py-3 text-sm font-medium text-blue-100 rounded-lg hover:bg-gradient-to-r hover:from-blue-700 hover:to-indigo-700 hover:text-white transition-all duration-200 group"
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="border-t border-blue-700 p-4 bg-gradient-to-r from-blue-800 to-indigo-800">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <span className="text-sm font-bold text-white">
                    {user?.name?.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-blue-200">{user?.email}</p>
                {isAdmin && (
                  <div className="flex items-center mt-1">
                    <Shield className="h-3 w-3 text-yellow-400 mr-1" />
                    <span className="text-xs text-yellow-400 font-medium">Yönetici</span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-3 flex w-full items-center px-3 py-2 text-sm font-medium text-blue-100 rounded-lg hover:bg-gradient-to-r hover:from-red-600 hover:to-red-700 hover:text-white transition-all duration-200 group"
            >
              <LogOut className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-gradient-to-b from-blue-900 via-blue-800 to-indigo-900 shadow-2xl">
          <div className="flex h-16 items-center px-4 bg-gradient-to-r from-blue-800 to-indigo-800 border-b border-blue-700">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-lg shadow-lg">
                <Newspaper className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Basın Bülteni</h1>
            </div>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center px-3 py-3 text-sm font-medium text-blue-100 rounded-lg hover:bg-gradient-to-r hover:from-blue-700 hover:to-indigo-700 hover:text-white transition-all duration-200 group"
              >
                <item.icon className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="border-t border-blue-700 p-4 bg-gradient-to-r from-blue-800 to-indigo-800">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <span className="text-sm font-bold text-white">
                    {user?.name?.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-blue-200">{user?.email}</p>
                {isAdmin && (
                  <div className="flex items-center mt-1">
                    <Shield className="h-3 w-3 text-yellow-400 mr-1" />
                    <span className="text-xs text-yellow-400 font-medium">Yönetici</span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-3 flex w-full items-center px-3 py-2 text-sm font-medium text-blue-100 rounded-lg hover:bg-gradient-to-r hover:from-red-600 hover:to-red-700 hover:text-white transition-all duration-200 group"
            >
              <LogOut className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Modern, colored, gradient header bar */}
        <div className={`flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 shadow-md relative z-10
          ${isAdmin ? 'bg-gradient-to-r from-indigo-700 via-blue-700 to-purple-700' : 'bg-gradient-to-r from-blue-500 via-blue-400 to-indigo-500'}`}
        >
          {/* Left accent bar */}
          <div className={`absolute left-0 top-0 h-full w-2 rounded-r-xl
            ${isAdmin ? 'bg-gradient-to-b from-yellow-400 via-orange-400 to-pink-500' : 'bg-gradient-to-b from-blue-300 via-blue-400 to-indigo-400'}`}></div>
          <button
            type="button"
            className="lg:hidden -m-2.5 p-2.5 text-white hover:text-yellow-300"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 flex items-center justify-center lg:justify-start">
            <span className={`flex items-center text-lg font-bold tracking-tight
              ${isAdmin ? 'text-yellow-100' : 'text-white'}`}
            >
              {/* Icon next to title */}
              {isAdmin ? (
                <Shield className="h-6 w-6 mr-2 text-yellow-300" />
              ) : (
                <User className="h-6 w-6 mr-2 text-white opacity-80" />
              )}
              {user?.role === 'ADMIN' ? 'Yönetici Paneli' : 'Kullanıcı Paneli'}
            </span>
          </div>
        </div>
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout 