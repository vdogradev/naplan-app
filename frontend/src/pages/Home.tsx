import { Link } from 'react-router-dom'
import { Calculator, BookOpen, GraduationCap, Brain } from 'lucide-react'

function Home() {
  const modules = [
    {
      icon: Calculator,
      title: 'Multiplication Master',
      description: 'Build multiplication fluency with times tables practice. Configurable timer to match your learning pace.',
      features: ['All times tables (2-12)', 'Adjustable time limits', 'Streak tracking', 'Practice wrong answers'],
      path: '/multiplication',
      color: 'bg-purple-100 border-purple-500',
      badge: 'SKILL BUILDER'
    },
    {
      icon: BookOpen,
      title: 'Year 3 NAPLAN',
      description: 'Practice real Year 3 NAPLAN-style questions. Perfect for students preparing for their first NAPLAN assessment.',
      features: ['35 authentic questions', '45-minute timed tests', 'All curriculum areas', 'AI-powered guidance'],
      path: '/year3',
      color: 'bg-blue-100 border-blue-500',
      badge: 'YEAR 3'
    },
    {
      icon: GraduationCap,
      title: 'Year 7 NAPLAN',
      description: 'Advanced Year 7 numeracy practice. Comprehensive coverage with detailed AI recommendations.',
      features: ['40 advanced questions', '65-minute timed tests', 'Algebra & advanced topics', 'Smart analytics'],
      path: '/year7',
      color: 'bg-indigo-100 border-indigo-900',
      badge: 'YEAR 7'
    }
  ]

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center text-white py-12">
        <div className="flex justify-center mb-6">
          <Brain className="w-20 h-20" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          🎓 NAPLAN Practice Hub
        </h1>
        <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
          AI-powered test preparation for Australian students
        </p>
      </div>

      {/* Module Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {modules.map((module, index) => (
          <Link
            key={index}
            to={module.path}
            className={`${module.color} border-2 rounded-xl p-6 transition-all hover:scale-105 hover:shadow-xl`}
          >
            <span className="inline-block px-3 py-1 bg-white rounded-full text-xs font-bold mb-4">
              {module.badge}
            </span>
            <module.icon className="w-12 h-12 mb-4 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">{module.title}</h2>
            <p className="text-gray-600 mb-4 text-sm">{module.description}</p>
            <ul className="space-y-1 text-sm text-gray-600">
              {module.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> {feature}
                </li>
              ))}
            </ul>
            <button className="mt-6 w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors">
              Start Practicing →
            </button>
          </Link>
        ))}
      </div>

      {/* Features Section */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          ✨ Powered by AI
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Smart Analysis', desc: 'AI analyzes your patterns and identifies weak areas' },
            { title: 'Personalized Plans', desc: 'Get customized study recommendations just for you' },
            { title: 'Progress Tracking', desc: 'Watch your scores improve over time with detailed stats' },
            { title: 'Real NAPLAN Style', desc: 'Practice with authentic questions and timed conditions' }
          ].map((feature, index) => (
            <div key={index} className="text-center p-4">
              <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-6">
        <h3 className="text-xl font-bold text-yellow-800 mb-4">💡 Tips for Success</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            'Start with Multiplication to build foundation skills',
            'Use Unlimited Time mode first, then add time limits',
            'Practice weak areas for 15-20 minutes daily',
            'Review explanations for every wrong answer',
            'Track your progress in the Stats tab',
            'Take full tests weekly to measure improvement'
          ].map((tip, index) => (
            <div key={index} className="flex items-start gap-2 bg-white p-3 rounded-lg">
              <span className="text-yellow-600 font-bold">{index + 1}.</span>
              <span className="text-gray-700 text-sm">{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home