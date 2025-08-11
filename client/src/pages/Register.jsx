import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Camera, Eye, EyeOff, Moon, Sun, Mail, Lock, User, ArrowRight, UserPlus } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { register, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Handle mount animation
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    const result = await register(formData.username, formData.email, formData.password);
    
    if (result.success) {
      navigate('/', { replace: true });
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-all duration-500 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 dark:bg-primary-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-200 dark:bg-green-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-purple-200 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-xl opacity-70 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 rounded-full glassmorphism hover:scale-110 transition-all duration-300 z-10 group"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? (
          <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200" />
        ) : (
          <Sun className="h-5 w-5 text-yellow-500 group-hover:text-yellow-400 transition-colors duration-200" />
        )}
      </button>

      <div className="relative z-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Logo */}
          <div className={`flex justify-center items-center space-x-3 mb-8 ${mounted ? 'animate-fade-in-down' : 'opacity-0'}`}>
            <div className="relative">
              <Camera className="h-12 w-12 text-primary-500 dark:text-primary-400 animate-float" />
              <div className="absolute inset-0 bg-primary-500/20 dark:bg-primary-400/20 rounded-full blur-lg animate-pulse-soft"></div>
            </div>
            <h1 className="text-4xl font-bold text-gradient">Vistagram</h1>
          </div>
          
          <div className={`text-center ${mounted ? 'animate-fade-in-up animate-delay-200' : 'opacity-0'}`}>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Join Vistagram
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Create your account to start sharing moments
            </p>
          </div>
        </div>

        <div className={`mt-8 sm:mx-auto sm:w-full sm:max-w-md ${mounted ? 'animate-fade-in-up animate-delay-300' : 'opacity-0'}`}>
          <div className="card p-8 relative overflow-hidden">
            {/* Card decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-green-500 to-primary-600"></div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl animate-scale-in backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Username */}
              <div className={`${mounted ? 'animate-slide-in-left animate-delay-400' : 'opacity-0'}`}>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    className="input-field pl-10 transition-all duration-200 focus:scale-[1.02]"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.username.length}/20 characters
                </div>
              </div>

              {/* Email */}
              <div className={`${mounted ? 'animate-slide-in-right animate-delay-500' : 'opacity-0'}`}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="input-field pl-10 transition-all duration-200 focus:scale-[1.02]"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Password */}
              <div className={`${mounted ? 'animate-slide-in-left animate-delay-600' : 'opacity-0'}`}>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    className="input-field pl-10 pr-10 transition-all duration-200 focus:scale-[1.02]"
                    placeholder="Create a password (min. 6 characters)"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-primary-500 dark:hover:text-primary-400 transition-all duration-200 hover:scale-110"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    )}
                  </button>
                </div>
                <div className="mt-1 text-xs space-y-1">
                  <div className={`flex items-center space-x-2 ${formData.password.length >= 6 ? 'text-green-600' : 'text-gray-500'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${formData.password.length >= 6 ? 'bg-green-500' : 'bg-gray-300'} transition-colors`}></div>
                    <span>At least 6 characters</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'} transition-colors`}></div>
                    <span>One uppercase letter (recommended)</span>
                  </div>
                </div>
              </div>

              {/* Terms and Privacy */}
              <div className={`${mounted ? 'animate-fade-in animate-delay-700' : 'opacity-0'}`}>
                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    I agree to the{' '}
                    <button
                      type="button"
                      className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 underline"
                    >
                      Terms of Service
                    </button>
                    {' '}and{' '}
                    <button
                      type="button"
                      className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 underline"
                    >
                      Privacy Policy
                    </button>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden ${mounted ? 'animate-fade-in animate-delay-700' : 'opacity-0'}`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-green-600 to-primary-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <div className="relative flex items-center space-x-2">
                  {loading ? (
                    <LoadingSpinner size="sm" type="bounce" />
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 group-hover:rotate-12 transition-transform duration-200" />
                      <span>Create account</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Login Link */}
            <div className={`mt-6 text-center ${mounted ? 'animate-fade-in animate-delay-800' : 'opacity-0'}`}>
              <p className="text-gray-600 dark:text-gray-300">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-all duration-200 hover:underline hover:scale-105 inline-block"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {/* Welcome Message */}
            <div className={`mt-6 p-4 bg-gradient-to-r from-primary-50 to-green-50 dark:from-primary-900/20 dark:to-green-900/20 rounded-lg border border-primary-200 dark:border-primary-800 ${mounted ? 'animate-fade-in animate-delay-900' : 'opacity-0'}`}>
              <div className="flex items-center space-x-2 mb-2">
                <Camera className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                <p className="text-sm font-semibold text-primary-800 dark:text-primary-200">
                  Welcome to Vistagram! 🎉
                </p>
              </div>
              <p className="text-sm text-primary-700 dark:text-primary-300">
                Join thousands of users sharing their amazing moments and discovering incredible places around the world!
              </p>
            </div>

            {/* Features Preview */}
            <div className={`mt-4 grid grid-cols-3 gap-4 ${mounted ? 'animate-fade-in animate-delay-1000' : 'opacity-0'}`}>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Camera className="h-6 w-6 text-primary-500 dark:text-primary-400 mx-auto mb-1" />
                <p className="text-xs text-gray-600 dark:text-gray-400">Share Photos</p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <UserPlus className="h-6 w-6 text-green-500 dark:text-green-400 mx-auto mb-1" />
                <p className="text-xs text-gray-600 dark:text-gray-400">Connect</p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <ArrowRight className="h-6 w-6 text-purple-500 dark:text-purple-400 mx-auto mb-1" />
                <p className="text-xs text-gray-600 dark:text-gray-400">Discover</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
