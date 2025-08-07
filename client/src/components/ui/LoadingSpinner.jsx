// components/LoadingSpinner.jsx
import { useState, useEffect } from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...', className = '' }) => {
  const [showSlowMessage, setShowSlowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSlowMessage(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
    large: 'h-8 w-8'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      {/* Loading Spinner and Text */}
      <div className="flex items-center space-x-2">
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

      {/* The optional slow-loading message */}
      {showSlowMessage && (
        <p className="mt-2 text-center text-sm text-yellow-600">
          Be patient, everything is hosted on a super-slow free service...
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;