import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { motion } from 'framer-motion';
import { 
  Trophy, Target, Flame, Brain, Calendar,
  ChevronRight, ArrowUpRight, Award, History,
  BookOpen, Star, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;
      try {
        const response = await api.get(`/stats/user-overview/${user.id}`);
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch profile stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Profile Header Card */}
      <section className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-gray-100 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 z-0" />
        
        <div className="relative z-10 w-32 h-32 bg-blue-600 rounded-[2rem] flex items-center justify-center text-6xl shadow-2xl shadow-blue-200">
          {user?.avatar}
        </div>

        <div className="relative z-10 flex-1 text-center md:text-left">
          <h1 className="text-4xl font-black text-gray-900 mb-2">{user?.username}</h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full font-bold text-sm border border-blue-100">
              Year {user?.yearLevel || 'N/A'}
            </span>
            <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full font-bold text-sm border border-emerald-100 flex items-center gap-2">
              <Award className="w-4 h-4" /> Mastery Rank: Gold
            </span>
          </div>
          <p className="mt-6 text-gray-600 font-medium max-w-xl">
            Improving numeracy skills every day. My current goal is to master Measurement and Data before the next mock test!
          </p>
        </div>

        <button 
          onClick={() => navigate('/account')}
          className="relative z-10 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg"
        >
          Edit Profile
        </button>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Progress */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: 'Practice Streak', value: '12 Days', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
              { label: 'Accuracy', value: `${Math.round(stats?.overview?.avgAccuracy || 0)}%`, icon: Target, color: 'text-blue-500', bg: 'bg-blue-50' },
              { label: 'Mastery Score', value: stats?.overview?.highestScore || 0, icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100"
              >
                <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <p className="text-gray-500 font-bold text-xs uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-black text-gray-900">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Activity Feed */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
            <h3 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
              <History className="w-6 h-6 text-blue-600" /> Recent Learning Activity
            </h3>
            <div className="space-y-6">
              {stats?.history?.slice(0, 5).map((attempt: any, i: number) => (
                <div key={i} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-gray-50 transition-all group">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center font-black text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 capitalize">{attempt.quizType.replace('year', 'Year ')} Assessment</h4>
                    <p className="text-sm text-gray-500 font-medium">
                      {new Date(attempt.createdAt).toLocaleDateString()} • {attempt.accuracy}% Accuracy
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate(`/result/${attempt._id}`)}
                    className="p-3 bg-gray-50 text-gray-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Achievements & Mastery */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <Award className="w-5 h-5 text-amber-500" /> Achievements
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Early Bird', desc: 'Finished 5 tests before 9am', icon: Star, color: 'text-amber-500' },
                { label: 'Numeracy Ninja', desc: '100% accuracy on Algrebra', icon: Brain, color: 'text-purple-500' },
                { label: 'Time Traveler', desc: '30 hours total practice', icon: BookOpen, color: 'text-emerald-500' },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className={`w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center ${badge.color}`}>
                    <badge.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">{badge.label}</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 text-blue-600 font-bold text-sm hover:underline flex items-center justify-center gap-2">
              View All 15 Badges <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-[2.5rem] shadow-xl text-white">
            <Calendar className="w-10 h-10 mb-6 opacity-40 text-white" />
            <h3 className="text-xl font-bold mb-2 text-white">Next Milestone</h3>
            <p className="text-blue-100 text-sm font-medium mb-6">
              Complete 3 more Geometry sessions to unlock the "Geometry Guru" badge!
            </p>
            <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
              <div className="bg-white h-full w-[60%]" />
            </div>
            <p className="text-xs font-bold mt-3 text-white uppercase tracking-wider">60% Complete</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
