/**
 * Color utilities for generating user avatars and themes
 */

const AVATAR_COLORS = [
  '#1a73e8', // Blue
  '#137333', // Green  
  '#d93025', // Red
  '#f29900', // Orange
  '#8b5cf6', // Purple
  '#0ea5e9', // Cyan
  '#ef4444', // Rose
  '#22c55e', // Emerald
] as const;

export const generateAvatarColor = (username: string): string => {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

