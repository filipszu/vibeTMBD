import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { tmdbApi } from "../services/tmdbApi";
import { getImageUrl } from "../config/api";
import ItemCard from "../components/ItemCard";
import { useAuth } from "../context/AuthContext";

const { width, height } = Dimensions.get("window");

const ItemDetailsPage = ({ route, navigation }) => {
  const { movieId, mediaType = "movie" } = route.params;
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [checkingFavorite, setCheckingFavorite] = useState(false);

  useEffect(() => {
    loadMovieDetails();
  }, [movieId, mediaType]);

  useEffect(() => {
    if (movie && user?.sessionId && user?.accountId) {
      checkFavoriteStatus();
    }
  }, [movie, user]);

  const loadMovieDetails = async () => {
    try {
      setLoading(true);
      const data =
        mediaType === "tv"
          ? await tmdbApi.getTVShowDetails(movieId)
          : await tmdbApi.getMovieDetails(movieId);
      setMovie(data);
      setRecommendations(data.recommendations?.results || []);
    } catch (error) {
      console.error("Error loading details:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    if (!user?.sessionId || !user?.accountId || !movie) {
      return;
    }

    try {
      setCheckingFavorite(true);
      const favorites =
        mediaType === "tv"
          ? await tmdbApi.getFavoriteTVShows(user.accountId, user.sessionId)
          : await tmdbApi.getFavoriteMovies(user.accountId, user.sessionId);

      const favoriteIds = (favorites.results || []).map((item) => item.id);
      setIsFavorite(favoriteIds.includes(movie.id));
    } catch (error) {
      console.error("Error checking favorite status:", error);
    } finally {
      setCheckingFavorite(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user?.sessionId || !user?.accountId || !movie) {
      return;
    }

    try {
      const newFavoriteStatus = !isFavorite;
      if (mediaType === "tv") {
        await tmdbApi.toggleTVFavorite(
          user.accountId,
          user.sessionId,
          movie.id,
          newFavoriteStatus
        );
      } else {
        await tmdbApi.toggleMovieFavorite(
          user.accountId,
          user.sessionId,
          movie.id,
          newFavoriteStatus
        );
      }
      setIsFavorite(newFavoriteStatus);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  if (loading || !movie) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  const backdropUrl = getImageUrl(movie.backdrop_path, "backdrop", "large");
  const posterUrl = getImageUrl(movie.poster_path, "poster", "large");

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {backdropUrl && (
        <Image source={{ uri: backdropUrl }} style={styles.backdrop} />
      )}
      <View style={styles.content}>
        <View style={styles.header}>
          {posterUrl && (
            <Image source={{ uri: posterUrl }} style={styles.poster} />
          )}
          <View style={styles.headerInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{movie.title || movie.name}</Text>
              {user && (
                <TouchableOpacity
                  style={styles.favoriteButton}
                  onPress={handleToggleFavorite}
                  disabled={checkingFavorite}
                >
                  <Text style={styles.favoriteIcon}>
                    {isFavorite ? "❤️" : "🤍"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.rating}>
                ⭐ {movie.vote_average?.toFixed(1) || "N/A"}
              </Text>
              <Text style={styles.meta}>
                {movie.runtime || movie.episode_run_time?.[0] || "N/A"} min
              </Text>
              <Text style={styles.meta}>
                {new Date(
                  movie.release_date || movie.first_air_date
                ).getFullYear()}
              </Text>
            </View>
            <View style={styles.genres}>
              {movie.genres?.slice(0, 3).map((genre) => (
                <View key={genre.id} style={styles.genreTag}>
                  <Text style={styles.genreText}>{genre.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.overview}>{movie.overview}</Text>
        </View>

        {movie.credits?.cast && movie.credits.cast.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cast</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.castScroll}
            >
              {movie.credits.cast.slice(0, 10).map((actor) => (
                <View key={actor.id} style={styles.castItem}>
                  <Text style={styles.castName}>{actor.name}</Text>
                  <Text style={styles.castCharacter}>{actor.character}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {recommendations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recommendations</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.recommendationsScroll}
            >
              {recommendations.map((rec) => (
                <TouchableOpacity
                  key={rec.id}
                  onPress={() => {
                    navigation.replace("MovieDetails", {
                      movieId: rec.id,
                      mediaType: mediaType,
                    });
                  }}
                >
                  <ItemCard item={rec} onPress={() => {}} layout="swimlane" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0a0a",
  },
  backdrop: {
    width: width,
    height: height * 0.4,
    resizeMode: "cover",
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    marginBottom: 24,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 12,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    marginRight: 12,
  },
  favoriteButton: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteIcon: {
    fontSize: 28,
  },
  metaRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "center",
  },
  rating: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 16,
  },
  meta: {
    color: "#999",
    fontSize: 14,
    marginRight: 16,
  },
  genres: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  genreTag: {
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: "#fff",
    fontSize: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  overview: {
    color: "#ccc",
    fontSize: 16,
    lineHeight: 24,
  },
  castScroll: {
    marginTop: 12,
  },
  castItem: {
    marginRight: 16,
    padding: 12,
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    minWidth: 120,
  },
  castName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  castCharacter: {
    color: "#999",
    fontSize: 12,
  },
  recommendationsScroll: {
    marginTop: 12,
  },
});

export default ItemDetailsPage;

