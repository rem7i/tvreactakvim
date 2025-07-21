import { Component } from 'react'
import { Card, CardContent } from '@/components/ui/card.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4 relative">
          <div className="absolute inset-0 bg-black/40"></div>
          <Card className="w-full max-w-md relative z-10">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-bold mb-4 text-red-500">😔 Ka ndodhur një gabim</h2>
              <p className="text-gray-600 mb-4">Na vjen keq, por ka ndodhur një gabim. Ju lutemi rifreskoni faqen.</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Rifreso Faqen
              </button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
