import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { WebView } from "react-native-webview";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [requestToken, setRequestToken] = useState(null);
  const [authUrl, setAuthUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setLoading(true);
      const token = await authService.createRequestToken();
      setRequestToken(token);
      const url = authService.getAuthUrl(token);
      setAuthUrl(url);
    } catch (error) {
      console.error("Error initializing auth:", error);
      Alert.alert(
        "Authentication Error",
        "Failed to initialize authentication. Please try again.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleWebViewNavigation = async (navState) => {
    const { url } = navState;

    // Check if this is a deep link redirect (user opened in browser)
    if (url.startsWith("com.vibetmdb://auth")) {
      // Deep link will be handled by App.js, just close the WebView
      setProcessing(true);
      return;
    }

    // Check if user approved the request token
    // TMDB redirects to a URL with approved=true or similar
    if (url.includes("approved=true") || url.includes("allow_access=true")) {
      setProcessing(true);
      try {
        // Extract request token from URL if available, otherwise use stored one
        let tokenToUse = requestToken;

        // Try to extract request_token from URL if present
        if (url.includes("request_token=")) {
          const match = url.match(/request_token=([^&]+)/);
          if (match && match[1]) {
            tokenToUse = decodeURIComponent(match[1]);
          }
        }

        if (!tokenToUse) {
          throw new Error("Request token not found");
        }

        const sessionData = await authService.createSession(tokenToUse);
        await login(sessionData);
        // Navigation will be handled by AuthNavigator
      } catch (error) {
        console.error("Error creating session:", error);
        Alert.alert(
          "Login Failed",
          "Failed to complete login. Please try again.",
          [{ text: "OK", onPress: initializeAuth }]
        );
        setProcessing(false);
      }
    } else if (
      url.includes("denied=true") ||
      url.includes("deny_access=true")
    ) {
      Alert.alert("Access Denied", "You need to approve access to continue.", [
        { text: "OK", onPress: initializeAuth },
      ]);
    }
  };

  const openInBrowser = () => {
    if (authUrl) {
      Linking.openURL(authUrl);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Preparing login...</Text>
        </View>
      </View>
    );
  }

  if (processing) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Completing login...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Login to TMDB</Text>
        <Text style={styles.subtitle}>
          Sign in with your The Movie Database account to access favorites and
          more
        </Text>
      </View>

      {authUrl ? (
        <View style={styles.webViewContainer}>
          <WebView
            source={{ uri: authUrl }}
            onNavigationStateChange={handleWebViewNavigation}
            style={styles.webView}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.webViewLoading}>
                <ActivityIndicator size="large" color="#FFD700" />
              </View>
            )}
          />
        </View>
      ) : (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>
            Failed to load authentication page
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={initializeAuth}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Having trouble?</Text>
        <TouchableOpacity onPress={openInBrowser}>
          <Text style={styles.footerLink}>Open in browser</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#999",
    lineHeight: 20,
  },
  webViewContainer: {
    flex: 1,
  },
  webView: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  webViewLoading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0a0a",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    color: "#fff",
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    padding: 20,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#1a1a1a",
  },
  footerText: {
    color: "#666",
    fontSize: 14,
    marginBottom: 8,
  },
  footerLink: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default LoginScreen;
