import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { tmdbApi } from "../services/tmdbApi";
import ItemCard from "../components/ItemCard";

const AccountScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [favoriteTVShows, setFavoriteTVShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("movies"); // 'movies' or 'tv'

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user, activeTab]);

  const loadFavorites = async () => {
    if (!user?.sessionId || !user?.accountId) {
      return;
    }

    try {
      setLoading(true);
      if (activeTab === "movies") {
        const data = await tmdbApi.getFavoriteMovies(
          user.accountId,
          user.sessionId
        );
        setFavoriteMovies(data.results || []);
      } else {
        const data = await tmdbApi.getFavoriteTVShows(
          user.accountId,
          user.sessionId
        );
        setFavoriteTVShows(data.results || []);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Navigation will be handled by AuthNavigator
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleItemPress = (item) => {
    const mediaType = activeTab === "movies" ? "movie" : "tv";
    navigation.navigate("MovieDetails", {
      movieId: item.id,
      mediaType: mediaType,
    });
  };

  const handleLoginPress = () => {
    navigation.navigate("Login");
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.loginPromptText}>To favorite items please</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLoginPress}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const favorites = activeTab === "movies" ? favoriteMovies : favoriteTVShows;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.username?.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.username}>{user.username || "User"}</Text>
            <Text style={styles.accountId}>Account ID: {user.accountId}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "movies" && styles.tabActive]}
          onPress={() => setActiveTab("movies")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "movies" && styles.tabTextActive,
            ]}
          >
            Favorite Movies
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "tv" && styles.tabActive]}
          onPress={() => setActiveTab("tv")}
        >
          <Text
            style={[styles.tabText, activeTab === "tv" && styles.tabTextActive]}
          >
            Favorite TV Shows
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
        </View>
      ) : favorites.length > 0 ? (
        <FlatList
          data={favorites}
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
        />
      ) : (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>
            No favorite {activeTab === "movies" ? "movies" : "TV shows"} yet
          </Text>
          <Text style={styles.emptySubtext}>
            Add items to your favorites to see them here
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
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    color: "#000",
    fontSize: 24,
    fontWeight: "bold",
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  accountId: {
    fontSize: 14,
    color: "#999",
  },
  logoutButton: {
    backgroundColor: "#1a1a1a",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  logoutButtonText: {
    color: "#ff4444",
    fontSize: 16,
    fontWeight: "600",
  },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#FFD700",
  },
  tabText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#FFD700",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loginPromptText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 24,
    textAlign: "center",
  },
  loginButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    minWidth: 120,
  },
  loginButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
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
  listContent: {
    padding: 20,
  },
  row: {
    justifyContent: "space-between",
  },
});

export default AccountScreen;
