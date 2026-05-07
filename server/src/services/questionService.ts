import Question from '../models/Question.js';
import type { IQuestion } from '../models/Question.js';
import { QUESTIONS_PER_TEST, DIFFICULTY_RANGES } from '../config/constants.js';
import { generateAIQuestion } from './questionGenerator.js';

export const selectQuestionsForTest = async (
  iq_section: string,
  totalQuestions: number = QUESTIONS_PER_TEST
) => {
  try {
    const difficultyRange = DIFFICULTY_RANGES[iq_section as keyof typeof DIFFICULTY_RANGES];

    if (!difficultyRange) {
      throw new Error(`Invalid IQ section: ${iq_section}`);
    }

    const datasetCount = Math.ceil(totalQuestions / 2);
    const aiCount = totalQuestions - datasetCount;

    // Get dataset questions
    const datasetQuestions = await Question.aggregate([
      {
        $match: {
          source: 'dataset',
          iq_section,
          difficulty: { $gte: difficultyRange.min, $lte: difficultyRange.max }
        }
      },
      { $sample: { size: Math.min(datasetCount, 100) } }
    ]);

    // Generate AI questions to fill remaining slots
    const aiQuestions = [];
    const baseDifficulty = Math.floor((difficultyRange.min + difficultyRange.max) / 2);

    for (let i = 0; i < aiCount; i++) {
      const difficultyVariation = Math.random() * 2 - 1;
      const difficulty = Math.max(
        difficultyRange.min,
        Math.min(difficultyRange.max, Math.round(baseDifficulty + difficultyVariation * 2))
      );

      const aiQuestion = await generateAIQuestion(iq_section, difficulty);

      const savedQuestion = await Question.create({
        ...aiQuestion,
        type: aiQuestion.type as IQuestion['type'],
        iq_section: iq_section as IQuestion['iq_section'],
        source: 'ai',
        time_limit: 40,
        tags: [aiQuestion.type, iq_section]
      });

      aiQuestions.push(JSON.parse(JSON.stringify(savedQuestion)));
    }

    // Combine and shuffle
    const allQuestions = [...datasetQuestions, ...aiQuestions];

    // Fisher-Yates shuffle
    for (let i = allQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
    }

    return allQuestions.map((q: any) => ({
      _id: q._id,
      question: q.question,
      type: q.type,
      difficulty: q.difficulty,
      iq_section: q.iq_section,
      source: q.source,
      options: q.options,
      time_limit: q.time_limit,
      explanation: q.explanation
    }));
  } catch (error) {
    console.error('Error selecting questions:', error);
    throw error;
  }
};

export const getQuestionById = async (questionId: string) => {
  try {
    const question = await Question.findById(questionId);
    if (!question) {
      throw new Error(`Question not found: ${questionId}`);
    }
    return question;
  } catch (error) {
    console.error('Error fetching question:', error);
    throw error;
  }
};

export const getQuestionsStats = async (iq_section: string) => {
  try {
    const stats = await Question.aggregate([
      {
        $match: { iq_section }
      },
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 }
        }
      }
    ]);

    return stats;
  } catch (error) {
    console.error('Error getting question stats:', error);
    throw error;
  }
};

export default {
  selectQuestionsForTest,
  getQuestionById,
  getQuestionsStats
};

