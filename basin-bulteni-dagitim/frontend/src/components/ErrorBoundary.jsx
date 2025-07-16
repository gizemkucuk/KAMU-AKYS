import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Hataları loglamak için buraya ekleme yapılabilir
    // örn: logErrorToService(error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Bir hata oluştu</h1>
          <p className="mb-4">Beklenmeyen bir hata oluştu. Lütfen sayfayı yeniden yükleyin.</p>
          <button onClick={this.handleReload} className="px-4 py-2 bg-red-600 text-white rounded">Yeniden Yükle</button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary 