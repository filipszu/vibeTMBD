import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FFD700",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 24,
  },
  buttonText: {
    color: "#0a0a0a",
    fontSize: 16,
    fontWeight: "600",
  },
});

const TrailerButton = ({ onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>Watch Trailer</Text>
  </TouchableOpacity>
);

export default TrailerButton;
