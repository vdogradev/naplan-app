import { Link } from 'react-router-dom'
import { Brain, User, Settings, LogOut, Shield } from 'lucide-react'
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
            <div className="flex items-center gap-6">
              <div className="hidden lg:flex items-center gap-6 mr-4 border-r border-slate-100 pr-6">
                <Link to="/profile" className="nav-link flex items-center gap-2">
                  <User className="w-4 h-4" /> Profile
                </Link>
                <Link to="/account" className="nav-link flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Settings
                </Link>
                {(user?.role === 'admin' || user?.role === 'super-admin') && (
                  <Link to="/admin" className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-bold text-xs hover:bg-indigo-100 transition-all flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Admin Console
                  </Link>
                )}
              </div>

              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-bold text-slate-900">{user?.username}</span>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none">
                  {user?.role || 'Student'}
                </span>
              </div>
              
              <button 
                onClick={logout}
                className="w-10 h-10 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all flex items-center justify-center"
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