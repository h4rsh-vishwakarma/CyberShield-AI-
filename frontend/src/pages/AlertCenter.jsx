import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  Download,
  Trash2,
  Eye,
  MoreVertical,
  Zap,
  Shield,
  Activity,
  Navigation,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AlertCenter = () => {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterAlerts();
  }, [alerts, filter, searchQuery]);

  const fetchAlerts = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockAlerts = [
        {
          id: 1,
          type: 'danger',
          title: 'Critical Security Breach',
          message: 'Unauthorized access attempt detected in server cluster A-7',
          source: 'Security Monitor',
          timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
          severity: 'critical',
          status: 'active',
          confidence: 96,
          location: 'Server Room A',
          assignedTo: null
        },
        {
          id: 2,
          type: 'warning',
          title: 'Suspicious Activity Detected',
          message: 'Unusual login pattern from IP 192.168.1.100',
          source: 'Authentication System',
          timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
          severity: 'high',
          status: 'active',
          confidence: 78,
          location: 'Network Edge',
          assignedTo: 'John Smith'
        },
        {
          id: 3,
          type: 'success',
          title: 'System Update Completed',
          message: 'AI model v2.3.1 successfully deployed to production',
          source: 'Deployment System',
          timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
          severity: 'info',
          status: 'resolved',
          confidence: 100,
          location: 'Cloud Infrastructure',
          assignedTo: null
        },
        {
          id: 4,
          type: 'danger',
          title: 'Malware Signature Detected',
          message: 'Known malware pattern identified in file upload',
          source: 'File Scanner',
          timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
          severity: 'critical',
          status: 'investigating',
          confidence: 94,
          location: 'Upload Server',
          assignedTo: 'Security Team'
        },
        {
          id: 5,
          type: 'warning',
          title: 'High Resource Usage',
          message: 'CPU usage exceeded 90% threshold for 5 minutes',
          source: 'System Monitor',
          timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
          severity: 'medium',
          status: 'active',
          confidence: 85,
          location: 'Application Server',
          assignedTo: null
        },
        {
          id: 6,
          type: 'success',
          title: 'Backup Completed',
          message: 'Daily backup completed successfully',
          source: 'Backup System',
          timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
          severity: 'info',
          status: 'resolved',
          confidence: 100,
          location: 'Storage Server',
          assignedTo: null
        },
        {
          id: 7,
          type: 'danger',
          title: 'Data Exfiltration Attempt',
          message: 'Large data transfer detected to external IP',
          source: 'Network Monitor',
          timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
          severity: 'critical',
          status: 'investigating',
          confidence: 91,
          location: 'Network Gateway',
          assignedTo: 'Incident Response Team'
        },
      ];

      setAlerts(mockAlerts);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
      toast.error('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const filterAlerts = () => {
    let filtered = alerts;

    if (filter !== 'all') {
      filtered = filtered.filter(alert => alert.type === filter);
    }

    if (searchQuery) {
      filtered = filtered.filter(alert =>
        alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredAlerts(filtered);
  };

  const handleAlertAction = (alertId, action) => {
    const alertActions = {
      acknowledge: 'Alert acknowledged',
      resolve: 'Alert marked as resolved',
      investigate: 'Alert moved to investigation',
      delete: 'Alert deleted'
    };

    toast.success(alertActions[action] || 'Action completed');

    if (action === 'delete') {
      setAlerts(alerts.filter(alert => alert.id !== alertId));
    } else {
      setAlerts(alerts.map(alert =>
        alert.id === alertId
          ? { ...alert, status: action === 'resolve' ? 'resolved' : action === 'investigate' ? 'investigating' : action }
          : alert
      ));
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'text-cyber-danger',
      high: 'text-cyber-danger',
      medium: 'text-cyber-warning',
      low: 'text-cyber-success',
      info: 'text-cyber-primary'
    };
    return colors[severity] || 'text-gray-400';
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-cyber-danger/20 text-cyber-danger border-cyber-danger/50',
      investigating: 'bg-cyber-warning/20 text-cyber-warning border-cyber-warning/50',
      resolved: 'bg-cyber-success/20 text-cyber-success border-cyber-success/50'
    };
    return badges[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  };

  const AlertCard = ({ alert }) => {
    const icons = {
      danger: AlertTriangle,
      warning: AlertTriangle,
      success: CheckCircle,
      info: Shield
    };

    const AlertIcon = icons[alert.type] || AlertTriangle;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`alert-item ${alert.type} cursor-pointer hover:scale-[1.02] transform transition-all`}
        onClick={() => setSelectedAlert(alert)}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${
            alert.type === 'danger' ? 'bg-cyber-danger/20' :
            alert.type === 'warning' ? 'bg-cyber-warning/20' :
            alert.type === 'success' ? 'bg-cyber-success/20' :
            'bg-cyber-primary/20'
          }`}>
            <AlertIcon className={`w-5 h-5 ${
              alert.type === 'danger' ? 'text-cyber-danger' :
              alert.type === 'warning' ? 'text-cyber-warning' :
              alert.type === 'success' ? 'text-cyber-success' :
              'text-cyber-primary'
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <h4 className="font-semibold text-white">{alert.title}</h4>
              <span className={`px-2 py-1 text-xs font-medium rounded border ${getStatusBadge(alert.status)}`}>
                {alert.status.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-400 line-clamp-2">{alert.message}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(alert.timestamp).toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Navigation className="w-3 h-3" />
                {alert.location}
              </span>
              <span className={`flex items-center gap-1 ${getSeverityColor(alert.severity)}`}>
                <Zap className="w-3 h-3" />
                {alert.severity.toUpperCase()}
              </span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAlertAction(alert.id, 'acknowledge');
            }}
            className="p-1 hover:bg-cyber-light/50 rounded transition-colors"
          >
            <CheckCircle className="w-4 h-4 text-cyber-success" />
          </button>
        </div>
      </motion.div>
    );
  };

  const AlertDetailModal = () => {
    if (!selectedAlert) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={() => setSelectedAlert(null)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">{selectedAlert.title}</h2>
              <p className="text-gray-400 mt-1">{selectedAlert.source}</p>
            </div>
            <button
              onClick={() => setSelectedAlert(null)}
              className="p-2 rounded-lg hover:bg-cyber-light/50 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Alert Status */}
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 text-sm font-medium rounded border ${getStatusBadge(selectedAlert.status)}`}>
                {selectedAlert.status.toUpperCase()}
              </span>
              <span className={`px-3 py-1 text-sm font-medium rounded border bg-cyber-light/30 text-gray-300 border-cyber-light/30`}>
                {selectedAlert.severity.toUpperCase()} SEVERITY
              </span>
            </div>

            {/* Alert Message */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Description</h3>
              <p className="text-white">{selectedAlert.message}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-cyber-light/30">
                <p className="text-xs text-gray-400 mb-1">Location</p>
                <p className="text-white font-medium">{selectedAlert.location}</p>
              </div>
              <div className="p-4 rounded-lg bg-cyber-light/30">
                <p className="text-xs text-gray-400 mb-1">Confidence</p>
                <p className="text-white font-medium">{selectedAlert.confidence}%</p>
              </div>
              <div className="p-4 rounded-lg bg-cyber-light/30">
                <p className="text-xs text-gray-400 mb-1">Timestamp</p>
                <p className="text-white font-medium">{new Date(selectedAlert.timestamp).toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-lg bg-cyber-light/30">
                <p className="text-xs text-gray-400 mb-1">Assigned To</p>
                <p className="text-white font-medium">{selectedAlert.assignedTo || 'Unassigned'}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {selectedAlert.status !== 'resolved' && (
                <button
                  onClick={() => {
                    handleAlertAction(selectedAlert.id, 'resolve');
                    setSelectedAlert(null);
                  }}
                  className="btn-primary flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Mark as Resolved
                </button>
              )}
              {selectedAlert.status === 'active' && (
                <button
                  onClick={() => {
                    handleAlertAction(selectedAlert.id, 'investigate');
                    setSelectedAlert(null);
                  }}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Activity className="w-5 h-5" />
                  Start Investigation
                </button>
              )}
              <button
                onClick={() => {
                  handleAlertAction(selectedAlert.id, 'delete');
                  setSelectedAlert(null);
                }}
                className="btn-danger flex items-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Delete Alert
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyber-primary border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-cyber-primary text-lg font-semibold">Loading Alerts...</p>
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
          <h1 className="text-3xl font-bold gradient-text">Alert Center</h1>
          <p className="text-gray-400 mt-1">Real-time security alerts and notifications</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2" onClick={() => toast.success('Alerts exported')}>
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyber-primary" />
            <span className="text-gray-400">Filters:</span>
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input min-w-[150px]"
          >
            <option value="all">All Alerts</option>
            <option value="danger">Critical</option>
            <option value="warning">Warning</option>
            <option value="success">Success</option>
            <option value="info">Info</option>
          </select>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Total:</span>
            <span className="text-white font-semibold">{filteredAlerts.length}</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Critical', value: alerts.filter(a => a.severity === 'critical').length, color: 'text-cyber-danger', bg: 'bg-cyber-danger/10', border: 'border-cyber-danger/50' },
          { label: 'Active', value: alerts.filter(a => a.status === 'active').length, color: 'text-cyber-warning', bg: 'bg-cyber-warning/10', border: 'border-cyber-warning/50' },
          { label: 'Investigating', value: alerts.filter(a => a.status === 'investigating').length, color: 'text-cyber-primary', bg: 'bg-cyber-primary/10', border: 'border-cyber-primary/50' },
          { label: 'Resolved', value: alerts.filter(a => a.status === 'resolved').length, color: 'text-cyber-success', bg: 'bg-cyber-success/10', border: 'border-cyber-success/50' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border ${stat.bg} ${stat.border}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <Activity className={`w-8 h-8 ${stat.color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))
        ) : (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Alerts Found</h3>
            <p className="text-gray-400">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>

      {/* Alert Detail Modal */}
      <AlertDetailModal />
    </div>
  );
};

export default AlertCenter;