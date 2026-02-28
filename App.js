import React, { useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import GameScreen from "./src/screens/GameScreen";
import ResultScreen from "./src/screens/ResultScreen";
import { getTodaysPair, getTodaysIndex } from "./src/utils/words";

const [WORD1, WORD2] = getTodaysPair();
const PUZZLE_NUMBER = getTodaysIndex();

export default function App() {
  const [screen, setScreen] = useState("game");
  const [resultData, setResultData] = useState(null);

  const handleGameEnd = (won, guesses, evals1, evals2) => {
    setResultData({ won, guesses, evals1, evals2 });
    setScreen("result");
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#121213" }} edges={["top", "bottom"]}>
        <StatusBar style="light" />
        {screen === "game" ? (
          <GameScreen
            word1={WORD1}
            word2={WORD2}
            puzzleNumber={PUZZLE_NUMBER}
            onGameEnd={handleGameEnd}
          />
        ) : (
          <ResultScreen
            won={resultData.won}
            word1={WORD1}
            word2={WORD2}
            guesses={resultData.guesses}
            evals1={resultData.evals1}
            evals2={resultData.evals2}
            puzzleNumber={PUZZLE_NUMBER}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
