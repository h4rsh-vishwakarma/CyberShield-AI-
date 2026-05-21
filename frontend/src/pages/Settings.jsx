import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Shield,
  Bell,
  User,
  Palette,
  Database,
  Zap,
  Lock,
  Globe,
  Moon,
  Sun,
  Save,
  RotateCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

export const Settings = () => {
  const { isDark, toggleTheme } = useTheme();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      digest: 'daily'
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
      ipWhitelist: '',
      loginAlerts: true
    },
    appearance: {
      theme: isDark ? 'dark' : 'light',
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY'
    },
    system: {
      autoUpdate: true,
      debugMode: false,
      logLevel: 'info',
      cacheEnabled: true
    },
    ai: {
      modelVersion: 'latest',
      confidenceThreshold: 85,
      autoAnalyze: true,
      batchProcessing: true
    }
  });

  // Load settings from backend on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/settings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setSettings(data.settings);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        toast.success('Settings saved successfully');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      const defaultSettings = {
        notifications: {
          email: true,
          push: true,
          sms: false,
          digest: 'daily'
        },
        security: {
          twoFactor: false,
          sessionTimeout: 30,
          ipWhitelist: '',
          loginAlerts: true
        },
        appearance: {
          theme: isDark ? 'dark' : 'light',
          language: 'en',
          timezone: 'UTC',
          dateFormat: 'MM/DD/YYYY'
        },
        system: {
          autoUpdate: true,
          debugMode: false,
          logLevel: 'info',
          cacheEnabled: true
        },
        ai: {
          modelVersion: 'latest',
          confidenceThreshold: 85,
          autoAnalyze: true,
          batchProcessing: true
        }
      };
      setSettings(defaultSettings);
      toast.success('Settings reset to defaults');
    } catch (error) {
      console.error('Failed to reset settings:', error);
      toast.error('Failed to reset settings');
    }
  };

  const handleChangePassword = () => {
    const currentPassword = prompt('Enter current password:');
    if (!currentPassword) return;

    const newPassword = prompt('Enter new password:');
    if (!newPassword) return;

    const confirmPassword = prompt('Confirm new password:');
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    const changePassword = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/change-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword
          })
        });

        if (response.ok) {
          toast.success('Password changed successfully');
        } else {
          const errorData = await response.json();
          toast.error(errorData.detail || 'Failed to change password');
        }
      } catch (error) {
        console.error('Failed to change password:', error);
        toast.error('Failed to change password');
      }
    };

    changePassword();
  };

  const handleManageApiKeys = () => {
    toast('API Key Management - Feature coming soon!', { icon: '🔑' });
  };

  const ToggleSwitch = ({ enabled, onChange, label }) => (
    <div className="flex items-center justify-between">
      <span className="text-gray-300">{label}</span>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          enabled ? 'bg-cyber-primary' : 'bg-gray-600'
        }`}
      >
        <motion.div
          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md ${
            enabled ? 'left-7' : 'left-1'
          }`}
          animate={{ left: enabled ? '1.75rem' : '0.25rem' }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );

  const SectionCard = ({ icon: Icon, title, children }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-cyber-primary/20 to-cyber-secondary/20">
          <Icon className="w-6 h-6 text-cyber-primary" />
        </div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      {children}
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          className="w-16 h-16 border-4 border-cyber-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
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
          <h1 className="text-3xl font-bold gradient-text">Settings</h1>
          <p className="text-gray-400 mt-1">Configure your CyberShield AI preferences</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="btn-secondary flex items-center gap-2"
          >
            <RotateCw className="w-5 h-5" />
            Reset Defaults
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
                Save Settings
              </>
            )}
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance Settings */}
        <SectionCard icon={Palette} title="Appearance">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-cyber-light/30">
              <div className="flex items-center gap-3">
                {isDark ? (
                  <Moon className="w-5 h-5 text-cyber-primary" />
                ) : (
                  <Sun className="w-5 h-5 text-cyber-primary" />
                )}
                <div>
                  <p className="text-white font-medium">Dark Mode</p>
                  <p className="text-sm text-gray-400">Toggle dark/light theme</p>
                </div>
              </div>
              <ToggleSwitch
                enabled={isDark}
                onChange={toggleTheme}
                label=""
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Language</label>
              <select
                value={settings.appearance.language}
                onChange={(e) => setSettings({
                  ...settings,
                  appearance: { ...settings.appearance, language: e.target.value }
                })}
                className="input"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="zh">Chinese</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Timezone</label>
              <select
                value={settings.appearance.timezone}
                onChange={(e) => setSettings({
                  ...settings,
                  appearance: { ...settings.appearance, timezone: e.target.value }
                })}
                className="input"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">GMT</option>
                <option value="Asia/Tokyo">Japan Time</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Date Format</label>
              <select
                value={settings.appearance.dateFormat}
                onChange={(e) => setSettings({
                  ...settings,
                  appearance: { ...settings.appearance, dateFormat: e.target.value }
                })}
                className="input"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </SectionCard>

        {/* Notification Settings */}
        <SectionCard icon={Bell} title="Notifications">
          <div className="space-y-4">
            <ToggleSwitch
              enabled={settings.notifications.email}
              onChange={(enabled) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, email: enabled }
              })}
              label="Email Notifications"
            />
            <ToggleSwitch
              enabled={settings.notifications.push}
              onChange={(enabled) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, push: enabled }
              })}
              label="Push Notifications"
            />
            <ToggleSwitch
              enabled={settings.notifications.sms}
              onChange={(enabled) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, sms: enabled }
              })}
              label="SMS Alerts"
            />
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Digest Frequency</label>
              <select
                value={settings.notifications.digest}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, digest: e.target.value }
                })}
                className="input"
              >
                <option value="daily">Daily Digest</option>
                <option value="weekly">Weekly Summary</option>
                <option value="monthly">Monthly Report</option>
                <option value="never">Never</option>
              </select>
            </div>
          </div>
        </SectionCard>

        {/* Security Settings */}
        <SectionCard icon={Shield} title="Security">
          <div className="space-y-4">
            <ToggleSwitch
              enabled={settings.security.twoFactor}
              onChange={(enabled) => setSettings({
                ...settings,
                security: { ...settings.security, twoFactor: enabled }
              })}
              label="Two-Factor Authentication"
            />
            <ToggleSwitch
              enabled={settings.security.loginAlerts}
              onChange={(enabled) => setSettings({
                ...settings,
                security: { ...settings.security, loginAlerts: enabled }
              })}
              label="Login Alerts"
            />
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Session Timeout (minutes)</label>
              <input
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) => setSettings({
                  ...settings,
                  security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
                })}
                className="input"
                min="5"
                max="120"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">IP Whitelist (comma-separated)</label>
              <textarea
                value={settings.security.ipWhitelist}
                onChange={(e) => setSettings({
                  ...settings,
                  security: { ...settings.security, ipWhitelist: e.target.value }
                })}
                placeholder="192.168.1.1, 10.0.0.1"
                className="input min-h-[80px] resize-none"
              />
            </div>
          </div>
        </SectionCard>

        {/* AI Settings */}
        <SectionCard icon={Zap} title="AI Configuration">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Model Version</label>
              <select
                value={settings.ai.modelVersion}
                onChange={(e) => setSettings({
                  ...settings,
                  ai: { ...settings.ai, modelVersion: e.target.value }
                })}
                className="input"
              >
                <option value="latest">Latest (v2.3.1)</option>
                <option value="stable">Stable (v2.2.0)</option>
                <option value="experimental">Experimental (v2.4.0-beta)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Confidence Threshold (%)</label>
              <input
                type="range"
                min="50"
                max="100"
                value={settings.ai.confidenceThreshold}
                onChange={(e) => setSettings({
                  ...settings,
                  ai: { ...settings.ai, confidenceThreshold: parseInt(e.target.value) }
                })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>50%</span>
                <span className="text-cyber-primary font-semibold">{settings.ai.confidenceThreshold}%</span>
                <span>100%</span>
              </div>
            </div>
            <ToggleSwitch
              enabled={settings.ai.autoAnalyze}
              onChange={(enabled) => setSettings({
                ...settings,
                ai: { ...settings.ai, autoAnalyze: enabled }
              })}
              label="Auto-Analyze New Content"
            />
            <ToggleSwitch
              enabled={settings.ai.batchProcessing}
              onChange={(enabled) => setSettings({
                ...settings,
                ai: { ...settings.ai, batchProcessing: enabled }
              })}
              label="Enable Batch Processing"
            />
          </div>
        </SectionCard>

        {/* System Settings */}
        <SectionCard icon={Database} title="System">
          <div className="space-y-4">
            <ToggleSwitch
              enabled={settings.system.autoUpdate}
              onChange={(enabled) => setSettings({
                ...settings,
                system: { ...settings.system, autoUpdate: enabled }
              })}
              label="Auto-Update System"
            />
            <ToggleSwitch
              enabled={settings.system.debugMode}
              onChange={(enabled) => setSettings({
                ...settings,
                system: { ...settings.system, debugMode: enabled }
              })}
              label="Debug Mode"
            />
            <ToggleSwitch
              enabled={settings.system.cacheEnabled}
              onChange={(enabled) => setSettings({
                ...settings,
                system: { ...settings.system, cacheEnabled: enabled }
              })}
              label="Enable Caching"
            />
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Log Level</label>
              <select
                value={settings.system.logLevel}
                onChange={(e) => setSettings({
                  ...settings,
                  system: { ...settings.system, logLevel: e.target.value }
                })}
                className="input"
              >
                <option value="error">Error Only</option>
                <option value="warn">Warning & Error</option>
                <option value="info">Info, Warning & Error</option>
                <option value="debug">Debug, Info, Warning & Error</option>
              </select>
            </div>
          </div>
        </SectionCard>

        {/* Account Settings */}
        <SectionCard icon={User} title="Account">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Display Name</label>
              <input
                type="text"
                defaultValue="CyberShield User"
                className="input"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Email Address</label>
              <input
                type="email"
                defaultValue="user@cybershield.ai"
                className="input"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleChangePassword}
                className="btn-secondary flex-1 flex items-center justify-center gap-2"
              >
                <Lock className="w-5 h-5" />
                Change Password
              </button>
              <button
                onClick={handleManageApiKeys}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <Globe className="w-5 h-5" />
                Manage API Keys
              </button>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default Settings;