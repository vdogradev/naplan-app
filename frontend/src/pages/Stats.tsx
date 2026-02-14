import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { 
  Trophy, Target, Clock, Brain, BarChart3, ArrowRight, 
  ChevronRight, AlertCircle, Loader2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardData {
  overview: {
    avgAccuracy: number;
    highestScore: number;
    totalTime: number;
  };
  totalAttempts: number;
  history: any[];
  topicMastery: { topic: string; mastery: number }[];
}

const Dashboard = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;
      try {
        const response = await api.get(`/stats/user-overview/${user.id}`);
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-blue-900 font-medium">Crunching your performance data...</p>
      </div>
    );
  }

  if (!data || data.totalAttempts === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16 px-4">
        <div className="bg-white rounded-3xl p-12 shadow-2xl border border-blue-50">
          <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-blue-900 mb-4">No Data Yet</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Complete your first assessment to unlock personalized insights, mastery charts, and AI guidance!
          </p>
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
          >
            Start Your First Test <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight">Student Dashboard</h1>
          <p className="text-blue-700/70 font-medium">Welcome back, {user?.username}! Here's your NAPLAN progress.</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-blue-900 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
          <Clock className="w-4 h-4" /> Total Practice: {Math.round(data.overview.totalTime / 60)} mins
        </div>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Overall Accuracy', value: `${Math.round(data.overview.avgAccuracy)}%`, icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Highest Score', value: data.overview.highestScore, icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Tests Completed', value: data.totalAttempts, icon: Brain, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Improvement', value: '+12%', icon: BarChart3, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex items-center gap-6"
          >
            <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center`}>
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <h3 className="text-xl font-bold text-blue-900 mb-8">Accuracy Trends (Last 10 Tests)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.history}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="createdAt" 
                  tickFormatter={(val) => new Date(val).toLocaleDateString()} 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <YAxis 
                  domain={[0, 100]} 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#1E3A8A',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#2563EB" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#2563EB', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8, fill: '#2563EB', strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Topic Mastery */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <h3 className="text-xl font-bold text-blue-900 mb-8">Topic Mastery</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.topicMastery}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis dataKey="topic" tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Radar
                  name="Mastery %"
                  dataKey="mastery"
                  stroke="#4F46E5"
                  fill="#4F46E5"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <h3 className="text-xl font-bold text-blue-900 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {data.history.map((attempt, i) => (
            <div 
              key={i}
              className="group flex items-center justify-between p-4 rounded-2xl hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100 cursor-pointer"
              onClick={() => navigate(`/result/${attempt._id}`)}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center font-bold text-blue-600">
                  {i + 1}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 capitalize">{attempt.quizType.replace('year', 'Year ')} Assessment</h4>
                  <p className="text-sm text-gray-500">{new Date(attempt.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900">Accuracy</p>
                  <p className={`text-sm font-bold ${attempt.accuracy >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {attempt.accuracy}%
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
