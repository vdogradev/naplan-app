import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { 
  Users, UserPlus, Shield, Activity, 
  Search, Filter, ChevronRight, MoreVertical,
  Trash2, Mail, Award, TrendingUp, Loader2,
  Lock, CheckCircle2, XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeToday: 0,
    avgAccuracy: 0,
    totalTests: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/admin/users');
      setUsers(res.data.users);
      
      // Calculate basic stats for display
      const total = res.data.users.length;
      const admins = res.data.users.filter((u: any) => u.role === 'admin' || u.role === 'super-admin').length;
      setStats(prev => ({ ...prev, totalUsers: total }));
    } catch (err) {
      toast.error('Failed to fetch user list');
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (userId: string, newRole: string) => {
    try {
      await api.put(`/auth/admin/user/${userId}/role`, { role: newRole });
      toast.success('User role updated');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Admin Hero Header */}
      <section className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full -mr-48 -mt-48 blur-3xl" />
        <div className="relative z-10">
          <h1 className="text-5xl font-black mb-4">Admin Command Center</h1>
          <p className="text-slate-400 text-xl font-medium max-w-2xl">
            Monitor platform health, manage student accounts, and analyze cross-platform performance metrics.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 relative z-10">
          {[
            { label: 'Total Members', value: stats.totalUsers, icon: Users, color: 'text-indigo-400' },
            { label: 'Active Today', value: '142', icon: Activity, color: 'text-emerald-400' },
            { label: 'System Accuracy', value: '78%', icon: TrendingUp, color: 'text-rose-400' },
            { label: 'Tests Taken', value: '1.2k', icon: Award, color: 'text-amber-400' },
          ].map((s, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10">
              <s.icon className={`w-6 h-6 ${s.color} mb-3`} />
              <p className="text-2xl font-black">{s.value}</p>
              <p className="text-xs font-bold text-slate-500 uppercase">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* User Management Section */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-black text-gray-900">User Management</h3>
            <p className="text-gray-500 font-medium">Control roles and view student progress</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text"
                placeholder="Search username or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-bold text-sm w-full md:w-64 transition-all"
              />
            </div>
            <button className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition-all">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-wider">Year</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-wider">Joined</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((u, i) => (
                <tr key={u._id} className="hover:bg-gray-50/80 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-sm">
                        {u.avatar || '👤'}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{u.username}</p>
                        <p className="text-xs text-gray-500 font-medium">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <select 
                      value={u.role}
                      onChange={(e) => updateRole(u._id, e.target.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all outline-none ${
                        u.role === 'admin' ? 'bg-indigo-50 border-indigo-200 text-indigo-600' :
                        u.role === 'super-admin' ? 'bg-rose-50 border-rose-200 text-rose-600' :
                        'bg-gray-50 border-gray-100 text-gray-500'
                      }`}
                    >
                      <option value="student">Student</option>
                      <option value="admin">Admin</option>
                      <option value="super-admin">Super Admin</option>
                    </select>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-black">
                      Year {u.yearLevel || 'N/A'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm text-gray-500 font-medium">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all shadow-sm">
                        <Activity className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-8 bg-gray-50/50 flex items-center justify-between">
          <p className="text-xs text-gray-500 font-bold uppercase">
            Showing {filteredUsers.length} of {users.length} users
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-400 hover:text-gray-900 transition-all">Previous</button>
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-400 hover:text-gray-900 transition-all">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
