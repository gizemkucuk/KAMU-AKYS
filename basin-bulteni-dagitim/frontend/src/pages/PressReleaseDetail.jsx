import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2, Calendar, User, Send, Check, X } from 'lucide-react'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

function PressReleaseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [pressRelease, setPressRelease] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchPressRelease()
  }, [id])

  const fetchPressRelease = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/press-releases/${id}`)
      setPressRelease(response.data)
    } catch (error) {
      console.error('Bülten yüklenirken hata:', error)
      setError('Bülten yüklenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Bu bülteni silmek istediğinizden emin misiniz?')) {
      try {
        await api.delete(`/press-releases/${id}`)
        navigate('/press-releases')
      } catch (error) {
        console.error('Bülten silinirken hata:', error)
      }
    }
  }

  const handleSubmitForApproval = async () => {
    try {
      setActionLoading(true)
      await api.post(`/press-releases/${id}/submit`)
      await fetchPressRelease()
    } catch (error) {
      console.error('Onaya sunma hatası:', error)
      alert('Onaya sunma işlemi başarısız oldu')
    } finally {
      setActionLoading(false)
    }
  }

  const handleApprove = async () => {
    try {
      setActionLoading(true)
      await api.post(`/press-releases/${id}/approve`)
      await fetchPressRelease()
    } catch (error) {
      console.error('Onaylama hatası:', error)
      alert('Onaylama işlemi başarısız oldu')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    try {
      setActionLoading(true)
      await api.post(`/press-releases/${id}/reject`)
      await fetchPressRelease()
    } catch (error) {
      console.error('Reddetme hatası:', error)
      alert('Reddetme işlemi başarısız oldu')
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      DRAFT: { color: 'bg-yellow-100 text-yellow-800', text: 'Taslak' },
      PENDING: { color: 'bg-blue-100 text-blue-800', text: 'Onay Bekliyor' },
      PUBLISHED: { color: 'bg-green-100 text-green-800', text: 'Yayında' },
      REJECTED: { color: 'bg-red-100 text-red-800', text: 'Reddedildi' },
      ARCHIVED: { color: 'bg-gray-100 text-gray-800', text: 'Arşivlendi' }
    }
    
    const config = statusConfig[status] || statusConfig.DRAFT
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    )
  }

  const canSubmitForApproval = () => {
    return pressRelease && pressRelease.status === 'DRAFT' && user?.role === 'USER'
  }

  const canApprove = () => {
    return pressRelease && pressRelease.status === 'PENDING' && user?.role === 'ADMIN'
  }

  const canReject = () => {
    return pressRelease && pressRelease.status === 'PENDING' && user?.role === 'ADMIN'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => navigate('/press-releases')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Geri Dön
        </button>
      </div>
    )
  }

  if (!pressRelease) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{pressRelease.title}</h1>
          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              {pressRelease.createdBy}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(pressRelease.createdAt).toLocaleDateString('tr-TR')}
            </div>
            <div>
              {getStatusBadge(pressRelease.status)}
            </div>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          {canSubmitForApproval() && (
            <button
              onClick={handleSubmitForApproval}
              disabled={actionLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <Send className="h-4 w-4 mr-2" />
              {actionLoading ? 'Gönderiliyor...' : 'Onaya Sun'}
            </button>
          )}
          {canApprove() && (
            <button
              onClick={handleApprove}
              disabled={actionLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              <Check className="h-4 w-4 mr-2" />
              {actionLoading ? 'Onaylanıyor...' : 'Onayla'}
            </button>
          )}
          {canReject() && (
            <button
              onClick={handleReject}
              disabled={actionLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              <X className="h-4 w-4 mr-2" />
              {actionLoading ? 'Reddediliyor...' : 'Reddet'}
            </button>
          )}
          <button
            onClick={() => navigate(`/press-releases/${id}/edit`)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Edit className="h-4 w-4 mr-2" />
            Düzenle
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Sil
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">İçerik</h2>
        </div>
        <div className="px-6 py-4">
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {pressRelease.content}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Bülten Bilgileri</h2>
        </div>
        <div className="px-6 py-4">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Başlık</dt>
              <dd className="mt-1 text-sm text-gray-900">{pressRelease.title}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Durum</dt>
              <dd className="mt-1 text-sm text-gray-900">{getStatusBadge(pressRelease.status)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Oluşturan</dt>
              <dd className="mt-1 text-sm text-gray-900">{pressRelease.createdBy}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Oluşturulma Tarihi</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(pressRelease.createdAt).toLocaleString('tr-TR')}
              </dd>
            </div>
            {pressRelease.updatedAt && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Son Güncelleme</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(pressRelease.updatedAt).toLocaleString('tr-TR')}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className="flex justify-start">
        <button
          onClick={() => navigate('/press-releases')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Listeye Dön
        </button>
      </div>
    </div>
  )
}

export default PressReleaseDetail 