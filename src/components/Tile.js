import React from "react";
import { View, Text, StyleSheet } from "react-native";

const STATUS_BG = {
  correct: "#538d4e",
  present: "#b59f3b",
  absent:  "#3a3a3c",
  empty:   "transparent",
  active:  "transparent",
};

const STATUS_BORDER = {
  correct: "#538d4e",
  present: "#b59f3b",
  absent:  "#3a3a3c",
  empty:   "#3a3a3c",
  active:  "#999",
};

const STATUS_TEXT = {
  correct: "#fff",
  present: "#fff",
  absent:  "#fff",
  empty:   "transparent",
  active:  "#fff",
};

export default function Tile({ letter = "", status = "empty", size = 36 }) {
  return (
    <View
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          backgroundColor: STATUS_BG[status],
          borderColor: STATUS_BORDER[status],
          borderWidth: status === "active" ? 2 : status === "empty" ? 2 : 0,
        },
      ]}
    >
      <Text style={[styles.letter, { fontSize: size * 0.44, color: STATUS_TEXT[status] }]}>
        {letter.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    margin: 2,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  letter: {
    fontWeight: "800",
    letterSpacing: 1,
  },
});
