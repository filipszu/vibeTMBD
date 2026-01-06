import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { getImageUrl } from "../config/api";

const { width } = Dimensions.get("window");
const swimlaneCardWidth = 140; // Fixed width for horizontal swimlanes
const gridCardWidth = (width - 48) / 2; // 2 columns with padding for grid

const ItemCard = ({ item, onPress, layout = "swimlane" }) => {
  const posterUrl = getImageUrl(item.poster_path, "poster", "medium");
  const cardWidth = layout === "grid" ? gridCardWidth : swimlaneCardWidth;
  const cardStyles = [
    styles.card,
    { width: cardWidth },
    layout === "grid" && styles.gridCard,
  ];

  return (
    <TouchableOpacity style={cardStyles} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        {posterUrl ? (
          <Image source={{ uri: posterUrl }} style={styles.poster} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>
            {item.vote_average?.toFixed(1) || "N/A"}
          </Text>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title || item.name}
        </Text>
        {item.release_date && (
          <Text style={styles.date}>
            {new Date(item.release_date || item.first_air_date).getFullYear()}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gridCard: {
    marginBottom: 20,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 2 / 3, // Standard poster aspect ratio
    position: "relative",
  },
  poster: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#2a2a2a",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#666",
    fontSize: 12,
  },
  ratingContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  rating: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "bold",
  },
  infoContainer: {
    padding: 12,
  },
  title: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  date: {
    color: "#999",
    fontSize: 12,
  },
});

export default ItemCard;
