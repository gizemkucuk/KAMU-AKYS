import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Users, Search, UserPlus, Edit, Trash2, Eye, Shield, Crown, User, Filter, MoreVertical, Mail, Calendar, Activity, FileText } from 'lucide-react'
import api from '../services/api'

function UserManagement() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserModal, setShowUserModal] = useState(false)

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      // Yönetici değilse dashboard'a yönlendir
      window.location.href = '/'
      return
    }
    fetchUsers()
  }, [user])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      console.log('Fetching users...')
      const response = await api.get('/users')
      console.log('Users response:', response.data)
      setUsers(response.data)
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata:', error)
      console.error('Error details:', error.response?.data)
      console.error('Error status:', error.response?.status)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      try {
        // API çağrısı (isteğe bağlı: silme endpointi eklenebilir)
        setUsers(users.filter(user => user.id !== userId))
      } catch (error) {
        console.error('Kullanıcı silinirken hata:', error)
      }
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}/role`, { role: newRole })
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ))
    } catch (error) {
      console.error('Rol değiştirilirken hata:', error)
    }
  }

  const getRoleBadge = (role) => {
    const roleConfig = {
      ADMIN: { color: 'bg-purple-100 text-purple-800', text: 'Yönetici', icon: '👑' },
      USER: { color: 'bg-blue-100 text-blue-800', text: 'Kullanıcı', icon: '👤' }
    }
    
    const config = roleConfig[role] || roleConfig.USER
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <span className="mr-1">{config.icon}</span>
        {config.text}
      </span>
    )
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', text: 'Aktif', icon: '✅' },
      inactive: { color: 'bg-gray-100 text-gray-800', text: 'Pasif', icon: '⏸️' }
    }
    
    const config = statusConfig[status] || statusConfig.inactive
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <span className="mr-1">{config.icon}</span>
        {config.text}
      </span>
    )
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = !roleFilter || user.role === roleFilter
    const matchesStatus = !statusFilter || user.status === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          <p className="text-gray-600 font-medium">Kullanıcılar yükleniyor...</p>
        </div>
      </div>
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
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Kullanıcı Yönetimi
                  </h1>
                  <p className="text-gray-600 mt-2 flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-green-500" />
                    Sistem kullanıcılarını yönetin ve izleyin
                  </p>
                </div>
              </div>
              <button className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 hover:shadow-lg transform hover:scale-105">
                <UserPlus className="h-5 w-5 mr-2" />
                Yeni Kullanıcı
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Kullanıcı</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aktif Kullanıcı</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Crown className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Yönetici</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'ADMIN').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg">
                <User className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Normal Kullanıcı</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'USER').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* User Table */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Ara: isim, email, kullanıcı adı..."
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <Filter className="h-5 w-5 text-gray-400 ml-2" />
              <select
                className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none"
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
              >
                <option value="">Tüm Roller</option>
                <option value="ADMIN">Yönetici</option>
                <option value="USER">Kullanıcı</option>
              </select>
              <select
                className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="">Tüm Durumlar</option>
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad Soyad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kullanıcı Adı</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map(u => (
                  <tr key={u.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{u.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{u.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getRoleBadge(u.role)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(u.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                      <select
                        className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none"
                        value={u.role}
                        onChange={e => handleRoleChange(u.id, e.target.value)}
                      >
                        <option value="ADMIN">Yönetici</option>
                        <option value="USER">Kullanıcı</option>
                      </select>
                      {/*
                      <button
                        className="inline-flex items-center px-2 py-1 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-100"
                        onClick={() => setSelectedUser(u)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Görüntüle
                      </button>
                      <button
                        className="inline-flex items-center px-2 py-1 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserModal(true)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Düzenle
                      </button>
                      <button
                        className="inline-flex items-center px-2 py-1 border border-red-300 rounded text-xs text-red-700 hover:bg-red-100"
                        onClick={() => handleDeleteUser(u.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Sil
                      </button>
                      */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserManagement 