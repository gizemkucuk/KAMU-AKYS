import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, Plus, Edit, Trash2, Eye, FileText, Sparkles, TrendingUp, Calendar, User, Filter } from 'lucide-react'
import api from '../services/api'

function PressReleaseList() {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const onlyMine = queryParams.get('onlyMine') === 'true'
  const [pressReleases, setPressReleases] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    fetchPressReleases()
  }, [currentPage, searchTerm, statusFilter, onlyMine])

  const fetchPressReleases = async () => {
    try {
      setLoading(true)
      const params = {
        page: currentPage,
        size: 10,
        ...(searchTerm && { title: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
        ...(onlyMine && { onlyMine: true })
      }
      
      const response = await api.get('/press-releases', { params })
      setPressReleases(response.data.content)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error('Bültenler yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bu bülteni silmek istediğinizden emin misiniz?')) {
      try {
        await api.delete(`/press-releases/${id}`)
        fetchPressReleases()
      } catch (error) {
        console.error('Bülten silinirken hata:', error)
      }
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      DRAFT: { 
        color: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200', 
        text: 'Taslak',
        icon: '📝'
      },
      PENDING: { 
        color: 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200', 
        text: 'Onay Bekliyor',
        icon: '⏳'
      },
      PUBLISHED: { 
        color: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200', 
        text: 'Yayında',
        icon: '✅'
      },
      REJECTED: { 
        color: 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200', 
        text: 'Reddedildi',
        icon: '❌'
      },
      ARCHIVED: { 
        color: 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200', 
        text: 'Arşivlendi',
        icon: '📁'
      }
    }
    
    const config = statusConfig[status] || statusConfig.DRAFT
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
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
          <p className="text-gray-600 font-medium">Bültenler yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Basın Bültenleri
                  </h1>
                  <p className="text-gray-600 mt-2 flex items-center">
                    <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
                    Tüm basın bültenlerinizi görüntüleyin ve yönetin.
                  </p>
                </div>
              </div>
              <Link
                to="/press-releases/new"
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-lg transform hover:scale-105"
              >
                <Plus className="h-5 w-5 mr-2" />
                Yeni Bülten
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Bülten</p>
                <p className="text-2xl font-bold text-gray-900">{pressReleases.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Yayında</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pressReleases.filter(pr => pr.status === 'PUBLISHED').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Taslak</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pressReleases.filter(pr => pr.status === 'DRAFT').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aktif Kullanıcı</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 mr-2 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">Filtreler</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Arama
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-gray-300"
                  placeholder="Başlığa göre ara..."
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Durum
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-gray-300"
              >
                <option value="">Tümü</option>
                <option value="DRAFT">Taslak</option>
                <option value="PENDING">Onay Bekliyor</option>
                <option value="PUBLISHED">Yayında</option>
                <option value="REJECTED">Reddedildi</option>
                <option value="ARCHIVED">Arşivlendi</option>
              </select>
            </div>
          </div>
        </div>

        {/* Press Releases List */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Bülten Listesi
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {pressReleases.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="bg-gray-50 rounded-xl p-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-medium">Henüz basın bülteni bulunmuyor.</p>
                  <p className="text-gray-400 mt-2">İlk bülteninizi oluşturmak için "Yeni Bülten" butonuna tıklayın.</p>
                </div>
              </div>
            ) : (
              pressReleases.map((pressRelease) => (
                <div key={pressRelease.id} className="px-6 py-6 hover:bg-gray-50 transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 truncate pr-4">
                          {pressRelease.title}
                        </h3>
                        <div className="flex-shrink-0">
                          {getStatusBadge(pressRelease.status)}
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          <span>{pressRelease.createdBy}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{new Date(pressRelease.createdAt).toLocaleDateString('tr-TR')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-6 flex-shrink-0 flex space-x-3">
                      <Link
                        to={`/press-releases/${pressRelease.id}`}
                        className="inline-flex items-center p-2 border border-transparent rounded-lg text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                        title="Görüntüle"
                      >
                        <Eye className="h-5 w-5" />
                      </Link>
                      <Link
                        to={`/press-releases/${pressRelease.id}/edit`}
                        className="inline-flex items-center p-2 border border-transparent rounded-lg text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                        title="Düzenle"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(pressRelease.id)}
                        className="inline-flex items-center p-2 border border-transparent rounded-lg text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                        title="Sil"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-xl shadow-lg px-6 py-4 mt-8">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-all duration-200"
                >
                  Önceki
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-all duration-200"
                >
                  Sonraki
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Sayfa <span className="font-medium">{currentPage + 1}</span> / <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                      disabled={currentPage === 0}
                      className="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-all duration-200"
                    >
                      Önceki
                    </button>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage >= totalPages - 1}
                      className="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-all duration-200"
                    >
                      Sonraki
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PressReleaseList 