import Question from '../models/Question.js';
import { DIFFICULTY_RANGES } from '../config/constants.js';

// Sample dataset questions
const DATASET_QUESTIONS = [
  // IQ 50-100 Questions
  {
    question: "What is the capital of France?",
    type: "memory",
    difficulty: 1,
    iq_section: "50-100",
    options: ["London", "Paris", "Berlin", "Madrid"],
    correct_answer: "Paris",
    explanation: "Paris is the capital and largest city of France."
  },
  {
    question: "Which is larger: 3/4 or 2/3?",
    type: "numerical",
    difficulty: 2,
    iq_section: "50-100",
    options: ["3/4", "2/3", "They are equal", "Cannot determine"],
    correct_answer: "3/4",
    explanation: "3/4 = 0.75, 2/3 ≈ 0.667, so 3/4 is larger."
  },
  {
    question: "In the sequence 2, 4, 6, 8, what comes next?",
    type: "pattern",
    difficulty: 1,
    iq_section: "50-100",
    options: ["9", "10", "11", "12"],
    correct_answer: "10",
    explanation: "Each number increases by 2, so after 8 comes 10."
  },

  // IQ 100-150 Questions
  {
    question: "If all roses are flowers and all flowers are plants, then all roses are plants. Is this reasoning valid?",
    type: "logic",
    difficulty: 5,
    iq_section: "100-150",
    options: ["Yes, valid", "No, invalid", "Cannot determine", "Partially valid"],
    correct_answer: "Yes, valid",
    explanation: "This is a classic syllogism demonstrating valid deductive reasoning."
  },
  {
    question: "What is the next number in the Fibonacci sequence: 1, 1, 2, 3, 5, 8, 13, ?",
    type: "pattern",
    difficulty: 5,
    iq_section: "100-150",
    options: ["18", "19", "20", "21"],
    correct_answer: "21",
    explanation: "In Fibonacci, each number is the sum of the two preceding: 13 + 8 = 21."
  },
  {
    question: "A train travels 120 km in 2 hours. At this rate, how far will it travel in 5 hours?",
    type: "numerical",
    difficulty: 4,
    iq_section: "100-150",
    options: ["240 km", "300 km", "360 km", "420 km"],
    correct_answer: "300 km",
    explanation: "Speed = 120/2 = 60 km/h. Distance in 5 hours = 60 × 5 = 300 km."
  },

  // IQ 150+ Questions
  {
    question: "Consider a set of all integers. Which statement is true?",
    type: "abstract",
    difficulty: 8,
    iq_section: "150+",
    options: [
      "The set has a maximum element",
      "The set is finite",
      "The set is unbounded",
      "The set contains only positive numbers"
    ],
    correct_answer: "The set is unbounded",
    explanation: "Integers extend infinitely in both positive and negative directions, making the set unbounded."
  },
  {
    question: "If f(x) = 2x² - 3x + 1, what is f(2)?",
    type: "numerical",
    difficulty: 7,
    iq_section: "150+",
    options: ["3", "4", "5", "6"],
    correct_answer: "3",
    explanation: "f(2) = 2(4) - 3(2) + 1 = 8 - 6 + 1 = 3."
  },
  {
    question: "A clock's hour hand and minute hand coincide 11 times in 12 hours. Is this true?",
    type: "logic",
    difficulty: 9,
    iq_section: "150+",
    options: ["True", "False", "Depends on clock type", "Cannot determine"],
    correct_answer: "True",
    explanation: "The hands coincide at 12:00, ~1:05, ~2:11, and so on, totaling 11 times in 12 hours."
  }
];

export const loadDatasetQuestions = async () => {
  try {
    // Check if questions already exist
    const existingCount = await Question.countDocuments({ source: 'dataset' });
    if (existingCount > 0) {
      console.log(`Dataset already loaded: ${existingCount} questions found.`);
      return;
    }

    // Insert dataset questions
    const questionsToInsert = DATASET_QUESTIONS.map(q => ({
      ...q,
      source: 'dataset',
      time_limit: 40,
      tags: [q.type, q.iq_section]
    }));

    await Question.insertMany(questionsToInsert);
    console.log(`Successfully loaded ${questionsToInsert.length} dataset questions.`);
  } catch (error) {
    console.error('Error loading dataset questions:', error);
  }
};

export const getDatasetQuestionCount = async (iq_section: string) => {
  return await Question.countDocuments({ source: 'dataset', iq_section } as any);
};

export default { loadDatasetQuestions, getDatasetQuestionCount };
