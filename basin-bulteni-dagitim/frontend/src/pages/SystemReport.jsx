import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  BarChart3, 
  Users, 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Calendar, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  Download,
  RefreshCw,
  Eye,
  Filter
} from 'lucide-react'
import api from '../services/api'

function SystemReport() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [reportData, setReportData] = useState({
    userStats: {
      totalUsers: 0,
      activeUsers: 0,
      newUsersThisMonth: 0,
      adminUsers: 0,
      userGrowth: 0
    },
    pressReleaseStats: {
      totalPressReleases: 0,
      published: 0,
      draft: 0,
      pending: 0,
      rejected: 0,
      thisMonth: 0,
      lastMonth: 0,
      growth: 0
    },
    systemHealth: {
      status: 'Good',
      uptime: '99.9%',
      lastBackup: '2024-01-15',
      diskUsage: '45%',
      memoryUsage: '60%',
      cpuUsage: '30%'
    },
    recentActivity: [],
    topUsers: [],
    topPressReleases: []
  })

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      window.location.href = '/'
      return
    }
    fetchReportData()
  }, [user])

  const fetchReportData = async () => {
    try {
      setLoading(true)
      // Gerçek uygulamada API'den gelecek
      const mockData = {
        userStats: {
          totalUsers: 15,
          activeUsers: 12,
          newUsersThisMonth: 3,
          adminUsers: 2,
          userGrowth: 25
        },
        pressReleaseStats: {
          totalPressReleases: 45,
          published: 28,
          draft: 8,
          pending: 5,
          rejected: 4,
          thisMonth: 12,
          lastMonth: 8,
          growth: 50
        },
        systemHealth: {
          status: 'Good',
          uptime: '99.9%',
          lastBackup: '2024-01-15',
          diskUsage: '45%',
          memoryUsage: '60%',
          cpuUsage: '30%'
        },
        recentActivity: [
          { id: 1, type: 'user_created', message: 'Yeni kullanıcı oluşturuldu: dogukanyavuz', timestamp: '2024-01-15 14:30', user: 'gizemkucuk' },
          { id: 2, type: 'press_release_published', message: 'Bülten yayınlandı: Yeni Teknoloji Lansmanı', timestamp: '2024-01-15 13:45', user: 'ahmetyilmaz' },
          { id: 3, type: 'role_changed', message: 'Kullanıcı rolü değiştirildi: fatmademir -> USER', timestamp: '2024-01-15 12:20', user: 'gizemkucuk' },
          { id: 4, type: 'press_release_created', message: 'Yeni bülten oluşturuldu: Çevre Projesi', timestamp: '2024-01-15 11:15', user: 'mehmetkaya' },
          { id: 5, type: 'login', message: 'Kullanıcı giriş yaptı: ayseozkan', timestamp: '2024-01-15 10:30', user: 'ayseozkan' }
        ],
        topUsers: [
          { id: 1, name: 'gizemkucuk', email: 'gizemkck61@gmail.com', pressReleaseCount: 8, lastActivity: '2024-01-15 14:30', role: 'ADMIN' },
          { id: 2, name: 'ahmetyilmaz', email: 'ahmet@example.com', pressReleaseCount: 5, lastActivity: '2024-01-15 13:45', role: 'USER' },
          { id: 3, name: 'fatmademir', email: 'fatma@example.com', pressReleaseCount: 3, lastActivity: '2024-01-15 12:20', role: 'USER' },
          { id: 4, name: 'mehmetkaya', email: 'mehmet@example.com', pressReleaseCount: 2, lastActivity: '2024-01-15 11:15', role: 'USER' },
          { id: 5, name: 'ayseozkan', email: 'ayse@example.com', pressReleaseCount: 1, lastActivity: '2024-01-15 10:30', role: 'USER' }
        ],
        topPressReleases: [
          { id: 1, title: 'Yeni Teknoloji Lansmanı', views: 1250, status: 'PUBLISHED', author: 'ahmetyilmaz', createdAt: '2024-01-15' },
          { id: 2, title: 'Şirket Birleşmesi Duyurusu', views: 890, status: 'DRAFT', author: 'fatmademir', createdAt: '2024-01-14' },
          { id: 3, title: 'Çevre Projesi Başlatıldı', views: 650, status: 'PENDING', author: 'mehmetkaya', createdAt: '2024-01-13' },
          { id: 4, title: 'Yıllık Rapor Açıklandı', views: 420, status: 'PUBLISHED', author: 'gizemkucuk', createdAt: '2024-01-12' },
          { id: 5, title: 'Yeni Ürün Tanıtımı', views: 380, status: 'PUBLISHED', author: 'ayseozkan', createdAt: '2024-01-11' }
        ]
      }
      setReportData(mockData)
    } catch (error) {
      console.error('Rapor verileri yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type) => {
    const icons = {
      user_created: Users,
      press_release_published: FileText,
      role_changed: Shield,
      press_release_created: FileText,
      login: Activity
    }
    return icons[type] || Activity
  }

  const getActivityColor = (type) => {
    const colors = {
      user_created: 'text-blue-600',
      press_release_published: 'text-green-600',
      role_changed: 'text-purple-600',
      press_release_created: 'text-orange-600',
      login: 'text-gray-600'
    }
    return colors[type] || 'text-gray-600'
  }

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          <p className="text-gray-600 font-medium">Sistem raporu yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Sistem Raporu
                  </h1>
                  <p className="text-gray-600 mt-2 flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-green-500" />
                    Detaylı sistem analizi ve performans raporu
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={fetchReportData}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Yenile
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                  <Download className="h-4 w-4 mr-2" />
                  PDF İndir
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Kullanıcı</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.userStats.totalUsers}</p>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{reportData.userStats.userGrowth}% bu ay
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Bülten</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.pressReleaseStats.totalPressReleases}</p>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{reportData.pressReleaseStats.growth}% bu ay
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sistem Durumu</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.systemHealth.status}</p>
                <p className="text-xs text-green-600">Uptime: {reportData.systemHealth.uptime}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aktif Kullanıcı</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.userStats.activeUsers}</p>
                <p className="text-xs text-gray-600">Son 24 saat</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* User Statistics */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-500" />
              Kullanıcı İstatistikleri
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Aktif Kullanıcılar</span>
                <span className="font-semibold text-green-600">{reportData.userStats.activeUsers}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Bu Ay Yeni Kullanıcı</span>
                <span className="font-semibold text-blue-600">{reportData.userStats.newUsersThisMonth}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Yönetici Sayısı</span>
                <span className="font-semibold text-purple-600">{reportData.userStats.adminUsers}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Büyüme Oranı</span>
                <span className="font-semibold text-green-600">+{reportData.userStats.userGrowth}%</span>
              </div>
            </div>
          </div>

          {/* Press Release Statistics */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-green-500" />
              Bülten İstatistikleri
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Yayınlanan</span>
                <span className="font-semibold text-green-600">{reportData.pressReleaseStats.published}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Taslak</span>
                <span className="font-semibold text-yellow-600">{reportData.pressReleaseStats.draft}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Onay Bekleyen</span>
                <span className="font-semibold text-orange-600">{reportData.pressReleaseStats.pending}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Bu Ay</span>
                <span className="font-semibold text-blue-600">{reportData.pressReleaseStats.thisMonth}</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-green-500" />
            Sistem Sağlığı
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Disk Kullanımı</span>
                <span className="text-sm font-medium text-gray-900">{reportData.systemHealth.diskUsage}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: reportData.systemHealth.diskUsage }}></div>
              </div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Bellek Kullanımı</span>
                <span className="text-sm font-medium text-gray-900">{reportData.systemHealth.memoryUsage}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: reportData.systemHealth.memoryUsage }}></div>
              </div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">CPU Kullanımı</span>
                <span className="text-sm font-medium text-gray-900">{reportData.systemHealth.cpuUsage}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: reportData.systemHealth.cpuUsage }}></div>
              </div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Son Yedekleme</span>
                <span className="text-sm font-medium text-gray-900">{reportData.systemHealth.lastBackup}</span>
              </div>
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span className="text-xs">Güncel</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity and Top Users */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-500" />
              Son Aktiviteler
            </h3>
            <div className="space-y-3">
              {reportData.recentActivity.map((activity) => {
                const IconComponent = getActivityIcon(activity.type)
                return (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                    <div className={`p-2 rounded-lg bg-gray-100 ${getActivityColor(activity.type)}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.timestamp} • {activity.user}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Top Users */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-purple-500" />
              En Aktif Kullanıcılar
            </h3>
            <div className="space-y-3">
              {reportData.topUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Users className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user.pressReleaseCount} bülten</p>
                    <p className="text-xs text-gray-500">{user.lastActivity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Press Releases */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-green-500" />
            En Popüler Bültenler
          </h3>
          <div className="space-y-3">
            {reportData.topPressReleases.map((pressRelease) => (
              <div key={pressRelease.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{pressRelease.title}</p>
                    <p className="text-sm text-gray-500">{pressRelease.author} • {pressRelease.createdAt}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {getStatusBadge(pressRelease.status)}
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{pressRelease.views} görüntüleme</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemReport 