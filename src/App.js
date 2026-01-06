import React, { useEffect } from "react";
import { StatusBar, Linking } from "react-native";
import "react-native-gesture-handler";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AppNavigator from "./navigation/AppNavigator";
import { authService } from "./services/authService";

const AppContent = () => {
  const { login } = useAuth();

  useEffect(() => {
    // Handle deep link when app is already open
    const handleDeepLink = async (url) => {
      if (!url) return;

      console.log("Deep link received:", url);

      // Parse the URL: com.vibetmdb://auth?request_token=XXX&approved=true
      if (url.startsWith("com.vibetmdb://auth")) {
        try {
          // Extract query parameters manually
          const queryString = url.split("?")[1];
          if (!queryString) return;

          const params = {};
          queryString.split("&").forEach((param) => {
            const [key, value] = param.split("=");
            params[key] = decodeURIComponent(value || "");
          });

          const requestToken = params.request_token;
          const approved = params.approved;

          if (approved === "true" && requestToken) {
            console.log("Processing auth callback with token:", requestToken);
            // Complete the authentication
            const sessionData = await authService.createSession(requestToken);
            await login(sessionData);
          } else if (approved === "false") {
            console.log("User denied access");
          }
        } catch (error) {
          console.error("Error handling deep link:", error);
        }
      }
    };

    // Get initial URL if app was opened via deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    // Listen for deep links while app is running
    const subscription = Linking.addEventListener("url", (event) => {
      handleDeepLink(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, [login]);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <AppNavigator />
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
