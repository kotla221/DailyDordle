import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet } from "react-native";

export default function Tile({ letter = "", status = "empty", size = 36, revealDelay = 0, theme }) {
  const prevStatus = useRef(status);
  const mounted = useRef(false);

  const scaleX = useRef(new Animated.Value(1)).current;
  const popScale = useRef(new Animated.Value(1)).current;
  const prevLetter = useRef(letter);

  const [colorState, setColorState] = useState(() => {
    // If pre-filled from storage, show color immediately with no animation
    return status === "correct" || status === "present" || status === "absent"
      ? "revealed"
      : "unrevealed";
  });

  // Flip animation when status transitions to revealed
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      prevStatus.current = status;
      return;
    }

    const prev = prevStatus.current;
    const isRevealing =
      (prev === "active" || prev === "empty") &&
      (status === "correct" || status === "present" || status === "absent");

    if (isRevealing) {
      setTimeout(() => {
        Animated.sequence([
          Animated.timing(scaleX, { toValue: 0, duration: 140, useNativeDriver: true }),
          Animated.timing(scaleX, { toValue: 1, duration: 140, useNativeDriver: true }),
        ]).start();
        setTimeout(() => setColorState("revealed"), 140);
      }, revealDelay);
    }

    if (status === "active" || status === "empty") {
      setColorState("unrevealed");
      scaleX.setValue(1);
    }

    prevStatus.current = status;
  }, [status]);

  // Pop animation when a letter is typed
  useEffect(() => {
    if (!mounted.current) return;
    if (letter && letter !== prevLetter.current && (status === "active" || status === "empty")) {
      Animated.sequence([
        Animated.timing(popScale, { toValue: 1.14, duration: 65, useNativeDriver: true }),
        Animated.timing(popScale, { toValue: 1, duration: 65, useNativeDriver: true }),
      ]).start();
    }
    prevLetter.current = letter;
  }, [letter]);

  const revealed = colorState === "revealed";
  const bg = revealed
    ? status === "correct" ? (theme?.correct ?? "#538d4e")
    : status === "present" ? (theme?.present ?? "#b59f3b")
    : (theme?.absent ?? "#3a3a3c")
    : "transparent";

  const borderColor = revealed
    ? "transparent"
    : status === "active"
      ? (theme?.tileBorderActive ?? "#999")
      : (theme?.tileBorderEmpty ?? "#3a3a3c");

  const textColor = revealed ? "#fff" : (theme?.text ?? "#fff");

  return (
    <Animated.View
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          backgroundColor: bg,
          borderColor,
          borderWidth: revealed ? 0 : 2,
          transform: [{ scaleX }, { scale: popScale }],
        },
      ]}
    >
      <Animated.Text
        style={[styles.letter, { fontSize: size * 0.44, color: textColor }]}
      >
        {letter.toUpperCase()}
      </Animated.Text>
    </Animated.View>
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
