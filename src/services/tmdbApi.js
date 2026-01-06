import axios from 'axios';
import {TMDB_CONFIG} from '../config/api';

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
      const response = await api.get('/movie/popular', {
        params: {page},
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  },

  // Get top rated movies
  getTopRatedMovies: async (page = 1) => {
    try {
      const response = await api.get('/movie/top_rated', {
        params: {page},
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      throw error;
    }
  },

  // Get now playing movies
  getNowPlayingMovies: async (page = 1) => {
    try {
      const response = await api.get('/movie/now_playing', {
        params: {page},
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching now playing movies:', error);
      throw error;
    }
  },

  // Get upcoming movies
  getUpcomingMovies: async (page = 1) => {
    try {
      const response = await api.get('/movie/upcoming', {
        params: {page},
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming movies:', error);
      throw error;
    }
  },

  // Get trending movies
  getTrendingMovies: async (timeWindow = 'day') => {
    try {
      const response = await api.get('/trending/movie/' + timeWindow);
      return response.data;
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      throw error;
    }
  },

  // Get movie details
  getMovieDetails: async (movieId) => {
    try {
      const response = await api.get(`/movie/${movieId}`, {
        params: {
          append_to_response: 'videos,credits,recommendations',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  },

  // Search movies
  searchMovies: async (query, page = 1) => {
    try {
      const response = await api.get('/search/movie', {
        params: {query, page},
      });
      return response.data;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },

  // Get popular TV shows
  getPopularTVShows: async (page = 1) => {
    try {
      const response = await api.get('/tv/popular', {
        params: {page},
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular TV shows:', error);
      throw error;
    }
  },

  // Get top rated TV shows
  getTopRatedTVShows: async (page = 1) => {
    try {
      const response = await api.get('/tv/top_rated', {
        params: {page},
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching top rated TV shows:', error);
      throw error;
    }
  },

  // Get TV show details
  getTVShowDetails: async (tvId) => {
    try {
      const response = await api.get(`/tv/${tvId}`, {
        params: {
          append_to_response: 'videos,credits,recommendations',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching TV show details:', error);
      throw error;
    }
  },

  // Search TV shows
  searchTVShows: async (query, page = 1) => {
    try {
      const response = await api.get('/search/tv', {
        params: {query, page},
      });
      return response.data;
    } catch (error) {
      console.error('Error searching TV shows:', error);
      throw error;
    }
  },
};

