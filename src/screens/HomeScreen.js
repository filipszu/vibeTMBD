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
import MovieCard from "../components/MovieCard";
import Header from "../components/Header";

const HomeScreen = ({ navigation }) => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [popular, trending] = await Promise.all([
        tmdbApi.getPopularMovies(1),
        tmdbApi.getTrendingMovies("day"),
      ]);
      setPopularMovies(popular.results || []);
      setTrendingMovies(trending.results || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
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

  const renderSection = (title, data) => {
    if (!data || data.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <MovieCard movie={item} onPress={() => handleMoviePress(item)} />
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
          { key: "trending", title: "Trending Today", data: trendingMovies },
          { key: "popular", title: "Popular Movies", data: popularMovies },
        ]}
        renderItem={({ item }) => renderSection(item.title, item.data)}
        keyExtractor={(item) => item.key}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
