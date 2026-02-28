import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import Board from "../components/Board";
import Keyboard from "../components/Keyboard";
import {
  evaluateGuess,
  getKeyboardStatus,
  mergeKeyboardStatuses,
  MAX_GUESSES,
  WORD_LENGTH,
} from "../utils/gameLogic";

export default function GameScreen({ word1, word2, puzzleNumber, onGameEnd }) {
  const [guesses, setGuesses] = useState([]);
  const [evaluations1, setEvaluations1] = useState([]);
  const [evaluations2, setEvaluations2] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [won1, setWon1] = useState(false);
  const [won2, setWon2] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [shake, setShake] = useState(false);

  const currentRow = guesses.length;
  const keyStatus1 = getKeyboardStatus(guesses, evaluations1);
  const keyStatus2 = getKeyboardStatus(guesses, evaluations2);
  const mergedKeyStatus = mergeKeyboardStatuses(keyStatus1, keyStatus2);

  const submitGuess = useCallback(() => {
    if (currentGuess.length !== WORD_LENGTH) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    const newGuesses = [...guesses, currentGuess];
    const eval1 = evaluateGuess(currentGuess, word1);
    const eval2 = evaluateGuess(currentGuess, word2);
    const newEvals1 = [...evaluations1, eval1];
    const newEvals2 = [...evaluations2, eval2];
    const newWon1 = won1 || eval1.every((s) => s === "correct");
    const newWon2 = won2 || eval2.every((s) => s === "correct");

    setGuesses(newGuesses);
    setEvaluations1(newEvals1);
    setEvaluations2(newEvals2);
    setWon1(newWon1);
    setWon2(newWon2);
    setCurrentGuess("");

    if ((newWon1 && newWon2) || newGuesses.length >= MAX_GUESSES) {
      setGameOver(true);
      setTimeout(() => onGameEnd(newWon1 && newWon2, newGuesses, newEvals1, newEvals2), 800);
    }
  }, [currentGuess, guesses, evaluations1, evaluations2, won1, won2, word1, word2, onGameEnd]);

  const handleKey = useCallback((key) => {
    if (gameOver) return;
    if (key === "⌫") {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (key === "ENTER") {
      submitGuess();
    } else if (currentGuess.length < WORD_LENGTH) {
      setCurrentGuess((prev) => prev + key);
    }
  }, [gameOver, currentGuess, submitGuess]);

  // Pip indicators for guesses used
  const pips = Array.from({ length: MAX_GUESSES }, (_, i) => i < currentRow);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <View style={styles.headerLeft}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>#{puzzleNumber}</Text>
            </View>
          </View>
          <View style={styles.headerCenter}>
            <Text style={styles.titleSub}>DAILY</Text>
            <Text style={styles.title}>DORDLE</Text>
          </View>
          <View style={styles.headerRight} />
        </View>
      </View>

      {/* Guess pips */}
      <View style={styles.pips}>
        {pips.map((used, i) => (
          <View
            key={i}
            style={[styles.pip, used ? styles.pipUsed : styles.pipEmpty]}
          />
        ))}
      </View>

      {/* Boards */}
      <View style={styles.boards}>
        <Board
          guesses={guesses}
          evaluations={evaluations1}
          currentGuess={shake ? "" : currentGuess}
          currentRow={currentRow}
          won={won1}
          label="Word 1"
        />
        <View style={styles.divider} />
        <Board
          guesses={guesses}
          evaluations={evaluations2}
          currentGuess={shake ? "" : currentGuess}
          currentRow={currentRow}
          won={won2}
          label="Word 2"
        />
      </View>

      {/* Too short hint */}
      {shake && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>Not enough letters</Text>
        </View>
      )}

      {/* Keyboard */}
      <Keyboard onKey={handleKey} keyStatus={mergedKeyStatus} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121213",
    alignItems: "center",
  },
  header: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#3a3a3c",
  },
  headerInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: 700,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerLeft: {
    flex: 1,
    alignItems: "flex-start",
  },
  headerCenter: {
    alignItems: "center",
  },
  headerRight: {
    flex: 1,
  },
  badge: {
    backgroundColor: "#3a3a3c",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    color: "#818384",
    fontSize: 12,
    fontWeight: "700",
  },
  titleSub: {
    color: "#818384",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 4,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 6,
  },
  pips: {
    flexDirection: "row",
    gap: 5,
    paddingVertical: 8,
  },
  pip: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pipUsed: {
    backgroundColor: "#538d4e",
  },
  pipEmpty: {
    backgroundColor: "#3a3a3c",
  },
  boards: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
    maxWidth: 700,
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  divider: {
    width: 1,
    alignSelf: "stretch",
    backgroundColor: "#3a3a3c",
    marginHorizontal: 4,
  },
  toast: {
    position: "absolute",
    top: 90,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 99,
  },
  toastText: {
    color: "#121213",
    fontWeight: "700",
    fontSize: 13,
  },
});
