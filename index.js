import { AppRegistry } from "react-native";
import App from "./src/App";

// Register the app component
// "vibeTMBD" matches MainActivity.java for development builds
// "main" is also registered for compatibility
const appName = "vibeTMBD";
AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent("main", () => App);
