import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../services/api'
import { LogIn, UserPlus, AlertCircle, Loader2, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    yearLevel: ''
  })
  
  const navigate = useNavigate()
  const { setUser } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register'
      const payload = isLogin 
        ? { username: formData.username, password: formData.password }
        : { ...formData, yearLevel: formData.yearLevel ? parseInt(formData.yearLevel) : undefined }

      const response = await api.post(endpoint, payload)
      
      if (response.data.success) {
        setUser(response.data.user, response.data.token)
        navigate('/')
      } else {
        setError(response.data.message || 'Authentication failed')
      }
    } catch (err: any) {
      console.error('Auth error:', err)
      setError(err.response?.data?.message || 'Connection to server failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-50 rounded-full opacity-50"></div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg mx-auto">
              {isLogin ? <LogIn className="w-8 h-8" /> : <UserPlus className="w-8 h-8" />}
            </div>
            
            <h1 className="text-3xl font-black text-center text-slate-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-slate-500 text-center mb-8 font-medium">
              {isLogin ? 'Sign in to track your NAPLAN progress' : 'Join thousands of students across Australia'}
            </p>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6 flex items-center gap-3 text-red-700 text-sm font-bold"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-700"
                  placeholder="e.g. math_wizard"
                  required
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-700"
                    placeholder="student@example.com"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-700"
                  placeholder="••••••••"
                  required
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">
                    Year Level
                  </label>
                  <select
                    value={formData.yearLevel}
                    onChange={(e) => setFormData({...formData, yearLevel: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-700 appearance-none"
                    required
                  >
                    <option value="">Select Year</option>
                    <option value="3">Year 3</option>
                    <option value="7">Year 7</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-premium flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <Sparkles className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-slate-500 font-medium">
              {isLogin ? "New to the Hub?" : "Already a member?"}{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 font-black hover:underline underline-offset-4"
              >
                {isLogin ? 'Create Account' : 'Sign In instead'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
