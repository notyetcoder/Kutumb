'use client';

import React from 'react';
import { User } from '@/lib/types';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-lg',
  xl: 'w-20 h-20 text-2xl',
};

const bgColors = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-yellow-500',
  'bg-indigo-500',
  'bg-cyan-500',
];

export function UserAvatar({ user, size = 'md', className = '' }: UserAvatarProps) {
  const hasValidImage =
    user.profilePictureUrl &&
    user.profilePictureUrl.trim() !== '' &&
    !user.profilePictureUrl.includes('placeholder');

  if (hasValidImage) {
    return (
      <img
        src={user.profilePictureUrl}
        alt={user.name}
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  // First-letter fallback
  const firstLetter = user.name.charAt(0).toUpperCase();
  const bgColorIndex = (user.id.charCodeAt(0) + user.id.charCodeAt(1)) % bgColors.length;
  const bgColor = bgColors[bgColorIndex];

  return (
    <div
      className={`${sizeClasses[size]} ${bgColor} rounded-full flex items-center justify-center font-bold text-white ${className}`}
      title={user.name}
    >
      {firstLetter}
    </div>
  );
}
