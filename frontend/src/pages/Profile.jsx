import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Shield,
  Calendar,
  MapPin,
  Edit2,
  Save,
  Camera,
  Award,
  Activity,
  BarChart3,
  Zap,
  Clock,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export const Profile = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: user?.name || 'CyberShield User',
    email: user?.email || 'user@cybershield.ai',
    role: user?.role || 'Security Analyst',
    location: 'San Francisco, CA',
    bio: 'Passionate about AI security and digital threat detection.',
    joinDate: 'January 15, 2026',
    analyses: 0,
    accuracy: 0,
    rank: 'New User',
    badges: []
  });

  // Fetch user-specific data from API
  useEffect(() => {
    console.log('Profile component user changed:', user?.email);
    // Reset profile state when user changes
    if (user) {
      setProfile(prev => ({
        ...prev,
        name: user.name || 'CyberShield User',
        email: user.email || 'user@cybershield.ai',
        role: user.role || 'Security Analyst',
        analyses: 0,
        accuracy: 0,
        rank: 'New User',
        badges: []
      }));
      setLoading(true);
      fetchUserStats();
    }
  }, [user]); // Re-fetch when user changes

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        setLoading(false);
        return;
      }

      console.log('Fetching user stats for:', user?.email);

      // Add cache-busting timestamp
      const timestamp = Date.now();

      const [statsResponse, response] = await Promise.all([
        fetch(`/api/dashboard/stats?t=${timestamp}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        }),
        fetch(`/api/user/profile?t=${timestamp}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        })
      ]);

      let userData = {};
      let statsData = {};

      // Try to get user profile data
      if (response.ok) {
        userData = await response.json();
        console.log('User profile data received:', userData);
      } else {
        console.log('User profile API failed with status:', response.status);
      }

      // Get dashboard stats
      if (statsResponse.ok) {
        statsData = await statsResponse.json();
        console.log('User stats received:', statsData);
      } else {
        console.log('Dashboard stats API failed with status:', statsResponse.status);
      }

      // Calculate accuracy based on analyses
      const totalAnalyses = statsData.total_analyses || 0;
      const fakeNewsDetected = statsData.fake_news_detected || 0;
      const accuracy = totalAnalyses > 0
        ? ((totalAnalyses - fakeNewsDetected) / totalAnalyses * 100).toFixed(1)
        : 0;

      // Determine rank based on activity
      let rank = 'New User';
      let badges = [];

      if (totalAnalyses > 1000) {
        rank = 'Expert';
        badges = ['Early Adopter', 'Top Contributor', 'Accuracy Master'];
      } else if (totalAnalyses > 100) {
        rank = 'Advanced';
        badges = ['Early Adopter'];
      } else if (totalAnalyses > 10) {
        rank = 'Intermediate';
        badges = ['New Contributor'];
      } else if (totalAnalyses > 0) {
        rank = 'New Contributor';
      }

      setProfile(prev => ({
        ...prev,
        name: userData.name || user?.name || 'CyberShield User',
        email: userData.email || user?.email || 'user@cybershield.ai',
        role: userData.role || user?.role || 'Security Analyst',
        location: userData.location || 'San Francisco, CA',
        bio: userData.bio || 'Passionate about AI security and digital threat detection.',
        joinDate: userData.joinDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        analyses: totalAnalyses,
        accuracy: parseFloat(accuracy),
        rank: rank,
        badges: badges
      }));

      console.log('Updated profile data:', {
        totalAnalyses,
        accuracy,
        rank,
        badges,
        userEmail: user?.email
      });

    } catch (error) {
      console.error('Failed to fetch user stats:', error);
      // Keep default values if API fails
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className={`p-4 rounded-lg ${color} bg-opacity-10 border ${color.replace('text-', 'border-')}/30`}>
      <Icon className={`w-6 h-6 ${color} mb-2`} />
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );

  const Badge = ({ badge }) => (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-cyber-primary/20 to-cyber-secondary/20 border border-cyber-primary/30">
      <Award className="w-4 h-4 text-cyber-primary" />
      <span className="text-sm text-white">{badge}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text">Profile</h1>
          <p className="text-gray-400 mt-1">Manage your account and preferences</p>
        </div>
        {loading ? (
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-5 h-5 border-2 border-cyber-primary border-t-transparent rounded-full animate-spin" />
            <span>Loading profile data...</span>
          </div>
        ) : (
          <button
            onClick={() => setEditing(!editing)}
            className="btn-primary flex items-center gap-2"
          >
            {editing ? (
              <>
                <X className="w-5 h-5" />
                Cancel
              </>
            ) : (
              <>
                <Edit2 className="w-5 h-5" />
                Edit Profile
              </>
            )}
          </button>
        )}
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyber-primary border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
            <p className="text-cyber-primary text-lg font-semibold">Loading Profile...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Profile Info */}
            <div className="card text-center">
              <div className="relative inline-block mb-4">
                <motion.div
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-cyber-primary to-cyber-secondary flex items-center justify-center mx-auto"
                  whileHover={{ scale: 1.05 }}
                >
                  <User className="w-12 h-12 text-cyber-darker" />
                </motion.div>
                <button className="absolute bottom-0 right-0 p-2 rounded-full bg-cyber-primary hover:bg-cyber-secondary transition-colors">
                  <Camera className="w-4 h-4 text-cyber-darker" />
                </button>
              </div>

              <h2 className="text-2xl font-bold text-white mb-1">{profile.name}</h2>
              <p className="text-gray-400 text-sm mb-3">{profile.role}</p>

              <div className="flex items-center justify-center gap-2 text-gray-300 text-sm mb-4">
                <Mail className="w-4 h-4" />
                <span>{profile.email}</span>
              </div>

              <div className="flex items-center justify-center gap-2 text-gray-300 text-sm mb-4">
                <MapPin className="w-4 h-4" />
                <span>{profile.location}</span>
              </div>

              <div className="flex items-center justify-center gap-2 text-gray-300 text-sm">
                <Calendar className="w-4 h-4" />
                <span>Joined {profile.joinDate}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Performance Stats</h3>
              <div className="space-y-4">
                <StatCard
                  icon={BarChart3}
                  label="Total Analyses"
                  value={profile.analyses}
                  color="text-cyber-primary"
                />
                <StatCard
                  icon={Zap}
                  label="Accuracy Rate"
                  value={`${profile.accuracy}%`}
                  color="text-cyber-success"
                />
                <StatCard
                  icon={Shield}
                  label="Current Rank"
                  value={profile.rank}
                  color="text-cyber-secondary"
                />
              </div>
            </div>

            {/* Achievements */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Achievements</h3>
              <div className="flex flex-wrap gap-2">
                {profile.badges.length > 0 ? (
                  profile.badges.map((badge, index) => (
                    <Badge key={index} badge={badge} />
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">Complete analyses to earn badges!</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Personal Information */}
            <div className="card">
              <h3 className="text-xl font-bold text-white mb-6">Personal Information</h3>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      disabled={!editing}
                      className={`w-full px-4 py-3 rounded-lg bg-cyber-darker/50 border ${
                        editing ? 'border-cyber-primary/50 focus:border-cyber-primary' : 'border-cyber-light/30'
                      } text-white focus:outline-none focus:ring-2 focus:ring-cyber-primary/20`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full px-4 py-3 rounded-lg bg-cyber-light/20 border border-cyber-light/30 text-gray-400 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                    <input
                      type="text"
                      value={profile.role}
                      disabled
                      className="w-full px-4 py-3 rounded-lg bg-cyber-light/20 border border-cyber-light/30 text-gray-400 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile({...profile, location: e.target.value})}
                      disabled={!editing}
                      className={`w-full px-4 py-3 rounded-lg bg-cyber-darker/50 border ${
                        editing ? 'border-cyber-primary/50 focus:border-cyber-primary' : 'border-cyber-light/30'
                      } text-white focus:outline-none focus:ring-2 focus:ring-cyber-primary/20`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    disabled={!editing}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-lg bg-cyber-darker/50 border ${
                      editing ? 'border-cyber-primary/50 focus:border-cyber-primary' : 'border-cyber-light/30'
                    } text-white focus:outline-none focus:ring-2 focus:ring-cyber-primary/20 resize-none`}
                  />
                </div>
              </div>

              {editing && (
                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-cyber-light/20">
                  <button
                    onClick={() => setEditing(false)}
                    className="px-6 py-2 rounded-lg border border-cyber-light/30 text-gray-300 hover:bg-cyber-light/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-cyber-darker border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Activity Overview */}
            <div className="card">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-cyber-primary" />
                <h2 className="text-xl font-bold text-white">Recent Activity</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-cyber-darker/30">
                  <div className="w-2 h-2 rounded-full bg-cyber-success animate-pulse" />
                  <div className="flex-1">
                    <p className="text-sm text-white">Profile viewed</p>
                    <p className="text-xs text-gray-400">Just now</p>
                  </div>
                  <Clock className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-cyber-darker/30">
                  <div className="w-2 h-2 rounded-full bg-cyber-primary animate-pulse" />
                  <div className="flex-1">
                    <p className="text-sm text-white">Dashboard accessed</p>
                    <p className="text-xs text-gray-400">5 minutes ago</p>
                  </div>
                  <Clock className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Account Security */}
            <div className="card">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5 text-cyber-primary" />
                <h2 className="text-xl font-bold text-white">Account Security</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-cyber-light/30">
                  <div>
                    <p className="text-white font-medium">Password</p>
                    <p className="text-sm text-gray-400">Last changed 30 days ago</p>
                  </div>
                  <button className="btn-secondary">
                    Change Password
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-cyber-light/30">
                  <div>
                    <p className="text-white font-medium">Active Sessions</p>
                    <p className="text-sm text-gray-400">2 devices currently logged in</p>
                  </div>
                  <button className="btn-secondary">
                    Manage Sessions
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Profile;