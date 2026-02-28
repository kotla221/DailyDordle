import React, { useState, useCallback, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Platform, Animated, TouchableOpacity } from "react-native";
import Board from "../components/Board";
import Keyboard from "../components/Keyboard";
import Confetti from "../components/Confetti";
import HowToPlayModal from "../components/HowToPlayModal";
import {
  evaluateGuess, getKeyboardStatus, mergeKeyboardStatuses,
  MAX_GUESSES, WORD_LENGTH,
} from "../utils/gameLogic";
import { saveGameState, hasSeenTutorial, markTutorialSeen } from "../utils/storage";

export default function GameScreen({
  word1, word2, puzzleNumber, onGameEnd, theme,
  initialGuesses, initialEvals1, initialEvals2,
  initialWon1, initialWon2,
}) {
  const [guesses, setGuesses]         = useState(initialGuesses ?? []);
  const [evaluations1, setEvals1]     = useState(initialEvals1  ?? []);
  const [evaluations2, setEvals2]     = useState(initialEvals2  ?? []);
  const [currentGuess, setCurrentGuess] = useState("");
  const [won1, setWon1]               = useState(initialWon1 ?? false);
  const [won2, setWon2]               = useState(initialWon2 ?? false);
  const [gameOver, setGameOver]       = useState(false);
  const [lastSubmittedRow, setLastSubmittedRow] = useState(-1);
  const [confetti, setConfetti]       = useState(false);
  const [showModal, setShowModal]     = useState(false);
  const [toast, setToast]             = useState("");
  const toastOpacity                  = useRef(new Animated.Value(0)).current;

  const currentRow = guesses.length;
  const keyStatus1 = getKeyboardStatus(guesses, evaluations1);
  const keyStatus2 = getKeyboardStatus(guesses, evaluations2);
  const mergedKeyStatus = mergeKeyboardStatuses(keyStatus1, keyStatus2);

  // Show tutorial on first ever visit
  useEffect(() => {
    hasSeenTutorial().then((seen) => {
      if (!seen) setShowModal(true);
    });
  }, []);

  const showToast = useCallback((msg) => {
    setToast(msg);
    toastOpacity.setValue(1);
    setTimeout(() => {
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setToast(""));
    }, 1400);
  }, []);

  const submitGuess = useCallback(() => {
    if (currentGuess.length !== WORD_LENGTH) {
      showToast("Not enough letters");
      return;
    }

    const newGuesses = [...guesses, currentGuess];
    const eval1 = evaluateGuess(currentGuess, word1);
    const eval2 = evaluateGuess(currentGuess, word2);
    const newEvals1 = [...evaluations1, eval1];
    const newEvals2 = [...evaluations2, eval2];
    const newWon1 = won1 || eval1.every((s) => s === "correct");
    const newWon2 = won2 || eval2.every((s) => s === "correct");
    const bothWon = newWon1 && newWon2;
    const outOfGuesses = newGuesses.length >= MAX_GUESSES;

    setLastSubmittedRow(guesses.length);
    setGuesses(newGuesses);
    setEvals1(newEvals1);
    setEvals2(newEvals2);
    setWon1(newWon1);
    setWon2(newWon2);
    setCurrentGuess("");

    // Persist progress
    saveGameState({
      guesses: newGuesses,
      evals1: newEvals1,
      evals2: newEvals2,
      won1: newWon1,
      won2: newWon2,
      gameOver: bothWon || outOfGuesses,
    });

    if (bothWon || outOfGuesses) {
      setGameOver(true);
      if (bothWon) {
        // Delay confetti so last tiles finish flipping first
        setTimeout(() => setConfetti(true), WORD_LENGTH * 160 + 200);
      }
      const delay = WORD_LENGTH * 160 + (bothWon ? 1400 : 600);
      setTimeout(() => onGameEnd(bothWon, newGuesses, newEvals1, newEvals2), delay);
    }
  }, [currentGuess, guesses, evaluations1, evaluations2, won1, won2, word1, word2, onGameEnd, showToast]);

  const handleKey = useCallback((key) => {
    if (gameOver) return;
    if (key === "⌫") {
      setCurrentGuess((p) => p.slice(0, -1));
    } else if (key === "ENTER") {
      submitGuess();
    } else if (currentGuess.length < WORD_LENGTH) {
      setCurrentGuess((p) => p + key);
    }
  }, [gameOver, currentGuess, submitGuess]);

  // Physical keyboard support (web)
  useEffect(() => {
    if (Platform.OS !== "web") return;
    const onKeyDown = (e) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (e.key === "Enter") handleKey("ENTER");
      else if (e.key === "Backspace") handleKey("⌫");
      else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toUpperCase());
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleKey]);

  const pips = Array.from({ length: MAX_GUESSES }, (_, i) => i < currentRow);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Confetti active={confetti} />

      <HowToPlayModal
        visible={showModal}
        theme={theme}
        onClose={() => {
          markTutorialSeen();
          setShowModal(false);
        }}
      />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.headerBorder }]}>
        <View style={styles.headerInner}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => setShowModal(true)}
              style={[styles.iconBtn, { backgroundColor: theme.surface }]}
            >
              <Text style={[styles.iconBtnText, { color: theme.textMuted }]}>?</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.headerCenter}>
            <Text style={[styles.titleSub, { color: theme.textMuted }]}>DAILY</Text>
            <Text style={[styles.title, { color: theme.text }]}>DORDLE</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={[styles.badge, { backgroundColor: theme.surface }]}>
              <Text style={[styles.badgeText, { color: theme.textMuted }]}>#{puzzleNumber}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Guess pips */}
      <View style={styles.pips}>
        {pips.map((used, i) => (
          <View key={i} style={[
            styles.pip,
            { backgroundColor: used ? theme.correct : theme.pip },
          ]} />
        ))}
      </View>

      {/* Boards */}
      <View style={styles.boards}>
        <Board
          guesses={guesses} evaluations={evaluations1}
          currentGuess={currentGuess} currentRow={currentRow}
          won={won1} label="Word 1"
          lastSubmittedRow={lastSubmittedRow}
          theme={theme}
        />
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <Board
          guesses={guesses} evaluations={evaluations2}
          currentGuess={currentGuess} currentRow={currentRow}
          won={won2} label="Word 2"
          lastSubmittedRow={lastSubmittedRow}
          theme={theme}
        />
      </View>

      {/* Toast */}
      {toast !== "" && (
        <Animated.View style={[styles.toast, { opacity: toastOpacity, backgroundColor: theme.text }]}>
          <Text style={[styles.toastText, { color: theme.bg }]}>{toast}</Text>
        </Animated.View>
      )}

      {/* Keyboard */}
      <Keyboard onKey={handleKey} keyStatus={mergedKeyStatus} theme={theme} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  header: { width: "100%", borderBottomWidth: 1 },
  headerInner: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    maxWidth: 700, width: "100%", alignSelf: "center",
    paddingHorizontal: 16, paddingVertical: 10,
  },
  headerLeft:   { flex: 1, alignItems: "flex-start" },
  headerCenter: { alignItems: "center" },
  headerRight:  { flex: 1, alignItems: "flex-end" },
  iconBtn: {
    width: 34, height: 34, borderRadius: 17,
    alignItems: "center", justifyContent: "center",
  },
  iconBtnText: { fontSize: 16, fontWeight: "700" },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: "700" },
  titleSub: { fontSize: 9, fontWeight: "700", letterSpacing: 4 },
  title:    { fontSize: 26, fontWeight: "800", letterSpacing: 6 },
  pips: { flexDirection: "row", gap: 5, paddingVertical: 8 },
  pip:  { width: 8, height: 8, borderRadius: 4 },
  boards: {
    flex: 1, flexDirection: "row", justifyContent: "center",
    alignItems: "flex-start", width: "100%", maxWidth: 700,
    paddingHorizontal: 16, paddingTop: 4,
  },
  divider: { width: 1, alignSelf: "stretch", marginHorizontal: 4 },
  toast: {
    position: "absolute", top: 90,
    paddingHorizontal: 18, paddingVertical: 10,
    borderRadius: 10, zIndex: 99, elevation: 10,
  },
  toastText: { fontWeight: "700", fontSize: 13 },
});
