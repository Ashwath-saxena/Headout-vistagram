// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
  },
  POSTS: {
    CREATE: '/posts',
    GET_ALL: '/posts',
    GET_BY_ID: (id) => `/posts/${id}`,
    LIKE: (id) => `/posts/${id}/like`,
    SHARE: (id) => `/posts/${id}/share`,
  },
  USERS: {
    GET_PROFILE: (username) => `/users/${username}`,
  },
};

// Application constants
export const APP_CONSTANTS = {
  APP_NAME: 'Vistagram',
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  POSTS_PER_PAGE: 10,
};

// Validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
  USERNAME_MIN_LENGTH: 'Username must be at least 3 characters',
  FILE_TOO_LARGE: 'File size must be less than 5MB',
  FILE_TYPE_INVALID: 'Only image files (JPG, PNG, WEBP) are allowed',
};
