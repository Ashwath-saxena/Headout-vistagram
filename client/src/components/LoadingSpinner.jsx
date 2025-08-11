import React from 'react';
import { useTheme } from '../context/ThemeContext';

const LoadingSpinner = ({ size = 'md', className = '', type = 'spinner' }) => {
  const { isDark } = useTheme();
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  if (type === 'dots') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="loading-dots">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  if (type === 'pulse') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className={`${sizeClasses[size]} bg-gradient-to-r from-primary-400 to-primary-600 rounded-full animate-pulse-soft`}></div>
      </div>
    );
  }

  if (type === 'bounce') {
    return (
      <div className={`flex items-center justify-center space-x-1 ${className}`}>
        <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce animate-delay-100"></div>
        <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce animate-delay-200"></div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-primary-500 rounded-full animate-spin"></div>
        {isDark && (
          <div className="absolute inset-0 bg-primary-500/20 rounded-full blur animate-pulse"></div>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
