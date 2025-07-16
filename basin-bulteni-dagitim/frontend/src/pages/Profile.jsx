import { useAuth } from '../contexts/AuthContext'
import { User, Mail, Shield } from 'lucide-react'

function Profile() {
  const { user } = useAuth()

  const getRoleText = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'Yönetici'
      case 'USER':
        return 'Kullanıcı'
      default:
        return role
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800'
      case 'USER':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profil</h1>
        <p className="mt-1 text-sm text-gray-500">
          Hesap bilgilerinizi görüntüleyin.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Hesap Bilgileri</h2>
        </div>
        <div className="px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="h-16 w-16 rounded-full bg-primary-500 flex items-center justify-center">
                <span className="text-xl font-medium text-white">
                  {user?.name?.charAt(0)}
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Ad Soyad
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{user?.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Rol
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user?.role)}`}>
                      {getRoleText(user?.role)}
                    </span>
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sistem Bilgileri bölümü kaldırıldı */}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Bilgi
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Bu sistem, kamu kurumlarının basın bültenlerini yönetmek ve dağıtmak için tasarlanmıştır. 
                Güvenli ve kullanıcı dostu bir arayüz sunar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile 