import { ADAPTIVE_THRESHOLD, DIFFICULTY_RANGES } from '../config/constants.js';

interface QuestionPerformance {
  questionDifficulty: number;
  isCorrect: boolean;
  timeSpent: number;
  timeLimit: number;
}

export const calculateNextDifficulty = (
  currentPerformance: QuestionPerformance[],
  iq_section: string
): number => {
  if (currentPerformance.length === 0) {
    const range = DIFFICULTY_RANGES[iq_section as keyof typeof DIFFICULTY_RANGES];
    return Math.floor((range.min + range.max) / 2);
  }

  // Calculate recent performance (last 5 questions)
  const recentQuestions = currentPerformance.slice(-5);
  const recentCorrect = recentQuestions.filter(q => q.isCorrect).length;
  const recentAccuracy = recentCorrect / recentQuestions.length;

  const currentDifficulty = Math.max(
    ...recentQuestions.map(q => q.questionDifficulty)
  );

  const range = DIFFICULTY_RANGES[iq_section as keyof typeof DIFFICULTY_RANGES];

  // Adaptive logic
  if (
    recentAccuracy >= ADAPTIVE_THRESHOLD.INCREASE &&
    recentQuestions.every(q => q.timeSpent < q.timeLimit * 0.75)
  ) {
    // Increase difficulty
    return Math.min(range.max, currentDifficulty + 1);
  } else if (recentAccuracy <= ADAPTIVE_THRESHOLD.DECREASE) {
    // Decrease difficulty
    return Math.max(range.min, currentDifficulty - 1);
  }

  // Maintain difficulty
  return currentDifficulty;
};

export const shouldSkipToNextLevel = (
  performance: QuestionPerformance[],
  questionsAnswered: number
): boolean => {
  if (questionsAnswered < 5) return false;

  const recentPerformance = performance.slice(-5);
  const recentAccuracy = recentPerformance.filter(q => q.isCorrect).length / 5;

  return recentAccuracy > 0.90;
};

export const shouldReduceDifficulty = (
  performance: QuestionPerformance[],
  questionsAnswered: number
): boolean => {
  if (questionsAnswered < 3) return false;

  const recentPerformance = performance.slice(-3);
  const recentAccuracy = recentPerformance.filter(q => q.isCorrect).length / 3;

  return recentAccuracy < 0.33;
};

export default {
  calculateNextDifficulty,
  shouldSkipToNextLevel,
  shouldReduceDifficulty
};
