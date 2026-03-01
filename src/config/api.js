// TMDB API Configuration
// Get your API key from: https://www.themoviedb.org/settings/api
import Constants from "expo-constants";

// Get API key from environment variables via Expo Constants
// This is set in app.config.js from the .env file
const getApiKey = () => {
  // Try multiple ways to access the API key
  // Constants.expoConfig is available in newer Expo versions
  // Constants.manifest is available in older versions
  // Constants.manifest2 is available in Expo SDK 49+
  let apiKey =
    Constants.expoConfig?.extra?.tmdbApiKey ||
    Constants.manifest?.extra?.tmdbApiKey ||
    Constants.manifest2?.extra?.expoConfig?.extra?.tmdbApiKey;

  // Fallback to process.env for development (when constants aren't available)
  // This happens when the app hasn't been rebuilt after changing app.config.js
  if (!apiKey) {
    // In React Native, process.env might not work directly
    // But we can try it as a last resort
    apiKey = process.env.TMDB_API_KEY;
  }

  if (!apiKey) {
    console.error(
      "TMDB_API_KEY is not set. Please create a .env file with TMDB_API_KEY=your_key_here"
    );
    console.error("Debug info:");
    console.error("  Constants.expoConfig?.extra:", Constants.expoConfig?.extra);
    console.error("  Constants.manifest?.extra:", Constants.manifest?.extra);
    console.error("  Constants.manifest2?.extra:", Constants.manifest2?.extra);
    console.error(
      "\n⚠️  If you just changed app.config.js, you need to rebuild the app:"
    );
    console.error("  npx expo prebuild --clean");
    console.error("  npx expo run:android");
    throw new Error(
      "TMDB API key is missing. Please set TMDB_API_KEY in your .env file and rebuild the app."
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
