import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Map,
  TrendingUp,
  AlertTriangle,
  Shield,
  Calendar,
  Filter,
  Download,
  Activity,
  BarChart3,
  PieChart,
  MapPin,
  Clock,
  Users,
  Zap,
  Layers,
  Target,
  Eye,
  Navigation
} from 'lucide-react';
import toast from 'react-hot-toast';

export const CrimeAnalytics = () => {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [timeRange, setTimeRange] = useState('24h');
  const [crimeType, setCrimeType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedRegion, timeRange, crimeType]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockData = {
        totalCrimes: Math.floor(Math.random() * 100) + 200,
        highRiskAreas: Math.floor(Math.random() * 5) + 3,
        trends: {
          increase: Math.random() > 0.5,
          percentage: Math.floor(Math.random() * 20) + 5,
        },
        hotspots: [
          { id: 1, name: 'Downtown', risk: 92, lat: 40.7128, lng: -74.0060, crimes: 45 },
          { id: 2, name: 'Industrial Zone', risk: 87, lat: 40.7489, lng: -73.9680, crimes: 38 },
          { id: 3, name: 'Residential Area', risk: 65, lat: 40.7580, lng: -73.9855, crimes: 22 },
          { id: 4, name: 'Shopping District', risk: 78, lat: 40.7589, lng: -73.9851, crimes: 31 },
          { id: 5, name: 'Tech Park', risk: 45, lat: 40.7614, lng: -73.9776, crimes: 12 },
        ],
        crimeTypes: [
          { type: 'Theft', count: 45, percentage: 28, trend: 'up' },
          { type: 'Assault', count: 32, percentage: 20, trend: 'down' },
          { type: 'Vandalism', count: 28, percentage: 18, trend: 'up' },
          { type: 'Cybercrime', count: 35, percentage: 22, trend: 'up' },
          { type: 'Other', count: 20, percentage: 12, trend: 'stable' },
        ],
        predictions: {
          next24h: Math.floor(Math.random() * 20) + 30,
          next7d: Math.floor(Math.random() * 100) + 150,
          confidence: Math.floor(Math.random() * 10) + 85,
        }
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`stat-card ${color}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-gradient-to-br from-cyber-primary/20 to-cyber-secondary/20">
          <Icon className="w-6 h-6 text-cyber-primary" />
        </div>
        <div className="flex items-center gap-1">
          {trend === 'up' ? (
            <TrendingUp className="w-4 h-4 text-cyber-danger" />
          ) : (
            <TrendingUp className="w-4 h-4 text-cyber-success rotate-180" />
          )}
          <span className={`text-sm font-medium ${trend === 'up' ? 'text-cyber-danger' : 'text-cyber-success'}`}>
            {change}
          </span>
        </div>
      </div>
      <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
      <p className="text-gray-400 text-sm">{title}</p>
    </motion.div>
  );

  const HotspotCard = ({ hotspot, index }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-4 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
        hotspot.risk >= 80 ? 'bg-cyber-danger/10 border-cyber-danger/50' :
        hotspot.risk >= 60 ? 'bg-cyber-warning/10 border-cyber-warning/50' :
        'bg-cyber-success/10 border-cyber-success/50'
      }`}
      onClick={() => toast.success(`Viewing details for ${hotspot.name}`)}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-white">{hotspot.name}</h4>
        <MapPin className={`w-4 h-4 ${
          hotspot.risk >= 80 ? 'text-cyber-danger' :
          hotspot.risk >= 60 ? 'text-cyber-warning' :
          'text-cyber-success'
        }`} />
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Risk Level</span>
        <span className={`font-semibold ${
          hotspot.risk >= 80 ? 'text-cyber-danger' :
          hotspot.risk >= 60 ? 'text-cyber-warning' :
          'text-cyber-success'
        }`}>
          {hotspot.risk}%
        </span>
      </div>
      <div className="flex items-center justify-between text-sm mt-1">
        <span className="text-gray-400">Reported Cases</span>
        <span className="text-white font-medium">{hotspot.crimes}</span>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyber-primary border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-cyber-primary text-lg font-semibold">Loading Analytics...</p>
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
          <h1 className="text-3xl font-bold gradient-text">Crime Analytics</h1>
          <p className="text-gray-400 mt-1">AI-powered crime prediction and hotspot analysis</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2" onClick={() => toast.success('Report exported')}>
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-cyber-primary" />
            <span className="text-gray-400">Filters:</span>
          </div>

          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="input min-w-[150px]"
          >
            <option value="all">All Regions</option>
            <option value="downtown">Downtown</option>
            <option value="suburbs">Suburbs</option>
            <option value="industrial">Industrial</option>
          </select>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input min-w-[150px]"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>

          <select
            value={crimeType}
            onChange={(e) => setCrimeType(e.target.value)}
            className="input min-w-[150px]"
          >
            <option value="all">All Crime Types</option>
            <option value="theft">Theft</option>
            <option value="assault">Assault</option>
            <option value="vandalism">Vandalism</option>
            <option value="cybercrime">Cybercrime</option>
          </select>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Crimes"
          value={analyticsData.totalCrimes}
          change={`${analyticsData.trends.increase ? '+' : '-'}${analyticsData.trends.percentage}%`}
          icon={Shield}
          trend={analyticsData.trends.increase ? 'up' : 'down'}
        />
        <StatCard
          title="High Risk Areas"
          value={analyticsData.highRiskAreas}
          change="+2"
          icon={AlertTriangle}
          trend="up"
        />
        <StatCard
          title="Predicted (24h)"
          value={analyticsData.predictions.next24h}
          change={`±${Math.floor(Math.random() * 5) + 1}`}
          icon={Target}
          trend="stable"
        />
        <StatCard
          title="Prediction Accuracy"
          value={`${analyticsData.predictions.confidence}%`}
          change="+3%"
          icon={Zap}
          trend="up"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 card"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Crime Heatmap</h2>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded hover:bg-cyber-light/50 transition-colors">
                <Layers className="w-4 h-4 text-gray-400" />
              </button>
              <button className="p-2 rounded hover:bg-cyber-light/50 transition-colors">
                <Navigation className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
          <div className="h-96 bg-cyber-darker/50 rounded-lg border border-cyber-light/30 flex items-center justify-center relative overflow-hidden">
            {/* Simulated Heatmap */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyber-danger/20 via-cyber-warning/10 to-cyber-success/5" />
            <div className="relative z-10 text-center space-y-4">
              <Map className="w-16 h-16 text-cyber-primary mx-auto animate-pulse" />
              <div>
                <h3 className="text-lg font-bold text-white">Interactive Crime Map</h3>
                <p className="text-gray-400 text-sm">Real-time hotspot visualization</p>
              </div>
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyber-danger" />
                  <span className="text-xs text-gray-400">High Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyber-warning" />
                  <span className="text-xs text-gray-400">Medium Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyber-success" />
                  <span className="text-xs text-gray-400">Low Risk</span>
                </div>
              </div>
            </div>
            {/* Hotspot markers */}
            {analyticsData.hotspots.map((hotspot) => (
              <motion.div
                key={hotspot.id}
                className={`absolute w-4 h-4 rounded-full cursor-pointer hover:scale-150 transition-transform ${
                  hotspot.risk >= 80 ? 'bg-cyber-danger animate-pulse' :
                  hotspot.risk >= 60 ? 'bg-cyber-warning' :
                  'bg-cyber-success'
                }`}
                style={{
                  left: `${(hotspot.lng + 74) * 20}%`,
                  top: `${(40.8 - hotspot.lat) * 20}%`
                }}
                whileHover={{ scale: 1.5 }}
                onClick={() => toast.success(`${hotspot.name}: ${hotspot.risk}% risk level`)}
              />
            ))}
          </div>
        </motion.div>

        {/* Hotspots List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Risk Hotspots</h2>
              <span className="text-sm text-gray-400">{analyticsData.hotspots.length} areas</span>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {analyticsData.hotspots.map((hotspot, index) => (
                <HotspotCard key={hotspot.id} hotspot={hotspot} index={index} />
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <h3 className="text-lg font-bold text-white mb-3">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-cyber-primary" />
                  <span className="text-sm text-gray-400">Active Surveillance</span>
                </div>
                <span className="text-sm text-white font-medium">24/7</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyber-success" />
                  <span className="text-sm text-gray-400">System Status</span>
                </div>
                <span className="text-sm text-cyber-success font-medium">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyber-warning" />
                  <span className="text-sm text-gray-400">Last Update</span>
                </div>
                <span className="text-sm text-white font-medium">2 min ago</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Crime Types Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h2 className="text-xl font-bold text-white mb-4">Crime Types Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {analyticsData.crimeTypes.map((crime, index) => (
            <motion.div
              key={crime.type}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-lg bg-cyber-light/30 border border-cyber-light/30 hover:border-cyber-primary/50 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <BarChart3 className="w-5 h-5 text-cyber-primary" />
                <div className="flex items-center gap-1">
                  {crime.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3 text-cyber-danger" />
                  ) : crime.trend === 'down' ? (
                    <TrendingUp className="w-3 h-3 text-cyber-success rotate-180" />
                  ) : (
                    <div className="w-3 h-3" />
                  )}
                </div>
              </div>
              <h4 className="font-semibold text-white mb-1">{crime.type}</h4>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Cases</span>
                  <span className="text-sm text-white font-medium">{crime.count}</span>
                </div>
                <div className="h-2 bg-cyber-darker rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${crime.percentage}%` }}
                    className={`h-full ${
                      crime.percentage >= 25 ? 'bg-cyber-danger' :
                      crime.percentage >= 15 ? 'bg-cyber-warning' :
                      'bg-cyber-success'
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Predictions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-cyber-primary" />
            <h3 className="text-lg font-bold text-white">24-Hour Prediction</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Expected Incidents</span>
              <span className="text-2xl font-bold text-white">{analyticsData.predictions.next24h}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Confidence</span>
                <span className="text-cyber-primary font-medium">{analyticsData.predictions.confidence}%</span>
              </div>
              <div className="h-2 bg-cyber-darker rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${analyticsData.predictions.confidence}%` }}
                  className="h-full bg-gradient-to-r from-cyber-primary to-cyber-secondary"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-cyber-secondary" />
            <h3 className="text-lg font-bold text-white">7-Day Forecast</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Predicted Total</span>
              <span className="text-2xl font-bold text-white">{analyticsData.predictions.next7d}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className={`w-4 h-4 ${analyticsData.trends.increase ? 'text-cyber-danger' : 'text-cyber-success'}`} />
              <span className={`text-sm ${analyticsData.trends.increase ? 'text-cyber-danger' : 'text-cyber-success'}`}>
                {analyticsData.trends.increase ? 'Increasing trend' : 'Decreasing trend'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CrimeAnalytics;