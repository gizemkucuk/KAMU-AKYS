import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { FileText, Users, TrendingUp, Clock, Shield, Settings, BarChart3, AlertTriangle, CheckCircle, XCircle, Archive, Crown, UserPlus, UserMinus, Eye, Edit, Trash2 } from 'lucide-react'
import api from '../services/api'

function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [recentUsers, setRecentUsers] = useState([])
  const [recentPressReleases, setRecentPressReleases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/summary')
        const data = response.data
        setStats(data)
        setRecentUsers(data.recentUsers)
        setRecentPressReleases(data.recentPressReleases)
      } catch (error) {
        console.error('İstatistikler yüklenirken hata:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [user])

  // Quick Management Actions
  const handleQuickAction = (action) => {
    switch (action) {
      case 'addUser':
        navigate('/user-management')
        break
      case 'pendingApprovals':
        navigate('/press-releases?status=PENDING')
        break
      case 'systemReport':
        navigate('/system-report')
        break
      case 'createPressRelease':
        navigate('/press-releases/new')
        break
      case 'viewPressReleases':
        navigate('/press-releases?onlyMine=true')
        break
      default:
        break
    }
  }

  // Stat card click handler
  const handleStatCardClick = (name) => {
    switch (name) {
      case 'Toplam Bülten':
        navigate('/press-releases')
        break
      case 'Yayınlanan Bülten':
        navigate('/press-releases?status=PUBLISHED')
        break
      case 'Taslak Bülten':
        navigate('/press-releases?status=DRAFT')
        break
      case 'Reddedilen Bülten':
        navigate('/press-releases?status=REJECTED')
        break
      case 'Toplam Kullanıcı':
        navigate('/user-management')
        break
      case 'Aktif Kullanıcı':
        navigate('/user-management?status=active')
        break
      case 'Onay Bekleyen':
        navigate('/press-releases?status=PENDING')
        break
      case 'Sistem Durumu':
        navigate('/system-report')
        break
      default:
        break
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          <p className="text-gray-600 font-medium">Dashboard yükleniyor...</p>
        </div>
      </div>
    )
  }

  const isAdmin = user?.role === 'ADMIN'

  const statCards = [
    {
      name: 'Toplam Bülten',
      value: stats?.totalPressReleases,
      icon: FileText,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      change: '+12%',
      changeType: 'positive'
    },
    {
      name: 'Yayınlanan Bülten',
      value: stats?.publishedPressReleases,
      icon: CheckCircle,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      change: '+8%',
      changeType: 'positive'
    },
    {
      name: 'Taslak Bülten',
      value: stats?.draftPressReleases,
      icon: Clock,
      color: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      change: '+4%',
      changeType: 'neutral'
    },
    {
      name: 'Reddedilen Bülten',
      value: stats?.rejectedPressReleases,
      icon: XCircle,
      color: 'bg-gradient-to-r from-red-500 to-red-600',
      change: '-2%',
      changeType: 'negative'
    },
    ...(isAdmin ? [
      {
        name: 'Toplam Kullanıcı',
        value: stats?.totalUsers,
        icon: Users,
        color: 'bg-gradient-to-r from-purple-500 to-purple-600',
        change: '+3',
        changeType: 'positive'
      },
      {
        name: 'Aktif Kullanıcı',
        value: stats?.activeUsers,
        icon: UserPlus,
        color: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
        change: '+2',
        changeType: 'positive'
      },
      {
        name: 'Onay Bekleyen',
        value: stats?.pendingApprovals,
        icon: AlertTriangle,
        color: 'bg-gradient-to-r from-orange-500 to-orange-600',
        change: '+1',
        changeType: 'neutral'
      },
      {
        name: 'Sistem Durumu',
        value: stats?.systemHealth,
        icon: Shield,
        color: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
        change: 'Good',
        changeType: 'positive'
      }
    ] : [])
  ]

  const getStatusBadge = (status) => {
    const statusConfig = {
      PUBLISHED: { color: 'bg-green-100 text-green-800', text: 'Yayında', icon: '✅' },
      DRAFT: { color: 'bg-yellow-100 text-yellow-800', text: 'Taslak', icon: '📝' },
      PENDING: { color: 'bg-orange-100 text-orange-800', text: 'Onay Bekliyor', icon: '⏳' },
      REJECTED: { color: 'bg-red-100 text-red-800', text: 'Reddedildi', icon: '❌' }
    }
    
    const config = statusConfig[status] || statusConfig.DRAFT
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <span className="mr-1">{config.icon}</span>
        {config.text}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
                  {isAdmin ? <Crown className="h-8 w-8 text-white" /> : <FileText className="h-8 w-8 text-white" />}
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {isAdmin ? 'Yönetici Paneli' : 'Hoş Geldiniz, ' + user?.name}
                  </h1>
                  <p className="text-gray-600 mt-2 flex items-center">
                    {isAdmin ? (
                      <>
                        <Shield className="h-4 w-4 mr-2 text-green-500" />
                        Sistem yönetimi ve kullanıcı kontrolü
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2 text-blue-500" />
                        Basın bülteni dağıtım sisteminize hoş geldiniz
                      </>
                    )}
                  </p>
                </div>
              </div>
              {isAdmin && (
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <Shield className="h-4 w-4 mr-1" />
                    Yönetici
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => (
            <div
              key={stat.name}
              className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 transition-all duration-200 cursor-pointer hover:shadow-2xl hover:-translate-y-1 hover:border-blue-700"
              onClick={() => handleStatCardClick(stat.name)}
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}> 
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`text-xs font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 
                  stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Admin Specific Sections */}
        {isAdmin && (
          <>
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Settings className="h-5 w-5 mr-2 text-blue-500" />
                Hızlı Yönetim İşlemleri
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => handleQuickAction('addUser')}
                  className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                >
                  <UserPlus className="h-5 w-5 mr-3 text-blue-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Kullanıcı Ekle</p>
                    <p className="text-sm text-gray-500">Yeni kullanıcı oluştur</p>
                  </div>
                </button>
                <button 
                  onClick={() => handleQuickAction('pendingApprovals')}
                  className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all duration-200 cursor-pointer"
                >
                  <Clock className="h-5 w-5 mr-3 text-green-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Onay Bekleyenler</p>
                    <p className="text-sm text-gray-500">Bülten onaylarını yönet</p>
                  </div>
                </button>
                <button 
                  onClick={() => handleQuickAction('systemReport')}
                  className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 cursor-pointer"
                >
                  <BarChart3 className="h-5 w-5 mr-3 text-purple-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Sistem Raporu</p>
                    <p className="text-sm text-gray-500">Detaylı analiz görüntüle</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-purple-500" />
                Son Kullanıcılar
              </h3>
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200">
                    <div className="flex items-center space-x-4">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <Users className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'ADMIN' ? '👑 Yönetici' : '👤 Kullanıcı'}
                      </span>
                      <div className="flex space-x-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Press Releases */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-500" />
                Son Bültenler
              </h3>
              <div className="space-y-4">
                {recentPressReleases.map((pressRelease) => (
                  <div key={pressRelease.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{pressRelease.title}</p>
                        <p className="text-sm text-gray-500">{pressRelease.author} • {pressRelease.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(pressRelease.status)}
                      <div className="flex space-x-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Regular User Actions */}
        {!isAdmin && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => handleQuickAction('createPressRelease')}
                className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
              >
                <FileText className="h-5 w-5 mr-3 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Yeni Bülten Oluştur</p>
                  <p className="text-sm text-gray-500">Yeni bir basın bülteni oluşturun</p>
                </div>
              </button>
              <button 
                onClick={() => handleQuickAction('viewPressReleases')}
                className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all duration-200 cursor-pointer"
              >
                <TrendingUp className="h-5 w-5 mr-3 text-green-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Bültenlerimi Görüntüle</p>
                  <p className="text-sm text-gray-500">Tüm bültenlerinizi yönetin</p>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard 