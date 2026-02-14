import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Year3Quiz from './pages/Year3Quiz'
import Year7Quiz from './pages/Year7Quiz'
import Multiplication from './pages/Multiplication'
import AIRecommendations from './pages/AIRecommendations'
import Stats from './pages/Stats'
import Login from './pages/Login'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="year3" element={<Year3Quiz />} />
        <Route path="year7" element={<Year7Quiz />} />
        <Route path="multiplication" element={<Multiplication />} />
        <Route path="ai-guidance" element={<AIRecommendations />} />
        <Route path="stats" element={<Stats />} />
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  )
}

export default App