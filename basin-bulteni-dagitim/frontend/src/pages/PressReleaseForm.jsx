import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, ArrowLeft, FileText, Sparkles, Calendar, User } from 'lucide-react'
import api from '../services/api'

function PressReleaseForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  })

  useEffect(() => {
    if (id && id !== 'new') {
      fetchPressRelease()
    }
  }, [id])

  const fetchPressRelease = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/press-releases/${id}`)
      const { title, content } = response.data
      setFormData({ title, content })
    } catch (error) {
      console.error('Bülten yüklenirken hata:', error)
      setError('Bülten yüklenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      if (id && id !== 'new') {
        await api.put(`/press-releases/${id}`, formData)
      } else {
        await api.post('/press-releases', formData)
      }
      navigate('/press-releases')
    } catch (error) {
      setError(error.response?.data?.message || 'Bülten kaydedilirken bir hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          <p className="text-gray-600 font-medium">Bülten yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    {id && id !== 'new' ? 'Bülten Düzenle' : 'Yeni Bülten Oluştur'}
                  </h1>
                  <p className="text-gray-600 mt-2 flex items-center">
                    <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
                    {id && id !== 'new' ? 'Basın bültenini düzenleyin ve güncelleyin.' : 'Yeni bir basın bülteni oluşturun ve yayınlayın.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/press-releases')}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-lg"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Geri Dön
              </button>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Bülten Bilgileri
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Title Field */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 flex items-center">
                <FileText className="h-4 w-4 mr-2 text-blue-500" />
                Bülten Başlığı
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="block w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg transition-all duration-200 hover:border-gray-300"
                  placeholder="Bülten başlığını girin..."
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Sparkles className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Content Field */}
            <div className="space-y-2">
              <label htmlFor="content" className="block text-sm font-semibold text-gray-700 flex items-center">
                <FileText className="h-4 w-4 mr-2 text-purple-500" />
                Bülten İçeriği
              </label>
              <div className="relative">
                <textarea
                  id="content"
                  name="content"
                  rows={16}
                  required
                  value={formData.content}
                  onChange={handleChange}
                  className="block w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-base transition-all duration-200 hover:border-gray-300 resize-none"
                  placeholder="Bülten içeriğini detaylı bir şekilde girin..."
                />
                <div className="absolute top-4 right-4 pointer-events-none">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-2 py-1 rounded-full">
                    {formData.content.length} karakter
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/press-releases')}
                className="px-8 py-3 border-2 border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 hover:shadow-lg"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-8 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg transform hover:scale-105"
              >
                <Save className="h-5 w-5 mr-2" />
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </form>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Otomatik Kaydetme</h3>
                <p className="text-sm text-gray-600">Değişiklikleriniz otomatik olarak kaydedilir</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Kullanıcı Dostu</h3>
                <p className="text-sm text-gray-600">Kolay ve hızlı bülten oluşturma</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Sparkles className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Modern Tasarım</h3>
                <p className="text-sm text-gray-600">Göz alıcı ve profesyonel görünüm</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PressReleaseForm 