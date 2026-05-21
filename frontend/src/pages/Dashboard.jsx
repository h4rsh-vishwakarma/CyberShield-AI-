import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Shield,
  FileText,
  Video,
  Map,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Activity,
  Zap,
  Award,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical
} from 'lucide-react';
import toast from 'react-hot-toast';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    fakeNewsDetected: 0,
    deepfakesDetected: 0,
    activeAlerts: 0,
    systemHealth: 98,
    processingTime: 2.3
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [threatLevel, setThreatLevel] = useState('Low');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Simulated data - replace with actual API calls
      const mockStats = {
        totalAnalyses: Math.floor(Math.random() * 1000) + 5000,
        fakeNewsDetected: Math.floor(Math.random() * 100) + 300,
        deepfakesDetected: Math.floor(Math.random() * 50) + 120,
        activeAlerts: Math.floor(Math.random() * 10) + 5,
        systemHealth: Math.floor(Math.random() * 5) + 95,
        processingTime: (Math.random() * 2 + 1.5).toFixed(2)
      };

      const mockActivity = [
        { id: 1, type: 'success', message: 'Fake news analysis completed', time: '2 min ago', confidence: 94 },
        { id: 2, type: 'warning', message: 'Suspicious activity detected in region 3', time: '15 min ago', confidence: 78 },
        { id: 3, type: 'success', message: 'Deepfake verification completed', time: '32 min ago', confidence: 89 },
        { id: 4, type: 'danger', message: 'New malware pattern identified', time: '1 hour ago', confidence: 96 },
        { id: 5, type: 'success', message: 'System backup completed successfully', time: '2 hours ago', confidence: 100 },
      ];

      setStats(mockStats);
      setRecentActivity(mockActivity);
      setThreatLevel(mockStats.activeAlerts > 10 ? 'High' : mockStats.activeAlerts > 5 ? 'Medium' : 'Low');
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="stat-card"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-cyber-darker" />
        </div>
        <div className="flex items-center gap-1">
          {trend === 'up' ? (
            <ArrowUpRight className="w-4 h-4 text-cyber-success" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-cyber-danger" />
          )}
          <span className={`text-sm font-medium ${trend === 'up' ? 'text-cyber-success' : 'text-cyber-danger'}`}>
            {change}
          </span>
        </div>
      </div>
      <h3 className="text-3xl font-bold text-white mb-1">{value.toLocaleString()}</h3>
      <p className="text-gray-400 text-sm">{title}</p>
    </motion.div>
  );

  const ActivityItem = ({ activity }) => {
    const icons = {
      success: CheckCircle,
      warning: AlertTriangle,
      danger: AlertTriangle,
    };

    const colors = {
      success: 'text-cyber-success',
      warning: 'text-cyber-warning',
      danger: 'text-cyber-danger',
    };

    const ActivityIcon = icons[activity.type];

    return (
      <div className={`alert-item ${activity.type} hover:scale-[1.02] transform transition-transform`}>
        <div className="flex items-start gap-3">
          <ActivityIcon className={`w-5 h-5 mt-0.5 ${colors[activity.type]} flex-shrink-0`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white">{activity.message}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-400">{activity.time}</span>
              {activity.confidence && (
                <>
                  <span className="text-gray-600">•</span>
                  <span className="text-xs text-cyber-primary font-medium">
                    {activity.confidence}% confidence
                  </span>
                </>
              )}
            </div>
          </div>
          <button className="p-1 hover:bg-cyber-light/50 rounded transition-colors">
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyber-primary border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-cyber-primary text-lg font-semibold">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back! Here's what's happening with your security systems.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`px-4 py-2 rounded-lg ${
            threatLevel === 'High' ? 'bg-cyber-danger/20 border border-cyber-danger/50' :
            threatLevel === 'Medium' ? 'bg-cyber-warning/20 border border-cyber-warning/50' :
            'bg-cyber-success/20 border border-cyber-success/50'
          }`}>
            <div className="flex items-center gap-2">
              <Shield className={`w-5 h-5 ${
                threatLevel === 'High' ? 'text-cyber-danger' :
                threatLevel === 'Medium' ? 'text-cyber-warning' :
                'text-cyber-success'
              }`} />
              <span className={`font-semibold ${
                threatLevel === 'High' ? 'text-cyber-danger' :
                threatLevel === 'Medium' ? 'text-cyber-warning' :
                'text-cyber-success'
              }`}>
                Threat Level: {threatLevel}
              </span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchDashboardData}
            className="btn-primary flex items-center gap-2"
          >
            <Activity className="w-5 h-5" />
            Refresh Data
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Analyses"
          value={stats.totalAnalyses}
          change="+12.5%"
          icon={BarChart3}
          color="bg-gradient-to-br from-cyber-primary to-cyber-secondary"
          trend="up"
        />
        <StatCard
          title="Fake News Detected"
          value={stats.fakeNewsDetected}
          change="+8.2%"
          icon={FileText}
          color="bg-gradient-to-br from-cyber-primary to-cyber-success"
          trend="up"
        />
        <StatCard
          title="Deepfakes Detected"
          value={stats.deepfakesDetected}
          change="+15.3%"
          icon={Video}
          color="bg-gradient-to-br from-cyber-secondary to-cyber-accent"
          trend="up"
        />
        <StatCard
          title="Active Alerts"
          value={stats.activeAlerts}
          change="-3.1%"
          icon={AlertTriangle}
          color="bg-gradient-to-br from-cyber-warning to-cyber-danger"
          trend="down"
        />
        <StatCard
          title="System Health"
          value={`${stats.systemHealth}%`}
          change="+2.4%"
          icon={Shield}
          color="bg-gradient-to-br from-cyber-success to-cyber-primary"
          trend="up"
        />
        <StatCard
          title="Avg Processing Time"
          value={`${stats.processingTime}s`}
          change="-0.8s"
          icon={Zap}
          color="bg-gradient-to-br from-cyber-accent to-cyber-secondary"
          trend="down"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">System Performance</h2>
                <p className="text-gray-400 text-sm mt-1">Real-time analytics and metrics</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm bg-cyber-primary/20 text-cyber-primary rounded-lg border border-cyber-primary/50">
                  24h
                </button>
                <button className="px-3 py-1 text-sm bg-cyber-light/30 text-gray-400 rounded-lg border border-cyber-light/30">
                  7d
                </button>
                <button className="px-3 py-1 text-sm bg-cyber-light/30 text-gray-400 rounded-lg border border-cyber-light/30">
                  30d
                </button>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center bg-cyber-darker/30 rounded-lg border border-cyber-light/20">
              <div className="text-center">
                <TrendingUp className="w-16 h-16 text-cyber-primary mx-auto mb-2 animate-pulse" />
                <p className="text-gray-400">Chart Component</p>
                <p className="text-sm text-gray-500">Real-time data visualization</p>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                to="/fake-news"
                className="p-4 rounded-lg bg-gradient-to-br from-cyber-primary/20 to-cyber-secondary/20 border border-cyber-primary/30 hover:border-cyber-primary/50 hover:scale-105 transition-all duration-300 group"
              >
                <FileText className="w-8 h-8 text-cyber-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium text-white text-center">Analyze Text</p>
              </Link>
              <Link
                to="/deepfake"
                className="p-4 rounded-lg bg-gradient-to-br from-cyber-secondary/20 to-cyber-accent/20 border border-cyber-secondary/30 hover:border-cyber-secondary/50 hover:scale-105 transition-all duration-300 group"
              >
                <Video className="w-8 h-8 text-cyber-secondary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium text-white text-center">Detect Deepfake</p>
              </Link>
              <Link
                to="/crime-analytics"
                className="p-4 rounded-lg bg-gradient-to-br from-cyber-accent/20 to-cyber-danger/20 border border-cyber-accent/30 hover:border-cyber-accent/50 hover:scale-105 transition-all duration-300 group"
              >
                <Map className="w-8 h-8 text-cyber-accent mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium text-white text-center">Crime Map</p>
              </Link>
              <Link
                to="/alerts"
                className="p-4 rounded-lg bg-gradient-to-br from-cyber-warning/20 to-cyber-success/20 border border-cyber-warning/30 hover:border-cyber-warning/50 hover:scale-105 transition-all duration-300 group"
              >
                <AlertTriangle className="w-8 h-8 text-cyber-warning mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium text-white text-center">View Alerts</p>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Recent Activity</h2>
              <Link to="/alerts" className="text-cyber-primary text-sm hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentActivity.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-4">System Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyber-success animate-pulse" />
                  <span className="text-gray-300">AI Models</span>
                </div>
                <span className="text-cyber-success font-medium">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyber-success animate-pulse" />
                  <span className="text-gray-300">Database</span>
                </div>
                <span className="text-cyber-success font-medium">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyber-warning animate-pulse" />
                  <span className="text-gray-300">API Services</span>
                </div>
                <span className="text-cyber-warning font-medium">High Load</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyber-success animate-pulse" />
                  <span className="text-gray-300">Storage</span>
                </div>
                <span className="text-cyber-success font-medium">78% Used</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;