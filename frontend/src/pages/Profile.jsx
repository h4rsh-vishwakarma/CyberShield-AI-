import React, { useState } from 'react';
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
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export const Profile = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || 'CyberShield User',
    email: user?.email || 'user@cybershield.ai',
    role: user?.role || 'Security Analyst',
    location: 'San Francisco, CA',
    bio: 'Passionate about AI security and digital threat detection.',
    joinDate: 'January 15, 2026',
    analyses: 1247,
    accuracy: 94.5,
    rank: 'Expert',
    badges: ['Early Adopter', 'Top Contributor', 'Accuracy Master']
  });

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
        <button
          onClick={() => {
            if (editing) {
              handleSave();
            } else {
              setEditing(true);
            }
          }}
          disabled={saving}
          className="btn-primary flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="w-5 h-5 border-2 border-cyber-darker border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : editing ? (
            <>
              <Save className="w-5 h-5" />
              Save Changes
            </>
          ) : (
            <>
              <Edit2 className="w-5 h-5" />
              Edit Profile
            </>
          )}
        </button>
      </motion.div>

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
            <p className="text-cyber-primary font-medium">{profile.role}</p>
            <div className="flex items-center justify-center gap-2 mt-3 text-sm text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>{profile.location}</span>
            </div>
            <div className="flex items-center justify-center gap-2 mt-1 text-sm text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>Joined {profile.joinDate}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              icon={BarChart3}
              label="Total Analyses"
              value={profile.analyses.toLocaleString()}
              color="text-cyber-primary"
            />
            <StatCard
              icon={Zap}
              label="Accuracy Rate"
              value={`${profile.accuracy}%`}
              color="text-cyber-success"
            />
          </div>

          {/* Badges */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-cyber-primary" />
              <h3 className="text-lg font-bold text-white">Achievements</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.badges.map((badge, index) => (
                <Badge key={index} badge={badge} />
              ))}
            </div>
          </div>

          {/* Rank */}
          <div className="card bg-gradient-to-br from-cyber-primary/20 to-cyber-secondary/20 border-cyber-primary/30">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-cyber-primary" />
              <div>
                <p className="text-sm text-gray-400">Current Rank</p>
                <p className="text-xl font-bold text-white">{profile.rank}</p>
              </div>
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
            <div className="flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-cyber-primary" />
              <h2 className="text-xl font-bold text-white">Personal Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  disabled={!editing}
                  className={`input ${!editing ? 'opacity-70 cursor-not-allowed' : ''}`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!editing}
                    className={`input pl-10 ${!editing ? 'opacity-70 cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Role</label>
                <input
                  type="text"
                  value={profile.role}
                  disabled
                  className="input opacity-70 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Location</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  disabled={!editing}
                  className={`input ${!editing ? 'opacity-70 cursor-not-allowed' : ''}`}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm text-gray-400">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  disabled={!editing}
                  className={`input min-h-[100px] resize-none ${!editing ? 'opacity-70 cursor-not-allowed' : ''}`}
                />
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
                  <p className="text-white font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-400">Add an extra layer of security</p>
                </div>
                <button className="btn-primary">
                  Enable 2FA
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

          {/* Activity Overview */}
          <div className="card">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-cyber-primary" />
              <h2 className="text-xl font-bold text-white">Recent Activity</h2>
            </div>
            <div className="space-y-3">
              {[
                { action: 'Analyzed fake news article', time: '2 hours ago', type: 'success' },
                { action: 'Updated profile information', time: '1 day ago', type: 'info' },
                { action: 'Generated weekly report', time: '2 days ago', type: 'success' },
                { action: 'Changed security settings', time: '3 days ago', type: 'warning' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-cyber-light/30">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'success' ? 'bg-cyber-success' :
                    activity.type === 'warning' ? 'bg-cyber-warning' :
                    'bg-cyber-primary'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-white">{activity.action}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                  <Clock className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;