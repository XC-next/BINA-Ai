
import React from 'react';
import { UserCircleIcon } from './icons';

interface UserAvatarProps {
  avatar: string;
  className?: string;
}

// Simple map of color names to hex values for predefined avatars
const PREDEFINED_COLORS: { [key: string]: string } = {
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#22c55e',
  yellow: '#eab308',
};

export const UserAvatar: React.FC<UserAvatarProps> = ({ avatar, className = "w-8 h-8" }) => {
  if (avatar.startsWith('data:image')) {
    return (
      <img src={avatar} alt="User Avatar" className={`${className} rounded-full object-cover bg-gray-700`} />
    );
  }

  if (PREDEFINED_COLORS[avatar]) {
    return (
      <div 
        className={`${className} rounded-full`}
        style={{ backgroundColor: PREDEFINED_COLORS[avatar] }}
      />
    );
  }
  
  // Default icon
  return <UserCircleIcon className={`${className} text-slate-400 dark:text-slate-400`} />;
};
