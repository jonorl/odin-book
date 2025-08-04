// components/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...', className = '' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
    large: 'h-8 w-8'
  };

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <div 
        className={`animate-spin rounded-full border-b-2 border-blue-500 ${sizeClasses[size]}`}
        role="status"
        aria-label={text}
      >
        <span className="sr-only">{text}</span>
      </div>
      {text && (
        <span className="text-sm text-gray-500">{text}</span>
      )}
    </div>
  );
};

export default LoadingSpinner;