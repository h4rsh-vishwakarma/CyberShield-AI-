import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Video,
  Upload,
  FileVideo,
  FileImage,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Share2,
  Trash2,
  Zap,
  Activity,
  Eye,
  Scan,
  Play,
  Pause,
  RotateCw,
  Maximize2
} from 'lucide-react';
import toast from 'react-hot-toast';

export const DeepfakeDetector = () => {
  const [dragActive, setDragActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [progress, setProgress] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file) => {
    // Validate file type
    const validVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (validVideoTypes.includes(file.type)) {
      setFileType('video');
      setUploadedFile(file);
      toast.success('Video uploaded successfully');
    } else if (validImageTypes.includes(file.type)) {
      setFileType('image');
      setUploadedFile(file);
      toast.success('Image uploaded successfully');
    } else {
      toast.error('Please upload a valid video or image file');
      return;
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const analyzeMedia = async () => {
    if (!uploadedFile) {
      toast.error('Please upload a file first');
      return;
    }

    setAnalyzing(true);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));

    clearInterval(progressInterval);
    setProgress(100);

    // Simulated result
    const mockResult = {
      isDeepfake: Math.random() > 0.6,
      confidence: Math.floor(Math.random() * 15) + 85,
      analysis: {
        faceDetection: Math.floor(Math.random() * 10) + 1,
        manipulationScore: (Math.random() * 0.3 + 0.1).toFixed(2),
        artifacts: Math.floor(Math.random() * 50),
        consistency: Math.floor(Math.random() * 20) + 80,
      },
      frames: {
        total: fileType === 'video' ? Math.floor(Math.random() * 200) + 100 : 1,
        analyzed: fileType === 'video' ? Math.floor(Math.random() * 50) + 50 : 1,
        suspicious: Math.floor(Math.random() * 10),
      },
      technical: {
        resolution: '1920x1080',
        fps: fileType === 'video' ? '30' : 'N/A',
        codec: 'H.264',
        bitrate: fileType === 'video' ? '5.2 Mbps' : 'N/A',
      }
    };

    setResults(mockResult);
    setAnalyzing(false);

    if (mockResult.isDeepfake) {
      toast.error(`Deepfake detected with ${mockResult.confidence}% confidence`);
    } else {
      toast.success(`Media appears authentic (${mockResult.confidence}% confidence)`);
    }
  };

  const clearResults = () => {
    setResults(null);
    setUploadedFile(null);
    setFileType(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (videoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setVideoPlaying(!videoPlaying);
    }
  };

  const ResultCard = ({ result }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Main Result */}
      <div className={`p-6 rounded-xl border-2 ${
        result.isDeepfake
          ? 'bg-cyber-danger/10 border-cyber-danger/50'
          : 'bg-cyber-success/10 border-cyber-success/50'
      }`}>
        <div className="flex items-center gap-4 mb-4">
          <div className={`p-4 rounded-xl ${
            result.isDeepfake
              ? 'bg-cyber-danger/20'
              : 'bg-cyber-success/20'
          }`}>
            {result.isDeepfake ? (
              <XCircle className="w-12 h-12 text-cyber-danger" />
            ) : (
              <CheckCircle className="w-12 h-12 text-cyber-success" />
            )}
          </div>
          <div>
            <h3 className={`text-2xl font-bold ${
              result.isDeepfake ? 'text-cyber-danger' : 'text-cyber-success'
            }`}>
              {result.isDeepfake ? 'Deepfake Detected' : 'Media Appears Authentic'}
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

      {/* Analysis Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Scan, label: 'Faces Detected', value: result.analysis.faceDetection, color: 'from-cyber-primary to-cyber-secondary' },
          { icon: Activity, label: 'Manipulation', value: result.analysis.manipulationScore, color: 'from-cyber-secondary to-cyber-accent' },
          { icon: AlertTriangle, label: 'Artifacts', value: result.analysis.artifacts, color: 'from-cyber-accent to-cyber-danger' },
          { icon: CheckCircle, label: 'Consistency', value: `${result.analysis.consistency}%`, color: 'from-cyber-success to-cyber-primary' },
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

      {/* Frame Analysis */}
      {fileType === 'video' && (
        <div className="card">
          <h3 className="text-lg font-bold text-white mb-4">Frame Analysis</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-cyber-light/30 border border-cyber-light/30">
              <p className="text-sm text-gray-400 mb-1">Total Frames</p>
              <p className="text-2xl font-bold text-white">{result.frames.total}</p>
            </div>
            <div className="p-4 rounded-lg bg-cyber-light/30 border border-cyber-light/30">
              <p className="text-sm text-gray-400 mb-1">Analyzed</p>
              <p className="text-2xl font-bold text-cyber-primary">{result.frames.analyzed}</p>
            </div>
            <div className="p-4 rounded-lg bg-cyber-light/30 border border-cyber-light/30">
              <p className="text-sm text-gray-400 mb-1">Suspicious</p>
              <p className="text-2xl font-bold text-cyber-danger">{result.frames.suspicious}</p>
            </div>
          </div>
        </div>
      )}

      {/* Technical Details */}
      <div className="card">
        <h3 className="text-lg font-bold text-white mb-4">Technical Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-400">Resolution</p>
            <p className="text-white font-medium">{result.technical.resolution}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-400">FPS</p>
            <p className="text-white font-medium">{result.technical.fps}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-400">Codec</p>
            <p className="text-white font-medium">{result.technical.codec}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-400">Bitrate</p>
            <p className="text-white font-medium">{result.technical.bitrate}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button className="btn-primary flex items-center gap-2" onClick={() => toast.success('Report downloaded')}>
          <Download className="w-5 h-5" />
          Download Report
        </button>
        <button className="btn-secondary flex items-center gap-2" onClick={() => toast.success('Link copied to clipboard')}>
          <Share2 className="w-5 h-5" />
          Share Results
        </button>
        <button className="btn-danger flex items-center gap-2" onClick={clearResults}>
          <Trash2 className="w-5 h-5" />
          Clear
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold gradient-text">Deepfake Detector</h1>
        <p className="text-gray-400 mt-1">Advanced AI-powered video and image authentication</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {!uploadedFile ? (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`card border-2 border-dashed transition-all ${
                  dragActive
                    ? 'border-cyber-primary bg-cyber-primary/10'
                    : 'border-cyber-light/30 hover:border-cyber-primary/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*,image/*"
                  onChange={handleInputChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <motion.div
                    className={`p-6 rounded-2xl mb-4 ${
                      dragActive ? 'bg-cyber-primary/20' : 'bg-cyber-light/30'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className={`w-12 h-12 ${dragActive ? 'text-cyber-primary' : 'text-gray-400'}`} />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Upload {fileType === 'video' ? 'Video' : fileType === 'image' ? 'Image' : 'Media'}
                  </h3>
                  <p className="text-gray-400 text-sm max-w-md mb-4">
                    Drag and drop your video or image here, or click to browse
                  </p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <FileVideo className="w-4 h-4" />
                      <span>MP4, MOV, AVI</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileImage className="w-4 h-4" />
                      <span>JPG, PNG, WebP</span>
                    </div>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-primary mt-6"
                  >
                    Browse Files
                  </button>
                </div>
              </div>
            ) : (
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">
                    {fileType === 'video' ? 'Video Preview' : 'Image Preview'}
                  </h3>
                  <button
                    onClick={clearResults}
                    className="p-2 rounded-lg hover:bg-cyber-light/50 transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-cyber-danger" />
                  </button>
                </div>

                <div className="relative bg-cyber-darker rounded-lg overflow-hidden mb-4">
                  {fileType === 'video' ? (
                    <video
                      ref={videoRef}
                      src={URL.createObjectURL(uploadedFile)}
                      className="w-full h-64 object-contain"
                      controls
                    />
                  ) : (
                    <img
                      src={URL.createObjectURL(uploadedFile)}
                      alt="Preview"
                      className="w-full h-64 object-contain"
                    />
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white">{uploadedFile.name}</p>
                    <p className="text-xs text-gray-400">
                      {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={analyzeMedia}
                    disabled={analyzing}
                    className="btn-primary flex items-center gap-2"
                  >
                    {analyzing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-cyber-darker border-t-transparent rounded-full animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Scan className="w-5 h-5" />
                        Analyze Media
                      </>
                    )}
                  </button>
                </div>
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
              className="card"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-cyber-primary font-semibold">Analyzing Media...</span>
                  <span className="text-sm text-gray-400">{progress}%</span>
                </div>
                <div className="h-3 bg-cyber-darker rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-cyber-primary to-cyber-secondary"
                  />
                </div>
                <div className="flex items-center justify-center gap-2 py-4">
                  <motion.div
                    className="w-8 h-8 border-2 border-cyber-primary border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="text-gray-400 text-sm">
                    {progress < 30 ? 'Extracting frames...' :
                     progress < 60 ? 'Detecting faces...' :
                     progress < 80 ? 'Analyzing patterns...' :
                     'Generating results...'}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tips Card */}
          <div className="card">
            <h3 className="text-lg font-bold text-white mb-3">Detection Tips</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <Eye className="w-4 h-4 text-cyber-primary mt-0.5 flex-shrink-0" />
                <span>Look for unnatural blinking</span>
              </li>
              <li className="flex items-start gap-2">
                <Eye className="w-4 h-4 text-cyber-primary mt-0.5 flex-shrink-0" />
                <span>Check for lip-sync issues</span>
              </li>
              <li className="flex items-start gap-2">
                <Eye className="w-4 h-4 text-cyber-primary mt-0.5 flex-shrink-0" />
                <span>Watch for lighting inconsistencies</span>
              </li>
              <li className="flex items-start gap-2">
                <Eye className="w-4 h-4 text-cyber-primary mt-0.5 flex-shrink-0" />
                <span>Examine skin texture artifacts</span>
              </li>
            </ul>
          </div>

          {/* Supported Formats */}
          <div className="card">
            <h3 className="text-lg font-bold text-white mb-3">Supported Formats</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded bg-cyber-light/30">
                <span className="text-sm text-gray-300">Video Files</span>
                <span className="text-xs text-cyber-primary">MP4, MOV, AVI</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-cyber-light/30">
                <span className="text-sm text-gray-300">Image Files</span>
                <span className="text-xs text-cyber-primary">JPG, PNG, WebP</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-cyber-light/30">
                <span className="text-sm text-gray-300">Max Size</span>
                <span className="text-xs text-cyber-primary">100 MB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeepfakeDetector;