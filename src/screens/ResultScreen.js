import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from "react-native";

const STATUS_EMOJI = {
  correct: "🟩",
  present: "🟨",
  absent:  "⬛",
};

function buildShareText(puzzleNumber, won, guesses, evals1, evals2) {
  const header = `Daily Dordle #${puzzleNumber} ${won ? guesses.length + "/7" : "X/7"}`;
  const rows = guesses.map((_, i) => {
    const row1 = (evals1[i] || []).map((s) => STATUS_EMOJI[s] ?? "⬛").join("");
    const row2 = (evals2[i] || []).map((s) => STATUS_EMOJI[s] ?? "⬛").join("");
    return `${row1} ${row2}`;
  });
  return [header, ...rows].join("\n");
}

export default function ResultScreen({ won, word1, word2, guesses, evals1, evals2, puzzleNumber }) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const text = buildShareText(puzzleNumber, won, guesses, evals1, evals2);
    if (Platform.OS === "web" && navigator?.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
    >
      {/* Result banner */}
      <View style={[styles.banner, won ? styles.bannerWin : styles.bannerLoss]}>
        <Text style={styles.bannerEmoji}>{won ? "🎉" : "💀"}</Text>
        <Text style={styles.bannerTitle}>{won ? "Brilliant!" : "Game Over"}</Text>
        <Text style={styles.bannerSub}>
          {won
            ? `Solved in ${guesses.length} of 7 guesses`
            : "Better luck tomorrow"}
        </Text>
      </View>

      {/* The answers */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Today's Words</Text>
        <View style={styles.wordsRow}>
          <View style={styles.wordCard}>
            <Text style={styles.wordLabel}>WORD 1</Text>
            <Text style={styles.wordText}>{word1}</Text>
          </View>
          <View style={styles.wordDivider} />
          <View style={styles.wordCard}>
            <Text style={styles.wordLabel}>WORD 2</Text>
            <Text style={styles.wordText}>{word2}</Text>
          </View>
        </View>
      </View>

      {/* Emoji grid preview */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Your Path</Text>
        <View style={styles.grid}>
          {guesses.map((_, i) => (
            <View key={i} style={styles.gridRow}>
              <Text style={styles.gridEmoji}>
                {(evals1[i] || []).map((s) => STATUS_EMOJI[s] ?? "⬛").join("")}
              </Text>
              <View style={styles.gridDivider} />
              <Text style={styles.gridEmoji}>
                {(evals2[i] || []).map((s) => STATUS_EMOJI[s] ?? "⬛").join("")}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Share button (web only) */}
      {Platform.OS === "web" && (
        <TouchableOpacity
          style={[styles.shareBtn, copied && styles.shareBtnCopied]}
          onPress={handleShare}
          activeOpacity={0.85}
        >
          <Text style={styles.shareBtnText}>
            {copied ? "✓ Copied to clipboard!" : "Share Results"}
          </Text>
        </TouchableOpacity>
      )}

      <Text style={styles.footer}>New puzzle every day at midnight</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#121213",
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
    maxWidth: 500,
    alignSelf: "center",
    width: "100%",
  },
  banner: {
    width: "100%",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    marginBottom: 20,
  },
  bannerWin: {
    backgroundColor: "#1a2e1a",
    borderWidth: 1,
    borderColor: "#538d4e",
  },
  bannerLoss: {
    backgroundColor: "#2a1a1a",
    borderWidth: 1,
    borderColor: "#3a3a3c",
  },
  bannerEmoji: {
    fontSize: 44,
    marginBottom: 8,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  bannerSub: {
    fontSize: 15,
    color: "#818384",
  },
  section: {
    width: "100%",
    backgroundColor: "#1a1a1b",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#818384",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 16,
    textAlign: "center",
  },
  wordsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  wordCard: {
    flex: 1,
    alignItems: "center",
  },
  wordDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#3a3a3c",
    marginHorizontal: 16,
  },
  wordLabel: {
    fontSize: 10,
    color: "#818384",
    letterSpacing: 1,
    marginBottom: 6,
    fontWeight: "700",
  },
  wordText: {
    fontSize: 26,
    fontWeight: "800",
    color: "#538d4e",
    letterSpacing: 3,
  },
  grid: {
    alignItems: "center",
    gap: 4,
  },
  gridRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  gridEmoji: {
    fontSize: 20,
    letterSpacing: 2,
  },
  gridDivider: {
    width: 1,
    height: 20,
    backgroundColor: "#3a3a3c",
  },
  shareBtn: {
    backgroundColor: "#538d4e",
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  shareBtnCopied: {
    backgroundColor: "#3a3a3c",
  },
  shareBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.5,
  },
  footer: {
    fontSize: 12,
    color: "#3a3a3c",
    textAlign: "center",
  },
});
