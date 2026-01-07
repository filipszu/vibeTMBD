import axios from "axios";
import { TMDB_CONFIG } from "../config/api";

const api = axios.create({
  baseURL: TMDB_CONFIG.BASE_URL,
  params: {
    api_key: TMDB_CONFIG.API_KEY,
  },
});

export const tmdbApi = {
  // Get popular movies
  getPopularMovies: async (page = 1) => {
    try {
      const response = await api.get("/movie/popular", {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching popular movies:", error);
      throw error;
    }
  },

  // Get top rated movies
  getTopRatedMovies: async (page = 1) => {
    try {
      const response = await api.get("/movie/top_rated", {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching top rated movies:", error);
      throw error;
    }
  },

  // Get now playing movies
  getNowPlayingMovies: async (page = 1) => {
    try {
      const response = await api.get("/movie/now_playing", {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching now playing movies:", error);
      throw error;
    }
  },

  // Get upcoming movies
  getUpcomingMovies: async (page = 1) => {
    try {
      const response = await api.get("/movie/upcoming", {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching upcoming movies:", error);
      throw error;
    }
  },

  // Get trending movies
  getTrendingMovies: async (timeWindow = "day") => {
    try {
      const response = await api.get("/trending/movie/" + timeWindow);
      return response.data;
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      throw error;
    }
  },

  // Get movie details
  getMovieDetails: async (movieId) => {
    try {
      const response = await api.get(`/movie/${movieId}`, {
        params: {
          append_to_response: "videos,credits,recommendations",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching movie details:", error);
      throw error;
    }
  },

  // Get similar movies
  getSimilarMovies: async (movieId, page = 1) => {
    try {
      const response = await api.get(`/movie/${movieId}/similar`, {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching similar movies:", error);
      throw error;
    }
  },

  // Search movies
  searchMovies: async (query, page = 1) => {
    try {
      const response = await api.get("/search/movie", {
        params: { query, page },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching movies:", error);
      throw error;
    }
  },

  // Get popular TV shows
  getPopularTVShows: async (page = 1) => {
    try {
      const response = await api.get("/tv/popular", {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching popular TV shows:", error);
      throw error;
    }
  },

  // Get top rated TV shows
  getTopRatedTVShows: async (page = 1) => {
    try {
      const response = await api.get("/tv/top_rated", {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching top rated TV shows:", error);
      throw error;
    }
  },

  // Get TV show details
  getTVShowDetails: async (tvId) => {
    try {
      const response = await api.get(`/tv/${tvId}`, {
        params: {
          append_to_response: "videos,credits,recommendations",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching TV show details:", error);
      throw error;
    }
  },

  // Get similar TV shows
  getSimilarTVShows: async (tvId, page = 1) => {
    try {
      const response = await api.get(`/tv/${tvId}/similar`, {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching similar TV shows:", error);
      throw error;
    }
  },

  // Search TV shows
  searchTVShows: async (query, page = 1) => {
    try {
      const response = await api.get("/search/tv", {
        params: { query, page },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching TV shows:", error);
      throw error;
    }
  },

  // ============ AUTHENTICATION & ACCOUNT METHODS ============

  // Get account details
  getAccount: async (sessionId) => {
    try {
      const response = await api.get("/account", {
        params: { session_id: sessionId },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching account:", error);
      throw error;
    }
  },

  // Get favorite movies
  getFavoriteMovies: async (accountId, sessionId, page = 1) => {
    try {
      const response = await api.get(`/account/${accountId}/favorite/movies`, {
        params: { session_id: sessionId, page },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching favorite movies:", error);
      throw error;
    }
  },

  // Get favorite TV shows
  getFavoriteTVShows: async (accountId, sessionId, page = 1) => {
    try {
      const response = await api.get(`/account/${accountId}/favorite/tv`, {
        params: { session_id: sessionId, page },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching favorite TV shows:", error);
      throw error;
    }
  },

  // Add/remove movie from favorites
  toggleMovieFavorite: async (accountId, sessionId, movieId, favorite) => {
    try {
      const response = await api.post(
        `/account/${accountId}/favorite`,
        {
          media_type: "movie",
          media_id: movieId,
          favorite: favorite,
        },
        {
          params: { session_id: sessionId },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error toggling movie favorite:", error);
      throw error;
    }
  },

  // Add/remove TV show from favorites
  toggleTVFavorite: async (accountId, sessionId, tvId, favorite) => {
    try {
      const response = await api.post(
        `/account/${accountId}/favorite`,
        {
          media_type: "tv",
          media_id: tvId,
          favorite: favorite,
        },
        {
          params: { session_id: sessionId },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error toggling TV favorite:", error);
      throw error;
    }
  },
};
