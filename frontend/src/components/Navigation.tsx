import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Brain, Menu, X } from 'lucide-react'
import { useState } from 'react'

function Navigation() {
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/year3', label: 'Year 3' },
    { path: '/year7', label: 'Year 7' },
    { path: '/multiplication', label: 'Practice' },
    { path: '/ai-guidance', label: 'AI Guidance' },
  ]

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-blue-900 font-bold text-xl">
            <Brain className="w-8 h-8" />
            <span>NAPLAN Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-2xl">{user.avatar}</span>
                <span className="text-sm font-medium">{user.username}</span>
                <button
                  onClick={logout}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block py-2 text-gray-600 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation