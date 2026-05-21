import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Link,
  Upload,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  PieChart,
  TrendingUp,
  Download,
  Share2,
  Copy,
  Trash2,
  Zap,
  Activity,
  Eye,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

export const FakeNewsAnalyzer = () => {
  const [activeTab, setActiveTab] = useState('text');
  const [inputText, setInputText] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const savedHistory = localStorage.getItem('fakeNewsHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const analyzeText = async (text) => {
    setAnalyzing(true);

    // Simulate API call - replace with actual backend integration
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulated analysis result
    const mockResult = {
      isFake: Math.random() > 0.5,
      confidence: Math.floor(Math.random() * 15) + 85,
      analysis: {
        credibility: Math.floor(Math.random() * 20) + 80,
        bias: ['Left-leaning', 'Right-leaning', 'Center', 'Mixed'][Math.floor(Math.random() * 4)],
        sentiment: ['Positive', 'Negative', 'Neutral'][Math.floor(Math.random() * 3)],
        sources: Math.floor(Math.random() * 10) + 1,
        facts: Math.floor(Math.random() * 8) + 2,
      },
      details: [
        {
          category: 'Source Credibility',
          status: Math.random() > 0.3 ? 'passed' : 'failed',
          description: 'Source reputation and trustworthiness assessment'
        },
        {
          category: 'Content Analysis',
          status: Math.random() > 0.2 ? 'passed' : 'failed',
          description: 'Linguistic patterns and writing style analysis'
        },
        {
          category: 'Fact Checking',
          status: Math.random() > 0.4 ? 'passed' : 'failed',
          description: 'Cross-reference with verified sources'
        },
        {
          category: 'Temporal Analysis',
          status: Math.random() > 0.3 ? 'passed' : 'failed',
          description: 'Timeline and event correlation check'
        }
      ]
    };

    setResults(mockResult);

    // Save to history
    const newHistoryItem = {
      id: Date.now(),
      type: 'text',
      content: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      result: mockResult,
      timestamp: new Date().toISOString()
    };

    const updatedHistory = [newHistoryItem, ...history].slice(0, 20);
    setHistory(updatedHistory);
    localStorage.setItem('fakeNewsHistory', JSON.stringify(updatedHistory));

    setAnalyzing(false);

    if (mockResult.isFake) {
      toast.error(`Fake news detected with ${mockResult.confidence}% confidence`);
    } else {
      toast.success(`Content appears authentic (${mockResult.confidence}% confidence)`);
    }
  };

  const handleAnalyze = async () => {
    if (activeTab === 'text') {
      if (!inputText.trim()) {
        toast.error('Please enter text to analyze');
        return;
      }
      await analyzeText(inputText);
    } else {
      if (!inputUrl.trim()) {
        toast.error('Please enter a URL to analyze');
        return;
      }
      toast.info('URL analysis coming soon!');
    }
  };

  const clearResults = () => {
    setResults(null);
    setInputText('');
    setInputUrl('');
  };

  const ResultCard = ({ result }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Main Result */}
      <div className={`p-6 rounded-xl border-2 ${
        result.isFake
          ? 'bg-cyber-danger/10 border-cyber-danger/50'
          : 'bg-cyber-success/10 border-cyber-success/50'
      }`}>
        <div className="flex items-center gap-4 mb-4">
          <div className={`p-4 rounded-xl ${
            result.isFake
              ? 'bg-cyber-danger/20'
              : 'bg-cyber-success/20'
          }`}>
            {result.isFake ? (
              <XCircle className="w-12 h-12 text-cyber-danger" />
            ) : (
              <CheckCircle className="w-12 h-12 text-cyber-success" />
            )}
          </div>
          <div>
            <h3 className={`text-2xl font-bold ${
              result.isFake ? 'text-cyber-danger' : 'text-cyber-success'
            }`}>
              {result.isFake ? 'Fake News Detected' : 'Content Appears Authentic'}
            </h3>
            <p className="text-gray-400 mt-1">
              Confidence: <span className="font-semibold text-white">{result.confidence}%</span>
            </p>
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Confidence Level</span>
            <span className={`font-semibold ${
              result.confidence >= 90 ? 'text-cyber-success' :
              result.confidence >= 70 ? 'text-cyber-primary' :
              'text-cyber-warning'
            }`}>
              {result.confidence}%
            </span>
          </div>
          <div className="h-3 bg-cyber-darker rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${result.confidence}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className={`h-full ${
                result.confidence >= 90 ? 'bg-cyber-success' :
                result.confidence >= 70 ? 'bg-cyber-primary' :
                'bg-cyber-warning'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Analysis Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: BarChart3, label: 'Credibility', value: `${result.analysis.credibility}%`, color: 'from-cyber-primary to-cyber-secondary' },
          { icon: PieChart, label: 'Bias Score', value: result.analysis.bias, color: 'from-cyber-secondary to-cyber-accent' },
          { icon: TrendingUp, label: 'Sentiment', value: result.analysis.sentiment, color: 'from-cyber-accent to-cyber-danger' },
          { icon: Activity, label: 'Sources Found', value: result.analysis.sources, color: 'from-cyber-success to-cyber-primary' },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl bg-gradient-to-br ${item.color} bg-opacity-10 border border-cyber-light/30`}
          >
            <item.icon className="w-6 h-6 text-cyber-primary mb-2" />
            <p className="text-sm text-gray-400">{item.label}</p>
            <p className="text-xl font-bold text-white">{item.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Detailed Analysis */}
      <div className="card">
        <h3 className="text-lg font-bold text-white mb-4">Detailed Analysis</h3>
        <div className="space-y-3">
          {result.details.map((detail, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                detail.status === 'passed'
                  ? 'border-cyber-success/50 bg-cyber-success/10'
                  : 'border-cyber-danger/50 bg-cyber-danger/10'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {detail.status === 'passed' ? (
                      <CheckCircle className="w-5 h-5 text-cyber-success" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-cyber-danger" />
                    )}
                    <h4 className="font-semibold text-white">{detail.category}</h4>
                  </div>
                  <p className="text-sm text-gray-400">{detail.description}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  detail.status === 'passed'
                    ? 'bg-cyber-success/20 text-cyber-success'
                    : 'bg-cyber-danger/20 text-cyber-danger'
                }`}>
                  {detail.status === 'passed' ? 'PASSED' : 'FAILED'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button className="btn-primary flex items-center gap-2" onClick={() => toast.success('Report downloaded')}>
          <Download className="w-5 h-5" />
          Download Report
        </button>
        <button className="btn-secondary flex items-center gap-2" onClick={() => toast.success('Link copied to clipboard')}>
          <Copy className="w-5 h-5" />
          Share Results
        </button>
        <button className="btn-danger flex items-center gap-2" onClick={clearResults}>
          <Trash2 className="w-5 h-5" />
          Clear
        </button>
      </div>
    </motion.div>
  );

  const HistoryItem = ({ item }) => (
    <div className="p-4 rounded-lg bg-cyber-light/30 border border-cyber-light/30 hover:border-cyber-primary/50 transition-all cursor-pointer"
         onClick={() => {
           setResults(item.result);
           setInputText(item.content);
           setShowHistory(false);
         }}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{item.content}</p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(item.timestamp).toLocaleString()}
          </p>
        </div>
        <div className={`p-2 rounded-lg ${
          item.result.isFake ? 'bg-cyber-danger/20' : 'bg-cyber-success/20'
        }`}>
          {item.result.isFake ? (
            <XCircle className="w-4 h-4 text-cyber-danger" />
          ) : (
            <CheckCircle className="w-4 h-4 text-cyber-success" />
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-medium ${
          item.result.confidence >= 90 ? 'text-cyber-success' :
          item.result.confidence >= 70 ? 'text-cyber-primary' :
          'text-cyber-warning'
        }`}>
          {item.result.confidence}% confidence
        </span>
      </div>
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
          <h1 className="text-3xl font-bold gradient-text">Fake News Analyzer</h1>
          <p className="text-gray-400 mt-1">Advanced AI-powered text analysis and verification</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`p-2 rounded-lg ${showHistory ? 'bg-cyber-primary/20 border-cyber-primary' : 'bg-cyber-light/30 border-cyber-light/30'} border`}
          >
            <Clock className="w-5 h-5 text-cyber-primary" />
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card"
          >
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab('text')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'text'
                    ? 'bg-gradient-to-r from-cyber-primary to-cyber-secondary text-cyber-darker font-semibold'
                    : 'bg-cyber-light/30 text-gray-400 hover:bg-cyber-light/50'
                }`}
              >
                <FileText className="w-5 h-5" />
                Text Analysis
              </button>
              <button
                onClick={() => setActiveTab('url')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'url'
                    ? 'bg-gradient-to-r from-cyber-primary to-cyber-secondary text-cyber-darker font-semibold'
                    : 'bg-cyber-light/30 text-gray-400 hover:bg-cyber-light/50'
                }`}
              >
                <Link className="w-5 h-5" />
                URL Analysis
              </button>
            </div>

            {/* Input Area */}
            {activeTab === 'text' ? (
              <div className="space-y-4">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter text to analyze for authenticity..."
                  className="input min-h-[200px] resize-none"
                  disabled={analyzing}
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    {inputText.length} characters
                  </span>
                  <button
                    onClick={handleAnalyze}
                    disabled={analyzing || !inputText.trim()}
                    className="btn-primary flex items-center gap-2"
                  >
                    {analyzing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-cyber-darker border-t-transparent rounded-full animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Analyze Text
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://example.com/article"
                    className="input pl-10"
                    disabled={analyzing}
                  />
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing || !inputUrl.trim()}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {analyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-cyber-darker border-t-transparent rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Analyze URL
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>

          {/* Results Section */}
          {results && <ResultCard result={results} />}

          {/* Loading State */}
          {analyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card flex items-center justify-center py-12"
            >
              <div className="text-center space-y-4">
                <motion.div
                  className="w-16 h-16 border-4 border-cyber-primary border-t-transparent rounded-full mx-auto"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <div className="space-y-2">
                  <p className="text-cyber-primary font-semibold">Analyzing Content...</p>
                  <p className="text-gray-400 text-sm">This may take a few moments</p>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4 text-cyber-warning" />
                  <span className="text-sm text-gray-400">AI Model Processing</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar - History */}
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Analysis History</h2>
                <span className="text-sm text-gray-400">{history.length} items</span>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {history.length > 0 ? (
                  history.map((item) => <HistoryItem key={item.id} item={item} />)
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">No analysis history yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tips Card */}
            <div className="card">
              <h3 className="text-lg font-bold text-white mb-3">Tips</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <Eye className="w-4 h-4 text-cyber-primary mt-0.5 flex-shrink-0" />
                  <span>Check source credibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <Eye className="w-4 h-4 text-cyber-primary mt-0.5 flex-shrink-0" />
                  <span>Look for corroborating evidence</span>
                </li>
                <li className="flex items-start gap-2">
                  <Eye className="w-4 h-4 text-cyber-primary mt-0.5 flex-shrink-0" />
                  <span>Verify author expertise</span>
                </li>
                <li className="flex items-start gap-2">
                  <Eye className="w-4 h-4 text-cyber-primary mt-0.5 flex-shrink-0" />
                  <span>Check publication date</span>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FakeNewsAnalyzer;