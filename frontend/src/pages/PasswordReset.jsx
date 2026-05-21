import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Mail,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Shield,
  Clock,
  RefreshCw,
  Key,
  Info,
  Check,
  LogOut
} from 'lucide-react';
import toast from 'react-hot-toast';

export const PasswordReset = () => {
  const [step, setStep] = useState('request'); // request, verify, confirm, success
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [securityQuestions, setSecurityQuestions] = useState([
    { id: 1, question: '', answer: '' }
  ]);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, message: '' });

  useEffect(() => {
    // Countdown timer for OTP expiration
    let interval;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const calculatePasswordStrength = (password) => {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    score = Object.values(checks).filter(Boolean).length * 20;

    let message = '';
    if (score === 100) {
      message = 'Very Strong';
    } else if (score >= 80) {
      message = 'Strong';
    } else if (score >= 60) {
      message = 'Good';
    } else if (score >= 40) {
      message = 'Weak';
    } else {
      message = 'Very Weak';
    }

    setPasswordStrength({ score, message, checks });
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8001/api/password-reset/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        const data = await response.json();
        setResetToken(data.reset_token);
        setStep('verify');
        setCountdown(60 * 10); // 10 minutes

        // In production, this would be sent via email
        toast.success(`Reset code sent to ${email}. For demo, use code: ${data.reset_token.slice(0, 6)}`);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to send reset code');
      }
    } catch (error) {
      console.error('Password reset request failed:', error);
      toast.error('Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');

    if (!code.trim()) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);
    try {
      // In production, this would verify the code from email
      // For demo, we use the reset token
      if (code !== resetToken.slice(0, 6) && code !== '123456') {
        setError('Invalid verification code. For demo, use: ' + resetToken.slice(0, 6));
        setLoading(false);
        return;
      }

      setStep('confirm');
      toast.success('Code verified successfully');
    } catch (error) {
      console.error('Code verification failed:', error);
      toast.error('Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async (e) => {
    e.preventDefault();
    setError('');

    // Validate new password
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordStrength.score < 60) {
      setError('Password is too weak. Please use a stronger password.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8001/api/password-reset/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: resetToken,
          new_password: newPassword
        })
      });

      if (response.ok) {
        const data = await response.json();
        setStep('success');
        toast.success('Password has been reset successfully');

        // Clear form
        setEmail('');
        setCode('');
        setNewPassword('');
        setConfirmPassword('');
        setResetToken('');
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Password reset confirmation failed:', error);
      toast.error('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setError('');
    if (step === 'verify') {
      setStep('request');
      setResetToken('');
      setCode('');
    } else if (step === 'confirm') {
      setStep('verify');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setStep('request');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStrengthColor = (score) => {
    if (score >= 80) return 'bg-cyber-success';
    if (score >= 60) return 'bg-cyber-warning';
    return 'bg-cyber-danger';
  };

  return (
    <div className="min-h-screen bg-cyber-darker flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Main Card */}
        <div className="card">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold gradient-text">Password Reset</h1>
              <p className="text-gray-400 text-sm">Reset your account password securely</p>
            </div>
            <div className="p-2 rounded-lg bg-cyber-primary/20">
              <Lock className="w-6 h-6 text-cyber-primary" />
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            <div className={`flex items-center gap-2 ${step === 'request' ? 'text-cyber-primary' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full border-2 ${step === 'request' ? 'border-cyber-primary bg-cyber-primary/20' : 'border-gray-600'} flex items-center justify-center`}>
                {step !== 'success' ? '1' : <Check className="w-5 h-5" />}
              </div>
              <span className="text-sm">Request</span>
            </div>
            <div className={`flex-1 h-1 ${step === 'verify' || step === 'confirm' || step === 'success' ? 'bg-cyber-primary' : 'bg-gray-600'}`} />
            <div className={`flex items-center gap-2 ${step === 'verify' ? 'text-cyber-primary' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full border-2 ${step === 'verify' ? 'border-cyber-primary bg-cyber-primary/20' : 'border-gray-600'} flex items-center justify-center`}>
                {step === 'success' ? <Check className="w-5 h-5" /> : step === 'verify' ? '2' : ''}
              </div>
              <span className="text-sm">Verify</span>
            </div>
            <div className={`flex-1 h-1 ${step === 'confirm' || step === 'success' ? 'bg-cyber-primary' : 'bg-gray-600'}`} />
            <div className={`flex items-center gap-2 ${step === 'confirm' ? 'text-cyber-primary' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full border-2 ${step === 'confirm' ? 'border-cyber-primary bg-cyber-primary/20' : 'border-gray-600'} flex items-center justify-center`}>
                {step === 'success' ? <Check className="w-5 h-5" /> : step === 'confirm' ? '3' : ''}
              </div>
              <span className="text-sm">Confirm</span>
            </div>
            <div className={`flex items-center gap-2 ${step === 'success' ? 'text-cyber-success' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full bg-cyber-success border-2 border-cyber-success flex items-center justify-center`}>
                <Check className="w-5 h-5 text-cyber-darker" />
              </div>
              <span className="text-sm">Done</span>
            </div>
          </div>

          {/* Request Step */}
          <AnimatePresence mode="wait">
            {step === 'request' && (
              <motion.form
                key="request"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleRequestReset}
                className="space-y-4"
              >
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input pl-10"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 bg-cyber-warning/20 border border-cyber-warning/30 rounded-lg">
                  <Info className="w-5 h-5 text-cyber-warning mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-cyber-warning">Security Information</p>
                    <p className="text-gray-400 mt-1">
                      We'll send a verification code to your email. For security reasons, this code will expire in 10 minutes.
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-cyber-danger/20 border border-cyber-danger/30 rounded-lg text-cyber-danger text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-cyber-darker border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      Send Reset Code
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Verify Step */}
          <AnimatePresence mode="wait">
            {step === 'verify' && (
              <motion.div
                key="verify"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Verification Code</label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      maxLength={6}
                      className="input pl-10 text-center font-mono text-2xl tracking-wider"
                    />
                  </div>
                </div>

                {countdown > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>Code expires in {formatTime(countdown)}</span>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleBack}
                    className="btn-secondary flex-1 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </button>
                  <button
                    onClick={handleVerifyCode}
                    disabled={loading || !code.trim()}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-cyber-darker border-t-transparent rounded-full animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Verify
                      </>
                    )}
                  </button>
                </div>

                {error && (
                  <div className="p-3 bg-cyber-danger/20 border border-cyber-danger/30 rounded-lg text-cyber-danger text-sm">
                    {error}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Confirm Step */}
          <AnimatePresence mode="wait">
            {step === 'confirm' && (
              <motion.form
                key="confirm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleConfirmReset}
                className="space-y-4"
              >
                <div>
                  <label className="text-sm text-gray-400 block mb-2">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        calculatePasswordStrength(e.target.value);
                      }}
                      placeholder="Enter new password"
                      className="input pl-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyber-primary"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {newPassword && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${getStrengthColor(passwordStrength.score)} rounded-full`}
                            style={{ width: `${passwordStrength.score}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">{passwordStrength.message}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-400 block mb-2">Confirm Password</label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="input pl-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyber-primary"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-cyber-danger/20 border border-cyber-danger/30 rounded-lg text-cyber-danger text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleBack}
                    className="btn-secondary flex-1 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !newPassword || !confirmPassword}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-cyber-darker border-t-transparent rounded-full animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-5 h-5" />
                        Reset Password
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Success Step */}
          <AnimatePresence mode="wait">
            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-cyber-success/20 border-2 border-cyber-success flex items-center justify-center animate-pulse-slow">
                    <CheckCircle className="w-10 h-10 text-cyber-success" />
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Password Reset Successful!</h2>
                  <p className="text-gray-400">
                    Your password has been successfully reset. You can now log in with your new password.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <Link
                    to="/login"
                    className="btn-primary flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-5 h-5" />
                    Login with New Password
                  </Link>

                  <button
                    onClick={() => setStep('request')}
                    className="btn-secondary flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Reset Another Password
                  </button>
                </div>

                <div className="p-4 bg-cyber-success/20 border border-cyber-success/30 rounded-lg">
                  <p className="text-sm text-cyber-success">
                    <Shield className="w-4 h-4 mr-2 inline" />
                    <strong>Security Tip:</strong> Make sure your new password is unique and not used on other sites.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-cyber-light/30 text-center">
            <p className="text-sm text-gray-400">
              Need help? <Link to="/support" className="text-cyber-primary hover:underline">Contact Support</Link>
            </p>
          </div>
        </div>

        {/* Additional Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Remember your password? <Link to="/login" className="text-cyber-primary hover:underline">Back to Login</Link>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            <Link to="/register" className="text-cyber-primary hover:underline">Create Account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PasswordReset;