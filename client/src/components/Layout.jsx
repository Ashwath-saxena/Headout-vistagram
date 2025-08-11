import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Home, Plus, User, LogOut, Camera, Moon, Sun, 
  Menu, X, Bell, Search, Settings 
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isTransitioning } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Feed' },
    { path: '/create', icon: Plus, label: 'Create' },
    { path: `/profile/${user?.username}`, icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-200 transition-colors duration-300 flex flex-col">
      {/* Header */}
      <header className="glassmorphism sticky top-0 z-50 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 group"
            >
              <div className="relative">
                <Camera className="h-8 w-8 text-primary-500 group-hover:text-primary-600 transition-colors duration-200 animate-float" />
                <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-lg group-hover:bg-primary-600/30 transition-all duration-300"></div>
              </div>
              <span className="text-xl font-bold text-gradient group-hover:scale-105 transition-transform duration-200">
                Vistagram
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <Link 
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 animate-fade-in ${
                    isActive(item.path) 
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 shadow-lg' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-dark-100'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Desktop User Actions */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Search Button */}
              <button className="btn-ghost">
                <Search className="h-5 w-5" />
              </button>
              
              {/* Notifications */}
              <button className="btn-ghost relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>
              
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className={`btn-ghost relative overflow-hidden ${isTransitioning ? 'animate-pulse' : ''}`}
                disabled={isTransitioning}
              >
                <div className="relative">
                  {theme === 'light' ? (
                    <Moon className="h-5 w-5 animate-fade-in" />
                  ) : (
                    <Sun className="h-5 w-5 animate-fade-in text-yellow-500" />
                  )}
                </div>
              </button>
              
              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <Link 
                  to={`/profile/${user?.username}`}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-100 transition-all duration-200 group"
                >
                  <div className="w-8 h-8 avatar-gradient rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <span className="text-sm font-semibold">
                      {user?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden lg:block text-gray-700 dark:text-gray-300 font-medium">
                    {user?.username}
                  </span>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="btn-ghost text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden btn-ghost"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 animate-scale-in" />
              ) : (
                <Menu className="h-6 w-6 animate-scale-in" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glassmorphism border-t border-gray-200/50 dark:border-gray-700/50 animate-fade-in-down">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 animate-slide-in-left ${
                    isActive(item.path)
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-100'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 avatar-gradient rounded-full flex items-center justify-center">
                      <span className="font-semibold">
                        {user?.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      @{user?.username}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={toggleTheme}
                      className="btn-ghost"
                    >
                      {theme === 'light' ? (
                        <Moon className="h-5 w-5" />
                      ) : (
                        <Sun className="h-5 w-5 text-yellow-500" />
                      )}
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="btn-ghost text-red-600"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content - Fixed spacing */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8 animate-fade-in-up">
        {children}
      </main>

      {/* Mobile Bottom Navigation - Fixed positioning */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 glassmorphism border-t border-gray-200/50 dark:border-gray-700/50 z-50 safe-area-pb">
        <div className="flex justify-around items-center py-3 px-4">
          {navItems.map((item, index) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 animate-fade-in min-w-0 ${
                isActive(item.path) 
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs mt-1 font-medium truncate">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Layout;
