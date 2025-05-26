import React from 'react';

interface PingAnimationProps {
  color?: 'sky' | 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'pink';
  size?: 'small' | 'medium' | 'large';
}

const PingAnimation: React.FC<PingAnimationProps> = ({ color = 'sky', size = 'medium' }) => {
  const sizeClasses = {
    small: 'h-2 w-2',
    medium: 'h-6 w-6',
    large: 'h-8 w-8'
  };

  const colorClasses = {
    sky: 'bg-sky-400',
    red: 'bg-red-400',
    green: 'bg-green-400',
    blue: 'bg-blue-400',
    yellow: 'bg-yellow-400',
    purple: 'bg-purple-400',
    pink: 'bg-pink-400'
  };

  const solidColorClasses = {
    sky: 'bg-sky-500',
    red: 'bg-red-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500'
  };

  return (
    <span className="relative inline-flex ml-1">
      <span
        className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colorClasses[color]} opacity-60`}
      ></span>
      <span
        className={`animate-pulse absolute inline-flex h-full w-full rounded-full ${colorClasses[color]} opacity-100`}
      ></span>
      <span
        className={`relative inline-flex rounded-full ${sizeClasses[size]} ${solidColorClasses[color]}`}
      ></span>
    </span>
  );
};

export default PingAnimation;