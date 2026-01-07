import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Text,
} from "react-native";
import { tmdbApi } from "../services/tmdbApi";
import ItemCard from "../components/ItemCard";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularTVShows, setPopularTVShows] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (user?.sessionId && user?.accountId) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [popular, popularTV, trending] = await Promise.all([
        tmdbApi.getPopularMovies(1),
        tmdbApi.getPopularTVShows(1),
        tmdbApi.getTrendingMovies("day"),
      ]);
      setPopularMovies(popular.results || []);
      setPopularTVShows(popularTV.results || []);
      setTrendingMovies(trending.results || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadFavorites = async () => {
    if (!user?.sessionId || !user?.accountId) {
      setFavorites([]);
      return;
    }

    try {
      const [moviesData, tvData] = await Promise.all([
        tmdbApi.getFavoriteMovies(user.accountId, user.sessionId),
        tmdbApi.getFavoriteTVShows(user.accountId, user.sessionId),
      ]);

      // Combine movies and TV shows, adding media_type to each item
      const combinedFavorites = [
        ...(moviesData.results || []).map((item) => ({
          ...item,
          media_type: "movie",
        })),
        ...(tvData.results || []).map((item) => ({
          ...item,
          media_type: "tv",
        })),
      ];

      setFavorites(combinedFavorites);
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleMoviePress = (movie) => {
    navigation.navigate("MovieDetails", {
      movieId: movie.id,
      mediaType: "movie",
    });
  };

  const handleItemPress = (item) => {
    const mediaType = item.media_type || "movie";
    navigation.navigate("MovieDetails", {
      movieId: item.id,
      mediaType: mediaType,
    });
  };

  const renderSection = (title, data, mediaType = "movie") => {
    if (!data || data.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <ItemCard
              item={item}
              onPress={() => {
                navigation.navigate("MovieDetails", {
                  movieId: item.id,
                  mediaType: mediaType,
                });
              }}
              layout="swimlane"
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.swimlaneContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Vibe TMDB"
        onSearchPress={() => navigation.navigate("Search")}
      />
      <FlatList
        data={[
          ...(favorites.length > 0 && user
            ? [{ key: "favorites", title: "My Favorites", data: favorites }]
            : []),
          { key: "trending", title: "Trending Today", data: trendingMovies },
          { key: "popular", title: "Popular Movies", data: popularMovies },
          { key: "popularTV", title: "Popular TV Shows", data: popularTVShows, mediaType: "tv" },
        ]}
        renderItem={({ item }) => {
          if (item.key === "favorites") {
            return (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{item.title}</Text>
                <FlatList
                  data={item.data}
                  renderItem={({ item: favoriteItem }) => (
                    <ItemCard
                      item={favoriteItem}
                      onPress={() => handleItemPress(favoriteItem)}
                      layout="swimlane"
                    />
                  )}
                  keyExtractor={(item) => `${item.id}-${item.media_type}`}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.swimlaneContent}
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
              </View>
            );
          }
          return renderSection(item.title, item.data, item.mediaType || "movie");
        }}
        keyExtractor={(item) => item.key}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadData();
              if (user?.sessionId && user?.accountId) {
                loadFavorites();
              }
            }}
          />
        }
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
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
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  swimlaneContent: {
    paddingHorizontal: 20,
  },
  separator: {
    width: 12,
  },
});

export default HomeScreen;
