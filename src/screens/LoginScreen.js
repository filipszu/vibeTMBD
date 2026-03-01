import React, { useState, useEffect, useRef } from "react";
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
import { useFocusEffect } from "@react-navigation/native";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const LoginScreen = ({ navigation }) => {
  const { login, user } = useAuth();
  const [requestToken, setRequestToken] = useState(null);
  const [authUrl, setAuthUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  const hasNavigatedRef = useRef(false);
  const previousUserRef = useRef(user);

  // Navigate away when user becomes authenticated (handles both WebView and deep link cases)
  useEffect(() => {
    // Check if user just logged in (changed from null/undefined to a user object)
    const userJustLoggedIn = user && !previousUserRef.current;
    
    if (userJustLoggedIn && !hasNavigatedRef.current) {
      // User just logged in, navigate back
      hasNavigatedRef.current = true;
      setProcessing(false);
      // Use a small timeout to ensure navigation state is ready
      const timer = setTimeout(() => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.navigate("AccountMain");
        }
      }, 300);
      return () => clearTimeout(timer);
    }
    
    // Update previous user ref
    previousUserRef.current = user;
  }, [user, navigation]);

  // Reset navigation flag when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      hasNavigatedRef.current = false;
      previousUserRef.current = user;
      // If user is already authenticated when screen is focused, navigate away
      if (user) {
        hasNavigatedRef.current = true;
        const timer = setTimeout(() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }, 100);
        return () => clearTimeout(timer);
      }
    }, [user, navigation])
  );

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
    
    if (!url) return;
    
    console.log("WebView navigation to:", url);

    // Check if this is a deep link redirect
    if (url.startsWith("com.vibetmdb://auth")) {
      console.log("Deep link detected in WebView:", url);
      setProcessing(true);
      
      // Extract query parameters manually
      const queryString = url.split("?")[1];
      if (queryString) {
        const params = {};
        queryString.split("&").forEach((param) => {
          const [key, value] = param.split("=");
          params[key] = decodeURIComponent(value || "");
        });

        const requestToken = params.request_token;
        const approved = params.approved;

        if (approved === "true" && requestToken) {
          try {
            console.log("Processing auth callback with token:", requestToken);
            const sessionData = await authService.createSession(requestToken);
            await login(sessionData);
            // Navigation will be handled by useEffect watching user state
          } catch (error) {
            console.error("Error creating session:", error);
            Alert.alert(
              "Login Failed",
              "Failed to complete login. Please try again.",
              [{ text: "OK", onPress: initializeAuth }]
            );
            setProcessing(false);
          }
        } else if (approved === "false") {
          Alert.alert("Access Denied", "You need to approve access to continue.", [
            { text: "OK", onPress: initializeAuth },
          ]);
          setProcessing(false);
        }
      }
      return;
    }

    // Check if user is on their profile page after authentication
    // This might happen if they're already logged in to TMDB
    if (url.includes("themoviedb.org/u/") || url.includes("themoviedb.org/user/")) {
      console.log("User on profile page, checking if token was approved...");
      // If we're on profile page and have a request token, try to create session
      // TMDB might have auto-approved if user was already logged in
      if (requestToken) {
        setProcessing(true);
        try {
          // Try to create session - if token was approved, this will work
          const sessionData = await authService.createSession(requestToken);
          await login(sessionData);
          // Navigation will be handled by useEffect
        } catch (error) {
          console.error("Token not approved yet or error:", error);
          // Token might not be approved yet, wait for redirect
          setProcessing(false);
        }
      }
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
        // Navigation will be handled by the useEffect that watches for user state
        // Small delay to ensure state updates
        setTimeout(() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate("AccountMain");
          }
        }, 100);
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
            onShouldStartLoadWithRequest={(request) => {
              const { url } = request;
              
              console.log("WebView shouldStartLoadWithRequest:", url);
              
              // Intercept deep link redirects
              if (url && url.startsWith("com.vibetmdb://auth")) {
                console.log("Intercepting deep link:", url);
                handleWebViewNavigation({ url });
                return false; // Prevent WebView from loading the deep link
              }
              
              // Allow normal navigation
              return true;
            }}
            setSupportMultipleWindows={false}
            onMessage={(event) => {
              // Handle messages from injected JavaScript
              try {
                const data = JSON.parse(event.nativeEvent.data);
                if (data.type === "redirect" && data.url) {
                  console.log("JavaScript detected redirect:", data.url);
                  handleWebViewNavigation({ url: data.url });
                }
              } catch (error) {
                console.error("Error parsing WebView message:", error);
              }
            }}
            injectedJavaScript={`
              (function() {
                // Monitor location changes
                let lastUrl = window.location.href;
                
                function checkUrl(url) {
                  if (url && (url.startsWith('com.vibetmdb://auth') || url.includes('approved=true') || url.includes('denied=true'))) {
                    console.log('Detected redirect:', url);
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'redirect',
                      url: url
                    }));
                  }
                }
                
                // Check current URL
                checkUrl(lastUrl);
                
                // Monitor for URL changes
                setInterval(function() {
                  if (window.location.href !== lastUrl) {
                    lastUrl = window.location.href;
                    checkUrl(lastUrl);
                  }
                }, 100);
                
                // Override location changes
                const originalAssign = window.location.assign;
                const originalReplace = window.location.replace;
                
                window.location.assign = function(url) {
                  checkUrl(url);
                  return originalAssign.apply(window.location, arguments);
                };
                
                window.location.replace = function(url) {
                  checkUrl(url);
                  return originalReplace.apply(window.location, arguments);
                };
              })();
              true;
            `}
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
