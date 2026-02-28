import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Share } from "react-native";

const EMOJI = { correct: "🟩", present: "🟨", absent: "⬛" };

function buildShareText(puzzleNumber, won, guesses, evals1, evals2) {
  const header = `Daily Dordle #${puzzleNumber} ${won ? `${guesses.length}/7` : "X/7"}`;
  const rows = guesses.map((_, i) => {
    const r1 = (evals1[i] || []).map((s) => EMOJI[s] ?? "⬛").join("");
    const r2 = (evals2[i] || []).map((s) => EMOJI[s] ?? "⬛").join("");
    return `${r1} ${r2}`;
  });
  return [header, "", ...rows].join("\n");
}

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight - now;
      const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
      setTimeLeft(`${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return timeLeft;
}

export default function ResultScreen({
  won, word1, word2, guesses, evals1, evals2, puzzleNumber, stats, theme,
}) {
  const [copied, setCopied] = useState(false);
  const timeLeft = useCountdown();

  const handleShare = async () => {
    const text = buildShareText(puzzleNumber, won, guesses, evals1 ?? [], evals2 ?? []);
    if (Platform.OS === "web") {
      // Use native share sheet if available (mobile browsers — shows WhatsApp, X, Instagram, etc.)
      if (typeof navigator !== "undefined" && navigator.share) {
        try {
          await navigator.share({ text });
          return;
        } catch (_) {
          // User cancelled or share failed — fall through to clipboard
        }
      }
      // Desktop fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (_) {}
    } else {
      try { await Share.share({ message: text }); } catch (_) {}
    }
  };

  const winPct = stats?.totalGames > 0
    ? Math.round((stats.totalWins / stats.totalGames) * 100)
    : 0;

  const maxDist = Math.max(...(stats?.distribution ?? [1]), 1);

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.container}
    >
      {/* Banner */}
      <View style={[
        styles.banner,
        { backgroundColor: won ? theme.surface : theme.surface,
          borderColor: won ? theme.correct : theme.border },
      ]}>
        <Text style={styles.bannerEmoji}>{won ? "🎉" : "💀"}</Text>
        <Text style={[styles.bannerTitle, { color: theme.text }]}>
          {won ? "Brilliant!" : "Game Over"}
        </Text>
        <Text style={[styles.bannerSub, { color: theme.textMuted }]}>
          {won ? `Solved in ${guesses.length} of 7 guesses` : "Better luck tomorrow"}
        </Text>
      </View>

      {/* Today's words */}
      <View style={[styles.section, { backgroundColor: theme.surface }]}>
        <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>Today's Words</Text>
        <View style={styles.wordsRow}>
          <View style={styles.wordCard}>
            <Text style={[styles.wordLabel, { color: theme.textMuted }]}>WORD 1</Text>
            <Text style={[styles.wordText, { color: theme.correct }]}>{word1}</Text>
          </View>
          <View style={[styles.wordDivider, { backgroundColor: theme.border }]} />
          <View style={styles.wordCard}>
            <Text style={[styles.wordLabel, { color: theme.textMuted }]}>WORD 2</Text>
            <Text style={[styles.wordText, { color: theme.correct }]}>{word2}</Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      {stats && (
        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>Statistics</Text>
          <View style={styles.statsRow}>
            {[
              { label: "Played",   value: stats.totalGames },
              { label: "Win %",    value: `${winPct}%` },
              { label: "Streak",   value: stats.currentStreak },
              { label: "Max",      value: stats.maxStreak },
            ].map(({ label, value }) => (
              <View key={label} style={styles.statBox}>
                <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
                <Text style={[styles.statLabel, { color: theme.textMuted }]}>{label}</Text>
              </View>
            ))}
          </View>

          {/* Distribution */}
          <Text style={[styles.distLabel, { color: theme.textMuted }]}>Guess Distribution</Text>
          {(stats.distribution ?? []).map((count, i) => (
            <View key={i} style={styles.distRow}>
              <Text style={[styles.distNum, { color: theme.textMuted }]}>{i + 1}</Text>
              <View style={styles.distBarTrack}>
                <View style={[
                  styles.distBar,
                  {
                    width: `${Math.max((count / maxDist) * 100, count > 0 ? 8 : 4)}%`,
                    backgroundColor: i === (guesses.length - 1) && won ? theme.correct : theme.absent,
                  },
                ]}>
                  {count > 0 && (
                    <Text style={styles.distCount}>{count}</Text>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Emoji grid */}
      <View style={[styles.section, { backgroundColor: theme.surface }]}>
        <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>Your Path</Text>
        <View style={styles.grid}>
          {guesses.map((_, i) => (
            <View key={i} style={styles.gridRow}>
              <Text style={styles.gridEmoji}>
                {(evals1?.[i] || []).map((s) => EMOJI[s] ?? "⬛").join("")}
              </Text>
              <View style={[styles.gridDivider, { backgroundColor: theme.border }]} />
              <Text style={styles.gridEmoji}>
                {(evals2?.[i] || []).map((s) => EMOJI[s] ?? "⬛").join("")}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Share */}
      <TouchableOpacity
        style={[styles.shareBtn, { backgroundColor: copied ? theme.absent : theme.correct }]}
        onPress={handleShare}
        activeOpacity={0.85}
      >
        <Text style={styles.shareBtnText}>
          {copied ? "✓ Copied!" : "Share Results"}
        </Text>
      </TouchableOpacity>

      {/* Countdown */}
      <View style={[styles.countdown, { backgroundColor: theme.surface }]}>
        <Text style={[styles.countdownLabel, { color: theme.textMuted }]}>
          Next puzzle in
        </Text>
        <Text style={[styles.countdownTime, { color: theme.text }]}>{timeLeft}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: {
    flexGrow: 1, alignItems: "center",
    paddingHorizontal: 20, paddingVertical: 28,
    maxWidth: 480, alignSelf: "center", width: "100%",
  },
  banner: {
    width: "100%", borderRadius: 20, padding: 26,
    alignItems: "center", marginBottom: 16,
    borderWidth: 1,
  },
  bannerEmoji:  { fontSize: 44, marginBottom: 8 },
  bannerTitle:  { fontSize: 28, fontWeight: "800", marginBottom: 4 },
  bannerSub:    { fontSize: 14 },
  section: {
    width: "100%", borderRadius: 16,
    padding: 18, marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 10, fontWeight: "700", letterSpacing: 2,
    textTransform: "uppercase", textAlign: "center", marginBottom: 14,
  },
  wordsRow: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  wordCard: { flex: 1, alignItems: "center" },
  wordDivider: { width: 1, height: 44, marginHorizontal: 16 },
  wordLabel:   { fontSize: 10, letterSpacing: 1, marginBottom: 6, fontWeight: "700" },
  wordText:    { fontSize: 26, fontWeight: "800", letterSpacing: 3 },
  statsRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 18 },
  statBox:  { alignItems: "center" },
  statValue: { fontSize: 28, fontWeight: "800" },
  statLabel: { fontSize: 11, marginTop: 2 },
  distLabel: { fontSize: 10, fontWeight: "700", letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" },
  distRow:   { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  distNum:   { width: 16, fontSize: 12, fontWeight: "700", textAlign: "center" },
  distBarTrack: { flex: 1, marginLeft: 6 },
  distBar: { minWidth: 4, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4, justifyContent: "center" },
  distCount: { color: "#fff", fontSize: 11, fontWeight: "700", textAlign: "right" },
  grid:       { alignItems: "center", gap: 4 },
  gridRow:    { flexDirection: "row", alignItems: "center", gap: 8 },
  gridEmoji:  { fontSize: 20, letterSpacing: 2 },
  gridDivider:{ width: 1, height: 20 },
  shareBtn: {
    width: "100%", paddingVertical: 15, borderRadius: 14,
    alignItems: "center", marginBottom: 16,
  },
  shareBtnText: { color: "#fff", fontWeight: "800", fontSize: 15, letterSpacing: 0.5 },
  countdown: {
    width: "100%", borderRadius: 14, padding: 16,
    alignItems: "center", marginBottom: 8,
  },
  countdownLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 1, marginBottom: 6 },
  countdownTime:  { fontSize: 36, fontWeight: "800", letterSpacing: 4 },
});
