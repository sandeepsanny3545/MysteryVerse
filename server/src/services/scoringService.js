/**
 * MysteryVerse Backend Scoring Engine
 *
 * Scoring Rules:
 * - Easy correct accusation: 100 points
 * - Medium correct accusation: 150 points
 * - Hard correct accusation: 200 points
 * - Incorrect accusation: 0 points for the accusation
 * - Each discovered clue: +5 points
 * - Each hint requested: -10 points
 * - Minimum score: 0
 */

export function calculateCaseScore({ difficulty, isCorrect, discoveredCluesCount = 0, hintsUsedCount = 0 }) {
  let basePoints = 0;

  if (isCorrect) {
    switch (difficulty) {
      case 'Easy':
        basePoints = 100;
        break;
      case 'Hard':
        basePoints = 200;
        break;
      case 'Medium':
      default:
        basePoints = 150;
        break;
    }
  }

  const clueBonus = discoveredCluesCount * 5;
  const hintPenalty = hintsUsedCount * 10;

  const totalScore = Math.max(0, basePoints + clueBonus - hintPenalty);

  return {
    basePoints,
    clueBonus,
    hintPenalty,
    totalScore
  };
}
