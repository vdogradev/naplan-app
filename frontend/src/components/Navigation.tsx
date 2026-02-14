import { Link } from 'react-router-dom'
import { Brain, User, Settings, LogOut } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

function Navigation() {
  const { user, logout, isAuthenticated } = useAuthStore()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
            <Brain className="w-6 h-6" />
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight">NAPLAN<span className="text-blue-600">HUB</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/stats" className="nav-link">Analytics</Link>
          <Link to="/ai-guidance" className="nav-link">AI Support</Link>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-bold text-slate-900">{user?.username}</span>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none">Pro Plan</span>
              </div>
              <button 
                onClick={logout}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg active:scale-95"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navigation