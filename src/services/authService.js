import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { TMDB_CONFIG } from "../config/api";

const STORAGE_KEYS = {
  SESSION_ID: "tmdb_session_id",
  ACCOUNT_ID: "tmdb_account_id",
  USERNAME: "tmdb_username",
  REQUEST_TOKEN: "tmdb_request_token",
};

const api = axios.create({
  baseURL: TMDB_CONFIG.BASE_URL,
  params: {
    api_key: TMDB_CONFIG.API_KEY,
  },
});

export const authService = {
  /**
   * Step 1: Create a request token
   * This token will be used to authenticate the user
   */
  createRequestToken: async () => {
    try {
      const response = await api.get("/authentication/token/new");
      const requestToken = response.data.request_token;

      // Store request token temporarily (expires in 60 minutes)
      await SecureStore.setItemAsync(STORAGE_KEYS.REQUEST_TOKEN, requestToken);

      return requestToken;
    } catch (error) {
      console.error("Error creating request token:", error);
      throw error;
    }
  },

  /**
   * Step 2: Get the authentication URL
   * User needs to visit this URL to approve the request token
   */
  getAuthUrl: (requestToken) => {
    // TMDB requires a full URL for redirect_to, but we can use our custom scheme
    // The redirect will be: com.vibetmdb://auth?request_token=XXX&approved=true
    return `https://www.themoviedb.org/authenticate/${requestToken}?redirect_to=${encodeURIComponent("com.vibetmdb://auth")}`;
  },

  /**
   * Step 3: Create a session from approved request token
   * Call this after user approves the request token
   */
  createSession: async (requestToken) => {
    try {
      const response = await api.post("/authentication/session/new", {
        request_token: requestToken,
      });

      const sessionId = response.data.session_id;

      // Store session ID securely
      await SecureStore.setItemAsync(STORAGE_KEYS.SESSION_ID, sessionId);

      // Get account details
      const accountResponse = await api.get("/account", {
        params: { session_id: sessionId },
      });

      const accountId = accountResponse.data.id.toString();
      const username = accountResponse.data.username;

      // Store account info securely
      await SecureStore.setItemAsync(STORAGE_KEYS.ACCOUNT_ID, accountId);
      await SecureStore.setItemAsync(STORAGE_KEYS.USERNAME, username);

      // Clean up request token
      await SecureStore.deleteItemAsync(STORAGE_KEYS.REQUEST_TOKEN);

      return {
        sessionId,
        accountId,
        username,
        account: accountResponse.data,
      };
    } catch (error) {
      // Don't log 401 - expected when the same auth callback is handled twice (WebView + Linking)
      if (error.response?.status !== 401) {
        console.error("Error creating session:", error);
      }
      throw error;
    }
  },

  /**
   * Get stored session ID
   */
  getSessionId: async () => {
    try {
      return await SecureStore.getItemAsync(STORAGE_KEYS.SESSION_ID);
    } catch (error) {
      console.error("Error getting session ID:", error);
      return null;
    }
  },

  /**
   * Get stored account ID
   */
  getAccountId: async () => {
    try {
      return await SecureStore.getItemAsync(STORAGE_KEYS.ACCOUNT_ID);
    } catch (error) {
      console.error("Error getting account ID:", error);
      return null;
    }
  },

  /**
   * Get stored username
   */
  getUsername: async () => {
    try {
      return await SecureStore.getItemAsync(STORAGE_KEYS.USERNAME);
    } catch (error) {
      console.error("Error getting username:", error);
      return null;
    }
  },

  /**
   * Verify if user is logged in by checking session validity
   */
  verifySession: async () => {
    try {
      const sessionId = await SecureStore.getItemAsync(STORAGE_KEYS.SESSION_ID);
      if (!sessionId) {
        return null;
      }

      // Verify session is still valid by getting account info
      const response = await api.get("/account", {
        params: { session_id: sessionId },
      });

      const accountId = response.data.id.toString();
      const username = response.data.username;

      // Update stored account info
      await SecureStore.setItemAsync(STORAGE_KEYS.ACCOUNT_ID, accountId);
      await SecureStore.setItemAsync(STORAGE_KEYS.USERNAME, username);

      return {
        sessionId,
        accountId,
        username,
        account: response.data,
      };
    } catch (error) {
      // Session is invalid, clear stored data
      await authService.logout();
      return null;
    }
  },

  /**
   * Get all stored auth data
   */
  getAuthData: async () => {
    try {
      const [sessionId, accountId, username] = await Promise.all([
        SecureStore.getItemAsync(STORAGE_KEYS.SESSION_ID),
        SecureStore.getItemAsync(STORAGE_KEYS.ACCOUNT_ID),
        SecureStore.getItemAsync(STORAGE_KEYS.USERNAME),
      ]);

      if (!sessionId) {
        return null;
      }

      return {
        sessionId,
        accountId,
        username,
      };
    } catch (error) {
      console.error("Error getting auth data:", error);
      return null;
    }
  },

  /**
   * Logout - clear all stored authentication data
   */
  logout: async () => {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(STORAGE_KEYS.SESSION_ID),
        SecureStore.deleteItemAsync(STORAGE_KEYS.ACCOUNT_ID),
        SecureStore.deleteItemAsync(STORAGE_KEYS.USERNAME),
        SecureStore.deleteItemAsync(STORAGE_KEYS.REQUEST_TOKEN),
      ]);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  },
};
