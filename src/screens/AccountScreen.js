import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { tmdbApi } from "../services/tmdbApi";

const AccountScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [favoriteMoviesCount, setFavoriteMoviesCount] = useState(0);
  const [favoriteTVShowsCount, setFavoriteTVShowsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadFavoriteCounts();
    }
  }, [user]);

  const loadFavoriteCounts = async () => {
    if (!user?.sessionId || !user?.accountId) {
      return;
    }

    try {
      setLoading(true);
      const [moviesData, tvData] = await Promise.all([
        tmdbApi.getFavoriteMovies(user.accountId, user.sessionId),
        tmdbApi.getFavoriteTVShows(user.accountId, user.sessionId),
      ]);
      setFavoriteMoviesCount(moviesData.total_results || 0);
      setFavoriteTVShowsCount(tvData.total_results || 0);
    } catch (error) {
      console.error("Error loading favorite counts:", error);
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

  const handleLoginPress = () => {
    navigation.navigate("Login");
  };

  const handleFavoriteMoviesPress = () => {
    navigation.navigate("FavoritesView", {
      collectionType: "movies",
      title: "Favorite Movies",
    });
  };

  const handleFavoriteTVShowsPress = () => {
    navigation.navigate("FavoritesView", {
      collectionType: "tv",
      title: "Favorite TV Shows",
    });
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

      <View style={styles.favoritesSection}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFD700" />
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={styles.favoriteCountItem}
              onPress={handleFavoriteMoviesPress}
              activeOpacity={0.7}
            >
              <Text style={styles.favoriteCountLabel}>Favorite Movies</Text>
              <Text style={styles.favoriteCountValue}>
                {favoriteMoviesCount}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.favoriteCountItem}
              onPress={handleFavoriteTVShowsPress}
              activeOpacity={0.7}
            >
              <Text style={styles.favoriteCountLabel}>Favorite TV Shows</Text>
              <Text style={styles.favoriteCountValue}>
                {favoriteTVShowsCount}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
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
  favoritesSection: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteCountItem: {
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  favoriteCountLabel: {
    color: "#999",
    fontSize: 14,
    marginBottom: 8,
  },
  favoriteCountValue: {
    color: "#FFD700",
    fontSize: 32,
    fontWeight: "bold",
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
});

export default AccountScreen;
