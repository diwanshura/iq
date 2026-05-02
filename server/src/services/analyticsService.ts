import { COGNITIVE_CATEGORIES, TIMING_RULES } from '../config/constants.js';

interface Response {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
  type: string;
}

export const calculateAnalytics = (
  responses: Response[],
  iq_section: string,
  totalTime: number
) => {
  // Basic metrics
  const totalQuestions = responses.length;
  const correctAnswers = responses.filter(r => r.isCorrect).length;
  const accuracy = (correctAnswers / totalQuestions) * 100;

  // Time analysis
  const timingRule = TIMING_RULES[iq_section as keyof typeof TIMING_RULES];
  const baseTimePerQuestion = timingRule.baseTimeLimit;
  const averageTimePerQuestion = totalTime / totalQuestions;

  // Speed categorization
  const speedVsAccuracy = {
    fast: responses.filter(r => r.timeSpent < baseTimePerQuestion * 0.6).length,
    medium: responses.filter(
      r => r.timeSpent >= baseTimePerQuestion * 0.6 && r.timeSpent <= baseTimePerQuestion * 1.4
    ).length,
    slow: responses.filter(r => r.timeSpent > baseTimePerQuestion * 1.4).length
  };

  // Category scores
  const categoryScores: Record<string, { correct: number; total: number }> = {};
  COGNITIVE_CATEGORIES.forEach(cat => {
    categoryScores[cat] = { correct: 0, total: 0 };
  });

  responses.forEach(r => {
    if (categoryScores[r.type]) {
      categoryScores[r.type].total++;
      if (r.isCorrect) {
        categoryScores[r.type].correct++;
      }
    }
  });

  const categoricalScores: Record<string, number> = {};
  Object.entries(categoryScores).forEach(([cat, scores]) => {
    categoricalScores[cat] = scores.total > 0 ? (scores.correct / scores.total) * 100 : 0;
  });

  // IQ Estimation
  const estimatedIQ = estimateIQ(accuracy, iq_section, averageTimePerQuestion, baseTimePerQuestion);

  // Cognitive strengths and weaknesses
  const sortedCategories = Object.entries(categoricalScores)
    .sort((a, b) => b[1] - a[1]);

  const cognitiveStrengths = sortedCategories.slice(0, 2).map(([cat]) => cat);
  const weaknesses = sortedCategories.slice(-2).map(([cat]) => cat);

  // Recommendations
  const recommendations = generateRecommendations(
    accuracy,
    cognitiveStrengths,
    weaknesses,
    averageTimePerQuestion
  );

  return {
    accuracy: Math.round(accuracy * 100) / 100,
    estimatedIQ,
    totalTime,
    averageTimePerQuestion: Math.round(averageTimePerQuestion * 100) / 100,
    speedVsAccuracy,
    categoricalScores: Object.fromEntries(
      Object.entries(categoricalScores).map(([k, v]) => [k, Math.round(v * 100) / 100])
    ),
    cognitiveStrengths,
    weaknesses,
    recommendations
  };
};

const estimateIQ = (
  accuracy: number,
  iq_section: string,
  averageTime: number,
  baseTime: number
): number => {
  // Base IQ calculation
  const accuracyNormalized = accuracy / 100;
  
  // Section-based baseline
  const baselines: Record<string, number> = {
    '50-100': 75,
    '100-150': 125,
    '150+': 155
  };

  const baseline = baselines[iq_section] || 100;

  // Accuracy component (weighted 70%)
  const accuracyDelta = (accuracyNormalized - 0.65) * 30; // Target is 65% accuracy
  
  // Speed component (weighted 30%)
  const speedRatio = baseTime / averageTime;
  const speedDelta = (speedRatio - 1) * 10; // Normalize to average

  const iqEstimate = baseline + accuracyDelta + speedDelta;

  // Clamp to reasonable range
  return Math.max(50, Math.min(180, Math.round(iqEstimate)));
};

const generateRecommendations = (
  accuracy: number,
  strengths: string[],
  weaknesses: string[],
  averageTime: number
): string[] => {
  const recommendations: string[] = [];

  if (accuracy < 60) {
    recommendations.push("Practice fundamental logic and reasoning skills");
  } else if (accuracy < 80) {
    recommendations.push("Work on pattern recognition exercises");
  } else {
    recommendations.push("Challenge yourself with advanced problem-solving");
  }

  if (weaknesses.length > 0) {
    recommendations.push(`Focus on improving ${weaknesses[0]} reasoning`);
  }

  if (averageTime > 60) {
    recommendations.push("Practice speed-solving to improve efficiency");
  }

  recommendations.push(`Leverage your strength in ${strengths[0]} reasoning in problem-solving`);

  return recommendations.slice(0, 3);
};

export default {
  calculateAnalytics,
  estimateIQ
};
