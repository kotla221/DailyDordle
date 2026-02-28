import React from "react";
import {
  Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from "react-native";
import Tile from "./Tile";

const EXAMPLE_ROW = [
  { letter: "C", status: "correct" },
  { letter: "R", status: "empty" },
  { letter: "A", status: "empty" },
  { letter: "N", status: "empty" },
  { letter: "E", status: "empty" },
];
const EXAMPLE_ROW2 = [
  { letter: "P", status: "empty" },
  { letter: "I", status: "present" },
  { letter: "L", status: "empty" },
  { letter: "O", status: "empty" },
  { letter: "T", status: "empty" },
];
const EXAMPLE_ROW3 = [
  { letter: "V", status: "empty" },
  { letter: "A", status: "empty" },
  { letter: "L", status: "absent" },
  { letter: "U", status: "empty" },
  { letter: "E", status: "empty" },
];

export default function HowToPlayModal({ visible, onClose, theme }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: theme.modalBg, borderColor: theme.border }]}>
          <Text style={[styles.title, { color: theme.text }]}>How To Play</Text>
          <Text style={[styles.sub, { color: theme.textMuted }]}>
            Guess both 5-letter words in 7 tries.
          </Text>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <Text style={[styles.rule, { color: theme.text }]}>
            • Each guess applies to <Text style={styles.bold}>both</Text> boards simultaneously.
          </Text>
          <Text style={[styles.rule, { color: theme.text }]}>
            • You win only when <Text style={styles.bold}>both</Text> words are solved.
          </Text>
          <Text style={[styles.rule, { color: theme.text }]}>
            • A new puzzle drops every day at midnight.
          </Text>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          {/* Examples */}
          <Text style={[styles.exLabel, { color: theme.textMuted }]}>EXAMPLES</Text>

          <View style={styles.exRow}>
            {EXAMPLE_ROW.map((t, i) => (
              <Tile key={i} letter={t.letter} status={t.status} size={36} theme={theme} />
            ))}
          </View>
          <Text style={[styles.exText, { color: theme.text }]}>
            <Text style={[styles.bold, { color: theme.correct }]}>C</Text> is in the correct spot.
          </Text>

          <View style={styles.exRow}>
            {EXAMPLE_ROW2.map((t, i) => (
              <Tile key={i} letter={t.letter} status={t.status} size={36} theme={theme} />
            ))}
          </View>
          <Text style={[styles.exText, { color: theme.text }]}>
            <Text style={[styles.bold, { color: theme.present }]}>I</Text> is in the word but wrong spot.
          </Text>

          <View style={styles.exRow}>
            {EXAMPLE_ROW3.map((t, i) => (
              <Tile key={i} letter={t.letter} status={t.status} size={36} theme={theme} />
            ))}
          </View>
          <Text style={[styles.exText, { color: theme.text }]}>
            <Text style={[styles.bold, { color: theme.absent }]}>L</Text> is not in the word.
          </Text>

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: theme.correct }]}
            onPress={onClose}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>Got it!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modal: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 6,
  },
  sub: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  rule: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  bold: {
    fontWeight: "800",
  },
  exLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  exRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  exText: {
    fontSize: 13,
    marginBottom: 14,
  },
  btn: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 1,
  },
});
