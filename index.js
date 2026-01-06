import { AppRegistry } from "react-native";
import App from "./src/App";

// Register with both names for compatibility:
// - "vibeTMBD" for development builds (matches MainActivity.java)
// - "main" for Expo Go (if needed)
const appName = "vibeTMBD";
AppRegistry.registerComponent(appName, () => App);
// Also register as "main" for Expo Go compatibility
AppRegistry.registerComponent("main", () => App);
