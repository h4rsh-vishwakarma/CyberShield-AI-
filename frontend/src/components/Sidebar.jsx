

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Video,
  Map,
  Bell,
  Settings,
  User,
  Shield,
  Activity,
  TrendingUp,
  Clock,
  HelpCircle,
  Key
} from 'lucide-react';

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard', description: 'Overview & Statistics' },
  { path: '/fake-news', icon: FileText, label: 'Fake News Analysis', description: 'Text Analysis & Detection' },
  { path: '/deepfake', icon: Video, label: 'Deepfake Detection', description: 'Video/Image Verification' },
  { path: '/crime-analytics', icon: Map, label: 'Crime Analytics', description: 'Risk Maps & Trends' },
  { path: '/surveillance', icon: Activity, label: 'Surveillance', description: 'Real-time Monitoring' },
  { path: '/alerts', icon: Bell, label: 'Alert Center', description: 'Notifications & Updates' },
  { path: '/api-keys', icon: Key, label: 'API Keys', description: 'Key Management' },
];

const secondaryMenuItems = [
  { path: '/api-keys', icon: Key, label: 'API Keys', description: 'Key Management & Security' },
  { path: '/profile', icon: User, label: 'Profile', description: 'Account Settings' },
  { path: '/settings', icon: Settings, label: 'Settings', description: 'System Configuration' },
  { path: '/help', icon: HelpCircle, label: 'Help & Support', description: 'Documentation' },
];

export const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const MenuItem = ({ item, isSecondary = false }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;

    return (
      <Link
        to={item.path}
        onClick={() => onClose()}
        className={`sidebar-item ${isActive ? 'active' : ''} ${isSecondary ? 'mt-4' : ''}`}
      >
        <div className={`p-2 rounded-lg ${isActive ? 'bg-gradient-to-r from-cyber-primary/20 to-cyber-secondary/20' : ''}`}>
          <Icon className={`w-5 h-5 ${isActive ? 'text-cyber-primary' : 'text-gray-400'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-medium text-sm ${isActive ? 'text-cyber-primary' : 'text-white'}`}>
            {item.label}
          </p>
          <p className={`text-xs truncate ${isActive ? 'text-cyber-primary/70' : 'text-gray-400'}`}>
            {item.description}
          </p>
        </div>
        {isActive && (
          <motion.div
            className="w-2 h-2 rounded-full bg-cyber-primary"
            layoutId="activeIndicator"
            initial={false}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? '16rem' : '5rem'
        }}
        className={`fixed left-0 top-16 bottom-0 bg-cyber-light/30 backdrop-blur-xl border-r border-cyber-light/20 z-40 overflow-hidden transition-all duration-300`}
      >
        <div className="h-full flex flex-col">
          {/* Logo Section */}
          <div className="p-4 border-b border-cyber-light/20">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyber-primary to-cyber-secondary flex items-center justify-center flex-shrink-0"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Shield className="w-6 h-6 text-cyber-darker" />
              </motion.div>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 min-w-0"
                >
                  <h2 className="font-bold gradient-text text-sm">CyberShield AI</h2>
                  <p className="text-xs text-gray-400">v1.0.0</p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Main Menu */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-3 space-y-1">
              {menuItems.map((item) => (
                <MenuItem key={item.path} item={item} />
              ))}
            </nav>

            {/* Secondary Menu */}
            {isOpen && (
              <nav className="px-3 mt-6">
                <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Account
                </p>
                {secondaryMenuItems.map((item) => (
                  <MenuItem key={item.path} item={item} isSecondary />
                ))}
              </nav>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-cyber-light/20">
            {isOpen ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-cyber-primary/10 to-cyber-secondary/10 border border-cyber-light/20">
                  <TrendingUp className="w-5 h-5 text-cyber-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white">System Status</p>
                    <p className="text-xs text-cyber-success">All Systems Operational</p>
                  </div>
                  <Clock className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">
                    © 2026 CyberShield AI
                  </p>
                  <p className="text-xs text-gray-500">
                    Made with ❤️ for Digital Security
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <TrendingUp className="w-5 h-5 text-cyber-success" />
              </div>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;