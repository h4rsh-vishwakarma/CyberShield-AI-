import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  Menu,
  X,
  LogOut,
  User,
  Settings,
  Bell,
  Search,
  Sun,
  Moon,
  Key
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

export const Navigation = ({ isSidebarOpen, setSidebarOpen, isAuthenticated }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Analysis Complete',
      message: 'Fake news analysis completed successfully',
      time: '2 minutes ago'
    },
    {
      id: 2,
      type: 'warning',
      title: 'System Update',
      message: 'New AI model version available',
      time: '1 hour ago'
    }
  ]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      toast.success(`Searching for: ${searchQuery}`);
    }
  };

  const publicRoutes = ['/login', '/register'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  if (isPublicRoute) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cyber-darker/80 backdrop-blur-xl border-b border-cyber-light/20">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Side - Logo & Menu */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-cyber-light/50 transition-colors"
          >
            {isSidebarOpen ? (
              <X className="w-6 h-6 text-cyber-primary" />
            ) : (
              <Menu className="w-6 h-6 text-cyber-primary" />
            )}
          </button>

          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyber-primary to-cyber-secondary flex items-center justify-center"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Shield className="w-6 h-6 text-cyber-darker" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold gradient-text">CyberShield AI</h1>
              <p className="text-xs text-gray-400">AI-Powered Security</p>
            </div>
          </Link>
        </div>

        {/* Center - Search Bar */}
        <div className="flex-1 max-w-xl mx-8">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search analyses, reports, alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-cyber-light/30 border border-cyber-light/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyber-primary focus:ring-2 focus:ring-cyber-primary/20 transition-all duration-300"
            />
          </form>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-cyber-light/50 transition-colors"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-cyber-primary" />
            ) : (
              <Moon className="w-5 h-5 text-cyber-primary" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-lg hover:bg-cyber-light/50 transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-cyber-primary" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-cyber-danger rounded-full animate-pulse" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-80 bg-cyber-light/90 backdrop-blur-xl border border-cyber-light/30 rounded-xl shadow-2xl z-50"
              >
                <div className="p-4 border-b border-cyber-light/20">
                  <h3 className="font-semibold text-white">Notifications</h3>
                  <p className="text-sm text-gray-400">{notifications.length} new notifications</p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-cyber-light/10 hover:bg-cyber-light/50 cursor-pointer transition-colors ${
                        notification.type === 'success' ? 'border-l-4 border-l-cyber-success' :
                        notification.type === 'warning' ? 'border-l-4 border-l-cyber-warning' :
                        'border-l-4 border-l-cyber-danger'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-white text-sm">{notification.title}</h4>
                          <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
                        </div>
                        <span className="text-xs text-gray-500 ml-2">{notification.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-cyber-light/20">
                  <button className="w-full py-2 text-sm text-cyber-primary hover:text-cyber-secondary transition-colors">
                    Mark all as read
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3 pl-3 border-l border-cyber-light/20">
            {user ? (
              <>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-white">{user.name || 'User'}</p>
                  <p className="text-xs text-gray-400">{user.role || 'Analyst'}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyber-primary to-cyber-secondary flex items-center justify-center">
                  <User className="w-5 h-5 text-cyber-darker" />
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-cyber-light/50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 text-cyber-primary" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="btn-primary text-sm py-2 px-4"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;