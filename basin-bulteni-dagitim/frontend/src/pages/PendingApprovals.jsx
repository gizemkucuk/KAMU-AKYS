import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Eye, Check, X, Clock, FileText, Filter } from 'lucide-react'
import api from '../services/api'

function PendingApprovals() {
  const [pendingReleases, setPendingReleases] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [actionLoading, setActionLoading] = useState({})

  useEffect(() => {
    fetchPendingReleases()
  }, [currentPage, searchTerm])

  const fetchPendingReleases = async () => {
    try {
      setLoading(true)
      const params = {
        page: currentPage,
        size: 10
      }
      
      const response = await api.get('/press-releases/pending', { params })
      setPendingReleases(response.data.content)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error('Onay bekleyen bültenler yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    try {
      setActionLoading(prev => ({ ...prev, [id]: true }))
      await api.post(`/press-releases/${id}/approve`)
      await fetchPendingReleases()
    } catch (error) {
      console.error('Onaylama hatası:', error)
      alert('Onaylama işlemi başarısız oldu')
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }))
    }
  }

  const handleReject = async (id) => {
    try {
      setActionLoading(prev => ({ ...prev, [id]: true }))
      await api.post(`/press-releases/${id}/reject`)
      await fetchPendingReleases()
    } catch (error) {
      console.error('Reddetme hatası:', error)
      alert('Reddetme işlemi başarısız oldu')
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          <p className="text-gray-600 font-medium">Onay bekleyen bültenler yükleniyor...</p>
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
                <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-xl">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Onay Bekleyen Bültenler
                  </h1>
                  <p className="text-gray-600 mt-2 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-orange-500" />
                    Yayınlanması için onay bekleyen basın bültenlerini yönetin.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500 mb-8">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Onay Bekleyen</p>
              <p className="text-2xl font-bold text-gray-900">{pendingReleases.length}</p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 mr-2 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">Arama</h3>
          </div>
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Başlığa Göre Ara
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-all duration-200 hover:border-gray-300"
                placeholder="Bülten başlığına göre ara..."
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Pending Releases List */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Onay Bekleyen Bültenler
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {pendingReleases.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="bg-gray-50 rounded-xl p-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-medium">Onay bekleyen bülten bulunmuyor.</p>
                  <p className="text-gray-400 mt-2">Tüm bültenler onaylandı veya reddedildi.</p>
                </div>
              </div>
            ) : (
              pendingReleases.map((pressRelease) => (
                <div key={pressRelease.id} className="px-6 py-6 hover:bg-gray-50 transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 truncate pr-4">
                          {pressRelease.title}
                        </h3>
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200">
                            <span className="mr-1">⏳</span>
                            Onay Bekliyor
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          <span>{pressRelease.createdBy}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{new Date(pressRelease.createdAt).toLocaleDateString('tr-TR')}</span>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {pressRelease.content.substring(0, 150)}...
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
                      <button
                        onClick={() => handleApprove(pressRelease.id)}
                        disabled={actionLoading[pressRelease.id]}
                        className="inline-flex items-center p-2 border border-transparent rounded-lg text-green-600 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 disabled:opacity-50"
                        title="Onayla"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleReject(pressRelease.id)}
                        disabled={actionLoading[pressRelease.id]}
                        className="inline-flex items-center p-2 border border-transparent rounded-lg text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 disabled:opacity-50"
                        title="Reddet"
                      >
                        <X className="h-5 w-5" />
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

export default PendingApprovals 