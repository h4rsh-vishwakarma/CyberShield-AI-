import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from './components/Navigation';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { FakeNewsAnalyzer } from './pages/FakeNewsAnalyzer';
import { DeepfakeDetector } from './pages/DeepfakeDetector';
import { CrimeAnalytics } from './pages/CrimeAnalytics';
import { AlertCenter } from './pages/AlertCenter';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { ApiKeyManagement } from './pages/ApiKeyManagement';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import './index.css';

function AppContent() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        setIsAuthenticated(!!token && !!user);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      setIsAuthenticated(!!token && !!user);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-darker flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 border-4 border-cyber-primary border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-cyber-primary text-lg font-semibold">Loading CyberShield AI...</p>
        </div>
      </div>
    );
  }

  const publicRoutes = ['/login', '/register'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  if (!isAuthenticated && !isPublicRoute) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-cyber-darker">
      {!isPublicRoute && (
        <>
          <Navigation
            isSidebarOpen={isSidebarOpen}
            setSidebarOpen={setSidebarOpen}
            isAuthenticated={isAuthenticated}
          />
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </>
      )}

      <main className={`transition-all duration-300 ${
        isPublicRoute ? 'ml-0' : isSidebarOpen ? 'ml-64' : 'ml-20'
      }`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/fake-news" element={<FakeNewsAnalyzer />} />
              <Route path="/deepfake" element={<DeepfakeDetector />} />
              <Route path="/crime-analytics" element={<CrimeAnalytics />} />
              <Route path="/alerts" element={<AlertCenter />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/api-keys" element={<ApiKeyManagement />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a1f3a',
            color: '#ffffff',
            border: '1px solid #00f0ff',
            borderRadius: '8px',
            padding: '12px 16px',
            fontFamily: 'Inter, sans-serif',
          },
          success: {
            style: {
              border: '1px solid #00ff9d',
            },
          },
          error: {
            style: {
              border: '1px solid #ff3366',
            },
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;