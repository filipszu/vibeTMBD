// TMDB API Configuration
// Get your API key from: https://www.themoviedb.org/settings/api

export const TMDB_CONFIG = {
  BASE_URL: 'https://api.themoviedb.org/3',
  API_KEY: process.env.TMDB_API_KEY || 'ba8cd30c0f2c6d86e840e2d9fe95f82c', // Replace with your API key
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  IMAGE_SIZES: {
    poster: {
      small: 'w185',
      medium: 'w342',
      large: 'w500',
      original: 'original',
    },
    backdrop: {
      small: 'w300',
      medium: 'w780',
      large: 'w1280',
      original: 'original',
    },
    profile: {
      small: 'w185',
      medium: 'w342',
      large: 'w632',
      original: 'original',
    },
  },
};

export const getImageUrl = (path, type = 'poster', size = 'medium') => {
  if (!path) return null;
  const sizeKey = TMDB_CONFIG.IMAGE_SIZES[type][size] || size;
  return `${TMDB_CONFIG.IMAGE_BASE_URL}/${sizeKey}${path}`;
};

