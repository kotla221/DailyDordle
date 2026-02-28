export const MAX_GUESSES = 7;
export const WORD_LENGTH = 5;

/**
 * Evaluate a guess against a target word.
 * Returns an array of status strings: 'correct' | 'present' | 'absent'
 */
export function evaluateGuess(guess, target) {
  const result = Array(WORD_LENGTH).fill("absent");
  const targetArr = target.split("");
  const guessArr = guess.split("");

  // First pass: mark correct letters
  const targetUsed = Array(WORD_LENGTH).fill(false);
  const guessUsed = Array(WORD_LENGTH).fill(false);

  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessArr[i] === targetArr[i]) {
      result[i] = "correct";
      targetUsed[i] = true;
      guessUsed[i] = true;
    }
  }

  // Second pass: mark present letters
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessUsed[i]) continue;
    for (let j = 0; j < WORD_LENGTH; j++) {
      if (!targetUsed[j] && guessArr[i] === targetArr[j]) {
        result[i] = "present";
        targetUsed[j] = true;
        break;
      }
    }
  }

  return result;
}

/**
 * Get the best keyboard status for each letter across all evaluated guesses.
 * Priority: correct > present > absent > undefined
 */
export function getKeyboardStatus(guesses, evaluations) {
  const STATUS_PRIORITY = { correct: 3, present: 2, absent: 1 };
  const status = {};

  guesses.forEach((guess, gi) => {
    const evals = evaluations[gi];
    if (!evals) return;
    guess.split("").forEach((letter, li) => {
      const newStatus = evals[li];
      const current = status[letter];
      if (!current || STATUS_PRIORITY[newStatus] > STATUS_PRIORITY[current]) {
        status[letter] = newStatus;
      }
    });
  });

  return status;
}

/**
 * Merge keyboard statuses from two boards, taking the best status per key.
 */
export function mergeKeyboardStatuses(status1, status2) {
  const STATUS_PRIORITY = { correct: 3, present: 2, absent: 1 };
  const merged = { ...status1 };

  Object.entries(status2).forEach(([letter, newStatus]) => {
    const current = merged[letter];
    if (!current || STATUS_PRIORITY[newStatus] > STATUS_PRIORITY[current]) {
      merged[letter] = newStatus;
    }
  });

  return merged;
}
