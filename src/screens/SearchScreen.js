import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import { tmdbApi } from "../services/tmdbApi";
import ItemCard from "../components/ItemCard";
import Header from "../components/Header";

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState("movie"); // 'movie' or 'tv'

  useEffect(() => {
    if (query.length > 2) {
      const debounceTimer = setTimeout(() => {
        performSearch();
      }, 500);
      return () => clearTimeout(debounceTimer);
    } else {
      setResults([]);
    }
  }, [query, searchType]);

  const performSearch = async () => {
    try {
      setLoading(true);
      const data =
        searchType === "movie"
          ? await tmdbApi.searchMovies(query)
          : await tmdbApi.searchTVShows(query);
      setResults(data.results || []);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoviePress = (item) => {
    navigation.navigate("MovieDetails", {
      movieId: item.id,
      mediaType: searchType === "tv" ? "tv" : "movie",
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Search" />
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search movies or TV shows..."
          placeholderTextColor="#666"
          value={query}
          onChangeText={setQuery}
          autoFocus
        />
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              searchType === "movie" && styles.toggleButtonActive,
            ]}
            onPress={() => setSearchType("movie")}
          >
            <Text
              style={[
                styles.toggleText,
                searchType === "movie" && styles.toggleTextActive,
              ]}
            >
              Movies
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              searchType === "tv" && styles.toggleButtonActive,
            ]}
            onPress={() => setSearchType("tv")}
          >
            <Text
              style={[
                styles.toggleText,
                searchType === "tv" && styles.toggleTextActive,
              ]}
            >
              TV Shows
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
        </View>
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={({ item }) => (
            <ItemCard
              item={item}
              onPress={() => handleMoviePress(item)}
              layout="grid"
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : query.length > 2 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.noResults}>No results found</Text>
        </View>
      ) : (
        <View style={styles.centerContainer}>
          <Text style={styles.placeholder}>
            Start typing to search for{" "}
            {searchType === "movie" ? "movies" : "TV shows"}...
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  searchContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  searchInput: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    fontSize: 16,
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: "row",
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: "#FFD700",
  },
  toggleText: {
    color: "#999",
    fontSize: 14,
    fontWeight: "600",
  },
  toggleTextActive: {
    color: "#000",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 20,
  },
  row: {
    justifyContent: "space-between",
  },
  noResults: {
    color: "#999",
    fontSize: 16,
  },
  placeholder: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});

export default SearchScreen;
