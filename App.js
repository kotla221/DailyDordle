import React, { useState, useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import GameScreen from "./src/screens/GameScreen";
import ResultScreen from "./src/screens/ResultScreen";
import { getTodaysPair, getTodaysIndex } from "./src/utils/words";
import { loadGameState, recordResult, loadStats } from "./src/utils/storage";
import { useTheme } from "./src/utils/theme";

const [WORD1, WORD2]  = getTodaysPair();
const PUZZLE_NUMBER   = getTodaysIndex();

export default function App() {
  const theme = useTheme();
  const [screen, setScreen]       = useState(null); // null = loading
  const [resultData, setResultData] = useState(null);
  const [savedGame, setSavedGame]  = useState(null);
  const [stats, setStats]          = useState(null);

  // On mount: check if today's game is already done
  useEffect(() => {
    (async () => {
      const [game, s] = await Promise.all([loadGameState(), loadStats()]);
      setStats(s);
      if (game?.gameOver) {
        // Already played today — jump straight to result
        const finalStats = await recordResult(game.won1 && game.won2, game.guesses.length);
        setStats(finalStats);
        setResultData({
          won:    game.won1 && game.won2,
          guesses: game.guesses,
          evals1:  game.evals1,
          evals2:  game.evals2,
        });
        setScreen("result");
      } else {
        setSavedGame(game ?? null);
        setScreen("game");
      }
    })();
  }, []);

  const handleGameEnd = async (won, guesses, evals1, evals2) => {
    const finalStats = await recordResult(won, guesses.length);
    setStats(finalStats);
    setResultData({ won, guesses, evals1, evals2 });
    setScreen("result");
  };

  if (screen === null) return null; // brief loading state

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.bg }}
        edges={["top", "bottom"]}
      >
        <StatusBar style={theme.bg === "#ffffff" ? "dark" : "light"} />

        {screen === "game" ? (
          <GameScreen
            word1={WORD1}
            word2={WORD2}
            puzzleNumber={PUZZLE_NUMBER}
            onGameEnd={handleGameEnd}
            theme={theme}
            initialGuesses={savedGame?.guesses}
            initialEvals1={savedGame?.evals1}
            initialEvals2={savedGame?.evals2}
            initialWon1={savedGame?.won1}
            initialWon2={savedGame?.won2}
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
            stats={stats}
            theme={theme}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
