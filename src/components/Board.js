import React from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import Tile from "./Tile";
import { MAX_GUESSES, WORD_LENGTH } from "../utils/gameLogic";

export default function Board({ guesses, evaluations, currentGuess, currentRow, won, label }) {
  const { width } = useWindowDimensions();
  const boardWidth = (Math.min(width, 700) - 9 - 32) / 2;
  const tileSize = Math.floor(boardWidth / WORD_LENGTH) - 4;

  const rows = [];
  for (let row = 0; row < MAX_GUESSES; row++) {
    const tiles = [];
    const isCurrentRow = row === currentRow;
    const isSubmitted = row < guesses.length;

    for (let col = 0; col < WORD_LENGTH; col++) {
      let letter = "";
      let status = "empty";
      if (isSubmitted) {
        letter = guesses[row][col] ?? "";
        status = evaluations[row]?.[col] ?? "absent";
      } else if (isCurrentRow) {
        letter = currentGuess[col] ?? "";
        status = letter ? "active" : "empty";
      }
      tiles.push(<Tile key={`${row}-${col}`} letter={letter} status={status} size={tileSize} />);
    }
    rows.push(<View key={row} style={styles.row}>{tiles}</View>);
  }

  return (
    <View style={styles.board}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {won && (
          <View style={styles.solvedBadge}>
            <Text style={styles.solvedText}>✓ Solved</Text>
          </View>
        )}
      </View>
      {rows}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    flex: 1,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
    height: 22,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#818384",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  solvedBadge: {
    backgroundColor: "#538d4e",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 20,
  },
  solvedText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
});
