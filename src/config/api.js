// TMDB API Configuration
// Get your API key from: https://www.themoviedb.org/settings/api
import Constants from "expo-constants";

// Get API key from environment variables via Expo Constants
// This is set in app.config.js from the .env file
const getApiKey = () => {
  const apiKey =
    Constants.expoConfig?.extra?.tmdbApiKey || process.env.TMDB_API_KEY;

  if (!apiKey) {
    console.error(
      "TMDB_API_KEY is not set. Please create a .env file with TMDB_API_KEY=your_key_here"
    );
    throw new Error(
      "TMDB API key is missing. Please set TMDB_API_KEY in your .env file."
    );
  }

  return apiKey;
};

export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: getApiKey(),
  IMAGE_BASE_URL: "https://image.tmdb.org/t/p",
  IMAGE_SIZES: {
    poster: {
      small: "w185",
      medium: "w342",
      large: "w500",
      original: "original",
    },
    backdrop: {
      small: "w300",
      medium: "w780",
      large: "w1280",
      original: "original",
    },
    profile: {
      small: "w185",
      medium: "w342",
      large: "w632",
      original: "original",
    },
  },
};

export const getImageUrl = (path, type = "poster", size = "medium") => {
  if (!path) return null;
  const sizeKey = TMDB_CONFIG.IMAGE_SIZES[type][size] || size;
  return `${TMDB_CONFIG.IMAGE_BASE_URL}/${sizeKey}${path}`;
};
