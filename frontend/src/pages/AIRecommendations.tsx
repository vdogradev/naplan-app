import { useAuthStore } from '../store/authStore'

function AIRecommendations() {
  const { user } = useAuthStore()

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-xl mb-6">
        <h1 className="text-2xl font-bold mb-2">🤖 AI Guidance</h1>
        <p>Personalized recommendations powered by AI analysis</p>
      </div>
      
      {!user ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Please login to see your AI recommendations</p>
        </div>
      ) : (
        <div className="bg-yellow-50 p-6 rounded-xl border-2 border-yellow-400">
          <h2 className="font-bold text-yellow-800 mb-2">Coming Soon!</h2>
          <p className="text-yellow-700">
            AI-powered analysis and recommendations will be available once you complete
            your first quiz. The system will analyze your performance and provide
            personalized study plans.
          </p>
        </div>
      )}
    </div>
  )
}

export default AIRecommendations
