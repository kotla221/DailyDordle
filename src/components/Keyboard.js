import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";

const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
];

const KEY_BG = {
  correct: "#538d4e",
  present: "#b59f3b",
  absent:  "#3a3a3c",
  default: "#818384",
};

export default function Keyboard({ onKey, keyStatus }) {
  return (
    <View style={styles.keyboard}>
      {ROWS.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map((key) => {
            const status = keyStatus[key] ?? "default";
            const isWide = key === "ENTER" || key === "⌫";
            return (
              <TouchableOpacity
                key={key}
                onPress={() => onKey(key)}
                style={[
                  styles.key,
                  isWide && styles.wideKey,
                  { backgroundColor: KEY_BG[status] },
                ]}
                activeOpacity={0.7}
              >
                <Text style={[styles.keyText, isWide && styles.wideKeyText]}>
                  {key}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    paddingHorizontal: 8,
    paddingBottom: Platform.OS === "web" ? 16 : 8,
    paddingTop: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 6,
  },
  key: {
    width: 33,
    height: 52,
    marginHorizontal: 2.5,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  wideKey: {
    width: 50,
  },
  keyText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  wideKeyText: {
    fontSize: 11,
  },
});
