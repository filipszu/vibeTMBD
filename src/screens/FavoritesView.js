import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { tmdbApi } from "../services/tmdbApi";
import ItemCard from "../components/ItemCard";

const FavoritesView = ({ route, navigation }) => {
  const { collectionType, title } = route.params; // 'movies' or 'tv'
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    // Set navigation title
    navigation.setOptions({
      title: title || (collectionType === "movies" ? "Favorite Movies" : "Favorite TV Shows"),
      headerStyle: { backgroundColor: "#0a0a0a" },
      headerTintColor: "#fff",
    });
  }, [navigation, title, collectionType]);

  const loadItems = async (pageNum = 1, append = false) => {
    if (!user?.sessionId || !user?.accountId) {
      setLoading(false);
      return;
    }

    try {
      if (!append) {
        setLoading(true);
      }

      const data =
        collectionType === "movies"
          ? await tmdbApi.getFavoriteMovies(user.accountId, user.sessionId, pageNum)
          : await tmdbApi.getFavoriteTVShows(user.accountId, user.sessionId, pageNum);

      const newItems = data.results || [];
      
      if (append) {
        setItems((prev) => [...prev, ...newItems]);
      } else {
        setItems(newItems);
      }

      // Check if there are more pages
      const totalPages = data.total_pages || 1;
      setHasMore(pageNum < totalPages);
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    loadItems(1, false);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore && !refreshing) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadItems(nextPage, true);
    }
  };

  const handleItemPress = (item) => {
    const mediaType = collectionType === "movies" ? "movie" : "tv";
    navigation.navigate("MovieDetails", {
      movieId: item.id,
      mediaType: mediaType,
    });
  };

  if (loading && items.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>Please log in to view favorites</Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>
          No favorite {collectionType === "movies" ? "movies" : "TV shows"} yet
        </Text>
        <Text style={styles.emptySubtext}>
          Add items to your favorites to see them here
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <ItemCard
            item={item}
            onPress={() => handleItemPress(item)}
            layout="grid"
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          hasMore && items.length > 0 ? (
            <View style={styles.footer}>
              <ActivityIndicator size="small" color="#FFD700" />
            </View>
          ) : null
        }
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
    padding: 20,
    backgroundColor: "#0a0a0a",
  },
  listContent: {
    padding: 20,
  },
  row: {
    justifyContent: "space-between",
  },
  emptyText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
  },
  footer: {
    paddingVertical: 20,
    alignItems: "center",
  },
});

export default FavoritesView;


