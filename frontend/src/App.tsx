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
import QuizPage from './pages/QuizPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="quiz/:yearLevel" element={<QuizPage />} />
        {/* Legacy redirects for old paths */}
        <Route path="year3" element={<QuizPage />} />
        <Route path="year7" element={<QuizPage />} />
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