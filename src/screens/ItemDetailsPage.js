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
  Modal,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { tmdbApi } from "../services/tmdbApi";
import { getImageUrl } from "../config/api";
import ItemCard from "../components/ItemCard";
import { useAuth } from "../context/AuthContext";

const { width, height } = Dimensions.get("window");

// Helper function to format currency
const formatCurrency = (amount) => {
  if (!amount || amount === 0) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const ItemDetailsPage = ({ route, navigation }) => {
  const { movieId, mediaType = "movie" } = route.params;
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isShowingSimilar, setIsShowingSimilar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [checkingFavorite, setCheckingFavorite] = useState(false);
  const [trailerModalVisible, setTrailerModalVisible] = useState(false);

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
      
      // Check if we have recommendations
      const recs = data.recommendations?.results || [];
      if (recs.length > 0) {
        setRecommendations(recs);
        setIsShowingSimilar(false);
      } else {
        // Fallback to similar items
        try {
          const similarData =
            mediaType === "tv"
              ? await tmdbApi.getSimilarTVShows(movieId)
              : await tmdbApi.getSimilarMovies(movieId);
          setRecommendations(similarData.results || []);
          setIsShowingSimilar(true);
        } catch (error) {
          console.error("Error loading similar items:", error);
          setRecommendations([]);
          setIsShowingSimilar(false);
        }
      }
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

  const videos = movie.videos?.results || [];
  const trailer =
    videos.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
    videos.find((v) => v.site === "YouTube");
  const trailerKey = trailer?.key ?? null;

  return (
    <>
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

        {trailerKey && (
          <TouchableOpacity
            style={styles.trailerButton}
            onPress={() => setTrailerModalVisible(true)}
          >
            <Text style={styles.trailerButtonText}>Watch Trailer</Text>
          </TouchableOpacity>
        )}

        {mediaType === "movie" && (movie.budget > 0 || movie.revenue > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Financials</Text>
            <View style={styles.financialsRow}>
              {movie.budget > 0 && (
                <View style={styles.financialItem}>
                  <Text style={styles.financialLabel}>Budget</Text>
                  <Text style={styles.financialValue}>
                    {formatCurrency(movie.budget)}
                  </Text>
                </View>
              )}
              {movie.revenue > 0 && (
                <View style={styles.financialItem}>
                  <Text style={styles.financialLabel}>Revenue</Text>
                  <Text style={styles.financialValue}>
                    {formatCurrency(movie.revenue)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

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
              {movie.credits.cast.slice(0, 10).map((actor) => {
                const profileUrl = getImageUrl(actor.profile_path, "profile", "medium");
                return (
                  <View key={actor.id} style={styles.castItem}>
                    {profileUrl ? (
                      <Image
                        source={{ uri: profileUrl }}
                        style={styles.castImage}
                      />
                    ) : (
                      <View style={styles.castImagePlaceholder}>
                        <Text style={styles.castImagePlaceholderText}>
                          {actor.name?.charAt(0)?.toUpperCase() || "?"}
                        </Text>
                      </View>
                    )}
                    <Text style={styles.castName} numberOfLines={1}>
                      {actor.name}
                    </Text>
                    <Text style={styles.castCharacter} numberOfLines={1}>
                      {actor.character}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        {recommendations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {isShowingSimilar
                ? `Similar to ${movie.title || movie.name}`
                : "Recommendations"}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.recommendationsScroll}
              contentContainerStyle={styles.recommendationsContent}
            >
              {recommendations.map((rec, index) => (
                <View
                  key={rec.id}
                  style={[
                    styles.recommendationItem,
                    index === recommendations.length - 1 && styles.recommendationItemLast,
                  ]}
                >
                  <ItemCard
                    item={rec}
                    onPress={() => {
                      // Determine media type - use the item's media_type if available, otherwise use current mediaType
                      const itemMediaType = rec.media_type || mediaType;
                      navigation.navigate("MovieDetails", {
                        movieId: rec.id,
                        mediaType: itemMediaType === "tv" ? "tv" : "movie",
                      });
                    }}
                    layout="swimlane"
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </ScrollView>

      <Modal
        visible={trailerModalVisible}
        onRequestClose={() => setTrailerModalVisible(false)}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setTrailerModalVisible(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.trailerPlayerContainer}>
              <YoutubePlayer
                height={((width - 32) * 9) / 16}
                play={true}
                videoId={trailerKey}
              />
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setTrailerModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.modalCloseText}>×</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
    alignItems: "center",
    width: 100,
  },
  castImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
    backgroundColor: "#1a1a1a",
  },
  castImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
    backgroundColor: "#2a2a2a",
    justifyContent: "center",
    alignItems: "center",
  },
  castImagePlaceholderText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
  castName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
    width: "100%",
  },
  castCharacter: {
    color: "#999",
    fontSize: 12,
    textAlign: "center",
    width: "100%",
  },
  recommendationsScroll: {
    marginTop: 12,
  },
  recommendationsContent: {
    paddingRight: 20,
  },
  recommendationItem: {
    marginRight: 12,
  },
  recommendationItemLast: {
    marginRight: 0,
  },
  financialsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
  },
  financialItem: {
    alignItems: "center",
    flex: 1,
  },
  financialLabel: {
    color: "#999",
    fontSize: 14,
    marginBottom: 8,
  },
  financialValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  trailerButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 24,
  },
  trailerButtonText: {
    color: "#0a0a0a",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modalContent: {
    width: width - 32,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    overflow: "hidden",
  },
  trailerPlayerContainer: {
    position: "relative",
  },
  modalCloseButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "300",
    lineHeight: 26,
  },
});

export default ItemDetailsPage;

