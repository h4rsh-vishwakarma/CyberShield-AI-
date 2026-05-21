import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Key,
  Plus,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  Shield,
  Calendar,
  Activity,
  Download,
  Upload,
  Search,
  Filter,
  Check,
  X,
  Clock,
  Lock,
  Unlock,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ApiKeyManagement = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showKeyDetails, setShowKeyDetails] = useState(null);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPermissions, setNewKeyPermissions] = useState(['read']);
  const [creating, setCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [copiedKey, setCopiedKey] = useState(null);
  const [usageData, setUsageData] = useState({});

  // Available permissions
  const availablePermissions = [
    { id: 'read', label: 'Read Access', description: 'View data and analytics', icon: 'Eye' },
    { id: 'write', label: 'Write Access', description: 'Create and modify data', icon: 'Edit' },
    { id: 'delete', label: 'Delete Access', description: 'Remove data and resources', icon: 'Trash' },
    { id: 'admin', label: 'Admin Access', description: 'Full system administration', icon: 'Shield' }
  ];

  // Permission icons
  const PermissionIcons = {
    'read': Eye,
    'write': Lock,
    'delete': Trash2,
    'admin': Shield
  };

  // Load API keys on component mount
  useEffect(() => {
    loadApiKeys();
    loadUsageData();
  }, []);

  const loadApiKeys = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8001/api/api-keys', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setApiKeys(data.api_keys || []);
      } else {
        toast.error('Failed to load API keys');
      }
    } catch (error) {
      console.error('Failed to load API keys:', error);
      toast.error('Failed to load API keys');
    } finally {
      setLoading(false);
    }
  };

  const loadUsageData = async () => {
    // Simulate usage data (in production, this would come from backend)
    setUsageData({
      'total_requests': 12543,
      'successful_requests': 12058,
      'failed_requests': 485,
      'average_response_time': '245ms',
      'keys_used_this_month': 8
    });
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a key name');
      return;
    }

    if (newKeyPermissions.length === 0) {
      toast.error('Please select at least one permission');
      return;
    }

    setCreating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8001/api/api-keys', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newKeyName,
          permissions: newKeyPermissions
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('API key created successfully!');

        // Show the key in a modal so user can copy it
        setShowKeyDetails({
          ...data.api_key,
          isNew: true,
          instructions: 'Save this key now - you won\'t be able to see it again!'
        });

        // Reset form
        setNewKeyName('');
        setNewKeyPermissions(['read']);
        setShowCreateModal(false);

        // Reload keys
        await loadApiKeys();
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || 'Failed to create API key');
      }
    } catch (error) {
      console.error('Failed to create API key:', error);
      toast.error('Failed to create API key');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteKey = async (keyId) => {
    if (!window.confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8001/api/api-keys/${keyId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success('API key deleted successfully');
        await loadApiKeys();
      } else {
        toast.error('Failed to delete API key');
      }
    } catch (error) {
      console.error('Failed to delete API key:', error);
      toast.error('Failed to delete API key');
    }
  };

  const handleCopyKey = async (key, keyId) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedKey(keyId);
      toast.success('API key copied to clipboard');

      // Clear copied state after 2 seconds
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (error) {
      toast.error('Failed to copy API key');
    }
  };

  const handleTogglePermission = (permissionId) => {
    if (newKeyPermissions.includes(permissionId)) {
      setNewKeyPermissions(newKeyPermissions.filter(p => p !== permissionId));
    } else {
      setNewKeyPermissions([...newKeyPermissions, permissionId]);
    }
  };

  const getFilteredKeys = () => {
    return apiKeys.filter(key => {
      const matchesSearch = key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         key.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' ||
                           (filterStatus === 'active' && key.last_used) ||
                           (filterStatus === 'inactive' && !key.last_used);
      return matchesSearch && matchesFilter;
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (key) => {
    if (key.last_used) {
      return <span className="inline-flex items-center px-2 py-1 bg-cyber-success/20 text-cyber-success rounded-full text-xs font-medium">
        <div className="w-2 h-2 bg-cyber-success rounded-full mr-2"></div>
        Active
      </span>;
    } else {
      return <span className="inline-flex items-center px-2 py-1 bg-cyber-warning/20 text-cyber-warning rounded-full text-xs font-medium">
        <div className="w-2 h-2 bg-cyber-warning rounded-full mr-2"></div>
        Inactive
      </span>;
    }
  };

  const Card = ({ icon: Icon, title, value, subtitle, trend, onClick }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="card cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg bg-gradient-to-br from-cyber-primary/20 to-cyber-secondary/20">
          <Icon className="w-6 h-6 text-cyber-primary" />
        </div>
        {trend && (
          <span className={`text-xs font-medium ${trend > 0 ? 'text-cyber-success' : 'text-cyber-danger'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
      <p className="text-gray-400 text-sm">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          className="w-16 h-16 border-4 border-cyber-primary border-t-transparent rounded-full mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-cyber-primary text-lg font-semibold">Loading API Keys...</p>
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
          <h1 className="text-3xl font-bold gradient-text">API Key Management</h1>
          <p className="text-gray-400 mt-1">Manage your API keys for secure access to CyberShield AI</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create New Key
        </button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card
          icon={Key}
          title="Total Keys"
          value={apiKeys.length}
          subtitle="Active and inactive"
          trend={apiKeys.length > 0 ? 5 : 0}
        />
        <Card
          icon={Activity}
          title="Total Requests"
          value={usageData.total_requests.toLocaleString()}
          subtitle="All time usage"
          trend={3}
        />
        <Card
          icon={Check}
          title="Success Rate"
          value={`${Math.round((usageData.successful_requests / usageData.total_requests) * 100)}%`}
          subtitle="Request success rate"
          trend={2}
        />
        <Card
          icon={Clock}
          title="Avg Response Time"
          value={usageData.average_response_time}
          subtitle="API performance"
          trend={-1}
        />
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search API keys by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input"
          >
            <option value="all">All Keys</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            onClick={loadApiKeys}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* API Keys List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Your API Keys</h2>
          <span className="text-gray-400 text-sm">
            {getFilteredKeys().length} of {apiKeys.length} keys shown
          </span>
        </div>

        {getFilteredKeys().length === 0 ? (
          <div className="text-center py-12">
            <Key className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">No API keys found</p>
            <p className="text-sm text-gray-500 mb-4">Create your first API key to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary mx-auto"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create API Key
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {getFilteredKeys().map((key, index) => (
              <motion.div
                key={key.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + (index * 0.1) }}
                className="p-4 rounded-lg bg-cyber-light/30 border border-cyber-light/30 hover:border-cyber-primary/50 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-cyber-primary/20 to-cyber-secondary/20">
                      <Key className="w-6 h-6 text-cyber-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium mb-1">{key.name}</h3>
                      <div className="flex items-center gap-4 text-sm">
                        <code className="text-cyber-secondary bg-cyber-dark/50 px-2 py-1 rounded font-mono">
                          {key.key}
                        </code>
                        {getStatusBadge(key)}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleCopyKey(key.key, key.id)}
                      className={`btn-secondary flex items-center justify-center gap-2 ${
                        copiedKey === key.id ? 'bg-cyber-success text-cyber-darker' : ''
                      }`}
                    >
                      {copiedKey === key.id ? (
                        <>
                          <Check className="w-5 h-5" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-5 h-5" />
                          Copy
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setShowKeyDetails(key)}
                      className="btn-secondary flex items-center justify-center gap-2"
                    >
                      <Eye className="w-5 h-5" />
                      Details
                    </button>

                    <button
                      onClick={() => handleDeleteKey(key.id)}
                      className="btn-danger flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-5 h-5" />
                      Delete
                    </button>
                  </div>
                </div>

                {/* Permissions */}
                <div className="mt-3 pt-3 border-t border-cyber-light/30">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Shield className="w-4 h-4" />
                    <span>Permissions:</span>
                    {key.permissions && key.permissions.length > 0 ? (
                      key.permissions.map((perm, idx) => {
                        const PermissionIcon = PermissionIcons[perm];
                        return (
                          <span
                            key={idx}
                            className="ml-2 px-2 py-1 bg-cyber-dark/50 rounded text-cyber-secondary border border-cyber-secondary/30"
                          >
                            <PermissionIcon className="w-3 h-3 mr-1 inline" />
                            {perm}
                          </span>
                        );
                      })
                    ) : (
                      <span className="ml-2 text-gray-500">No permissions assigned</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Create Key Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card max-w-lg w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Create New API Key</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Key Name</label>
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="My API Key"
                    className="input"
                    maxLength={50}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 block mb-2">Permissions</label>
                  <div className="grid grid-cols-2 gap-3">
                    {availablePermissions.map((perm) => {
                      const PermissionIcon = perm.icon;
                      return (
                        <button
                          key={perm.id}
                          type="button"
                          onClick={() => handleTogglePermission(perm.id)}
                          className={`p-3 rounded-lg border transition-all duration-300 flex items-center gap-3 ${
                            newKeyPermissions.includes(perm.id)
                              ? 'border-cyber-primary bg-cyber-primary/20 text-cyber-primary'
                              : 'border-cyber-light/30 text-gray-400 hover:border-cyber-light/50'
                          }`}
                        >
                          <PermissionIcon className="w-5 h-5" />
                          <div className="text-left">
                            <div className="text-sm font-medium">{perm.label}</div>
                            <div className="text-xs opacity-75">{perm.description}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 bg-cyber-warning/20 border border-cyber-warning/30 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-cyber-warning mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-cyber-warning">Important Security Note</p>
                    <p className="text-gray-400 mt-1">
                      You will only see the full API key once. Make sure to copy and save it securely.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateKey}
                  disabled={creating}
                  className="btn-primary flex-1"
                >
                  {creating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-cyber-darker border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Create Key
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Key Details Modal */}
      <AnimatePresence>
        {showKeyDetails && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card max-w-lg w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">API Key Details</h2>
                <button
                  onClick={() => setShowKeyDetails(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {showKeyDetails.isNew && (
                <div className="mb-6 p-4 bg-cyber-success/20 border border-cyber-success rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-cyber-success/30 rounded-lg">
                      <Check className="w-6 h-6 text-cyber-success" />
                    </div>
                    <div>
                      <p className="font-semibold text-cyber-success">New API Key Created!</p>
                      <p className="text-sm text-gray-400 mt-1">{showKeyDetails.instructions}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-2">API Key</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={showKeyDetails.key}
                      readOnly
                      className="input font-mono text-cyber-secondary"
                    />
                    <button
                      onClick={() => handleCopyKey(showKeyDetails.key, showKeyDetails.id)}
                      className="btn-secondary px-3"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Key ID</label>
                    <div className="text-white">{showKeyDetails.id}</div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Created</label>
                    <div className="text-white">{formatDate(showKeyDetails.created_at)}</div>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 block mb-2">Permissions</label>
                  <div className="flex flex-wrap gap-2">
                    {showKeyDetails.permissions && showKeyDetails.permissions.map((perm, idx) => {
                      const PermissionIcon = PermissionIcons[perm];
                      return (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-cyber-dark/50 rounded text-cyber-secondary border border-cyber-secondary/30 text-sm"
                        >
                          <PermissionIcon className="w-4 h-4 mr-1 inline" />
                          {perm}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {showKeyDetails.last_used && (
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Last Used</label>
                    <div className="text-white">{formatDate(showKeyDetails.last_used)}</div>
                  </div>
                )}

                {!showKeyDetails.last_used && !showKeyDetails.isNew && (
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Status</label>
                    <span className="text-cyber-warning">Never used</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowKeyDetails(null)}
                className="btn-primary w-full"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ApiKeyManagement;