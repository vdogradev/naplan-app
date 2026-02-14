import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { motion } from 'framer-motion';
import { 
  User, Mail, Lock, Shield, Bell, HardDrive, 
  Save, AlertCircle, CheckCircle2, Loader2,
  Camera, Settings, GraduationCap, Clock, Target
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Account = () => {
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences'>('profile');

  // Profile State
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    yearLevel: user?.yearLevel || 3,
    avatar: user?.avatar || '👤'
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/auth/profile', profileData);
      updateUser(res.data.user);
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setLoading(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const avatars = ['👦', '👧', '🧒', '👶', '🧑', '🐱', '🐶', '🐼', '🦊', '🦁', '🤖', '🚀'];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Nav */}
        <aside className="w-full lg:w-64 space-y-2">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center text-4xl mb-4 relative group cursor-pointer">
                {user?.avatar}
                <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="font-bold text-gray-900 text-lg">{user?.username}</h2>
              <p className="text-sm text-gray-500 capitalize">{user?.role} Account</p>
            </div>
          </div>

          {[
            { id: 'profile', label: 'Profile Settings', icon: User },
            { id: 'security', label: 'Security & Password', icon: Shield },
            { id: 'preferences', label: 'Quiz Preferences', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                  : 'bg-white text-gray-500 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100"
          >
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 mb-2">Profile Details</h2>
                  <p className="text-gray-500 font-medium">Manage your public information and avatar</p>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">Username</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={profileData.username}
                          onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl transition-all outline-none font-bold"
                          placeholder="Your unique name"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl transition-all outline-none font-bold"
                          placeholder="Your school email"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-700 ml-1">Choose Global Avatar</label>
                    <div className="flex flex-wrap gap-3">
                      {avatars.map((a) => (
                        <button
                          key={a}
                          type="button"
                          onClick={() => setProfileData({...profileData, avatar: a})}
                          className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all border-2 ${
                            profileData.avatar === a ? 'border-blue-500 bg-blue-50 scale-110' : 'border-gray-100 hover:border-blue-200'
                          }`}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-blue-600" /> Current Year Level
                    </label>
                    <div className="grid grid-cols-4 gap-4">
                      {[3, 5, 7, 9].map((y) => (
                        <button
                          key={y}
                          type="button"
                          onClick={() => setProfileData({...profileData, yearLevel: y as any})}
                          className={`py-4 rounded-xl font-bold transition-all border-2 ${
                            profileData.yearLevel === y ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-400'
                          }`}
                        >
                          Year {y}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    disabled={loading}
                    className="w-full md:w-auto px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Profile Changes
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 mb-2">Account Security</h2>
                  <p className="text-gray-500 font-medium">Keep your account safe by updating your password</p>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Current Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl transition-all outline-none font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl transition-all outline-none font-bold"
                        required
                        minLength={5}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl transition-all outline-none font-bold"
                        required
                      />
                    </div>
                  </div>

                  <button
                    disabled={loading}
                    className="w-full px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
                    Update Password
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 mb-2">Learning Preferences</h2>
                  <p className="text-gray-500 font-medium">Customize your practice session defaults</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex items-center gap-6">
                    <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0">
                      <Clock className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Default Time Limit</h4>
                      <p className="text-sm text-gray-500">Currently set to 30 mins</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex items-center gap-6">
                    <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center shrink-0">
                      <Target className="w-7 h-7 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Practice Difficulty</h4>
                      <p className="text-sm text-gray-500">Currently set to Medium</p>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-blue-50 rounded-3xl border border-blue-100">
                  <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" /> Coming Soon
                  </h4>
                  <p className="text-blue-800 font-medium text-sm leading-relaxed">
                    We're building more advanced customization options including dark mode, sound effects, and adaptive difficulty tuning based on your performance.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Account;
