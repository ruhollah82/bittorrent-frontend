/**
 * Helper function to get the full avatar URL from a user object
 * Handles both 'avatar' and 'profile_picture' field names
 * Handles different avatar URL formats from the backend
 * Falls back to local default avatar
 */
export const getAvatarUrl = (avatar: string | undefined | null): string => {
  if (!avatar) return '/default-avatar.png';

  // If it's already a full URL, return as is
  if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
    return avatar;
  }

  // If it starts with /media/, it's a relative URL from the backend
  if (avatar.startsWith('/media/')) {
    return `http://127.0.0.1:8000${avatar}`;
  }

  // If it starts with media/ (no leading slash), add the base URL
  if (avatar.startsWith('media/')) {
    return `http://127.0.0.1:8000/${avatar}`;
  }

  // Default: assume it's a relative path from /media/profile_pictures/
  return `http://127.0.0.1:8000/media/profile_pictures/${avatar}`;
};

/**
 * Helper function to get avatar from user object
 * Checks both 'avatar' and 'profile_picture' fields
 * Always returns a valid avatar URL (falls back to default)
 */
export const getUserAvatar = (user: { avatar?: string; profile_picture?: string } | null | undefined): string => {
  if (!user) return '/default-avatar.png';
  return getAvatarUrl(user.profile_picture || user.avatar);
};

/**
 * Helper function to get user initials for avatar fallback
 */
export const getUserInitials = (user: { username?: string } | null | undefined): string => {
  if (!user || !user.username) return 'U';
  return user.username.charAt(0).toUpperCase();
};

