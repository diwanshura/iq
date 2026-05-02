export const TIMING_RULES = {
  '50-100': {
    baseTimeLimit: 45,
    minTimeLimit: 30,
    maxTimeLimit: 60
  },
  '100-150': {
    baseTimeLimit: 40,
    minTimeLimit: 25,
    maxTimeLimit: 50
  },
  '150+': {
    baseTimeLimit: 30,
    minTimeLimit: 20,
    maxTimeLimit: 40
  }
};

export const DIFFICULTY_RANGES = {
  '50-100': { min: 1, max: 3 },
  '100-150': { min: 4, max: 7 },
  '150+': { min: 8, max: 10 }
};

export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
export const QUESTIONS_PER_TEST = 30;
export const ADAPTIVE_THRESHOLD = {
  INCREASE: 0.80,
  DECREASE: 0.50,
  TARGET_ACCURACY: 0.65
};

export const COGNITIVE_CATEGORIES = [
  'pattern',
  'logic',
  'spatial',
  'numerical',
  'memory',
  'abstract'
] as const;

export type CognitiveCategory = (typeof COGNITIVE_CATEGORIES)[number];
