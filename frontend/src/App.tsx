import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Year3Quiz from './pages/Year3Quiz'
import Year7Quiz from './pages/Year7Quiz'
import Multiplication from './pages/Multiplication'
import AIRecommendations from './pages/AIRecommendations'
import Stats from './pages/Stats'
import Login from './pages/Login'
import ResultAnalysis from './pages/ResultAnalysis'
import AIPractice from './pages/AIPractice'
import Account from './pages/Account'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import QuizPage from './pages/QuizPage'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) => {
  const { isAuthenticated, user } = useAuthStore()
  
  if (!isAuthenticated) return <Navigate to="/login" />
  if (adminOnly && user?.role !== 'admin' && user?.role !== 'super-admin') return <Navigate to="/" />
  
  return <>{children}</>
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="quiz/:yearLevel" element={<QuizPage />} />
        
        {/* Protected Student Routes */}
        <Route path="account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        
        {/* Protected Admin Routes */}
        <Route path="admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />

        <Route path="multiplication" element={<Multiplication />} />
        <Route path="ai-practice" element={<AIPractice />} />
        <Route path="ai-guidance" element={<AIRecommendations />} />
        <Route path="stats" element={<Stats />} />
        <Route path="login" element={<Login />} />
        <Route path="result/:attemptId" element={<ResultAnalysis />} />
        <Route path="quiz/retake/:attemptId" element={<Year3Quiz />} />
      </Route>
    </Routes>
  )
}

export default App