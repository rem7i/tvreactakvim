import { Card, CardContent } from '@/components/ui/card.jsx'

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-black/40"></div>
      <Card className="w-full max-w-md relative z-10">
        <CardContent className="p-6 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mb-4"></div>
          <h2 className="text-xl font-semibold text-green-600">Duke u ngarkuar...</h2>
          <p className="text-gray-600 mt-2">Ju lutemi prisni ndërsa po ngarkohen të dhënat e namazit</p>
        </CardContent>
      </Card>
    </div>
  )
}

export function ErrorScreen({ error, onRetry }) {
  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-black/40"></div>
      <Card className="w-full max-w-md relative z-10">
        <CardContent className="p-6 text-center">
          <h2 className="text-xl font-bold mb-4 text-red-500">Ka ndodhur një gabim</h2>
          <p className="text-gray-600 mb-4">{error?.message || 'Gabim gjatë ngarkimit të të dhënave'}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Provo përsëri
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
