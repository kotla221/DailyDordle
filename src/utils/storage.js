import AsyncStorage from "@react-native-async-storage/async-storage";

const todayKey = () => {
  const d = new Date();
  return `game_${d.getFullYear()}_${d.getMonth()}_${d.getDate()}`;
};

const STATS_KEY = "dordle_stats";
const SEEN_TUTORIAL_KEY = "dordle_seen_tutorial";

// ── Game state ──────────────────────────────────────────────
export async function saveGameState(state) {
  try {
    await AsyncStorage.setItem(todayKey(), JSON.stringify(state));
  } catch (_) {}
}

export async function loadGameState() {
  try {
    const raw = await AsyncStorage.getItem(todayKey());
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

// ── Stats ────────────────────────────────────────────────────
const DEFAULT_STATS = {
  totalGames: 0,
  totalWins: 0,
  currentStreak: 0,
  maxStreak: 0,
  distribution: [0, 0, 0, 0, 0, 0, 0], // index 0 = 1 guess … index 6 = 7 guesses
  lastWinDate: null,
  lastRecordedDate: null, // guards against double-counting on refresh
};

export async function loadStats() {
  try {
    const raw = await AsyncStorage.getItem(STATS_KEY);
    return raw ? { ...DEFAULT_STATS, ...JSON.parse(raw) } : { ...DEFAULT_STATS };
  } catch (_) {
    return { ...DEFAULT_STATS };
  }
}

export async function recordResult(won, numGuesses) {
  try {
    const stats = await loadStats();
    const today = new Date().toDateString();

    // Already recorded today — don't double-count on refresh
    if (stats.lastRecordedDate === today) {
      return stats;
    }

    stats.lastRecordedDate = today;
    stats.totalGames += 1;
    if (won) {
      stats.totalWins += 1;
      const dist = [...stats.distribution];
      dist[Math.min(numGuesses - 1, 6)] += 1;
      stats.distribution = dist;

      // Streak: consecutive calendar days
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (stats.lastWinDate === yesterday.toDateString()) {
        stats.currentStreak += 1;
      } else if (stats.lastWinDate !== today) {
        stats.currentStreak = 1;
      }
      stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
      stats.lastWinDate = today;
    } else {
      stats.currentStreak = 0;
    }

    await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
    return stats;
  } catch (_) {
    return DEFAULT_STATS;
  }
}

// ── Tutorial ─────────────────────────────────────────────────
export async function hasSeenTutorial() {
  try {
    return !!(await AsyncStorage.getItem(SEEN_TUTORIAL_KEY));
  } catch (_) {
    return false;
  }
}

export async function markTutorialSeen() {
  try {
    await AsyncStorage.setItem(SEEN_TUTORIAL_KEY, "1");
  } catch (_) {}
}
