import { Response } from 'express';
import Test from '../models/Test.js';
import TestResult from '../models/TestResult.js';
import Question from '../models/Question.js';
import { selectQuestionsForTest, getQuestionById } from '../services/questionService.js';
import { calculateAnalytics } from '../services/analyticsService.js';
import { calculateNextDifficulty } from '../services/adaptiveEngine.js';
import { QUESTIONS_PER_TEST } from '../config/constants.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { normalizeIqSection } from '../utils/iqSection.js';

export const createTest = async (req: AuthRequest, res: Response) => {
  try {
    const { iq_section: rawSection } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const normalized = normalizeIqSection(rawSection);
    if (!normalized.ok) {
      return res.status(400).json({ error: normalized.error });
    }
    const iq_section = normalized.iq_section;

    // Select questions for the test
    const questions = await selectQuestionsForTest(iq_section, QUESTIONS_PER_TEST);

    // Create test record
    const test = new Test({
      userId,
      iq_section,
      questions: questions.map((q: any) => q._id),
      currentQuestionIndex: 0,
      isActive: true,
      responses: []
    });

    await test.save();

    // Return test with questions (without correct answers)
    res.json({
      testId: test._id,
      iq_section: test.iq_section,
      questions,
      currentQuestionIndex: 0,
      totalQuestions: questions.length
    });
  } catch (error) {
    console.error('createTest:', error);
    const message = error instanceof Error ? error.message : 'Failed to create test';
    res.status(500).json({ error: 'Failed to create test', detail: message });
  }
};

export const getTest = async (req: AuthRequest, res: Response) => {
  try {
    const { testId } = req.params;
    const userId = req.user?._id;

    const test = await Test.findById(testId).populate('questions');

    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    if (test.userId.toString() !== userId?.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Return test without correct answers
    const questions = (test.questions as any[]).map((q) => ({
      _id: q._id,
      question: q.question,
      type: q.type,
      difficulty: q.difficulty,
      options: q.options,
      time_limit: q.time_limit,
      explanation: q.explanation
    }));

    res.json({
      testId: test._id,
      iq_section: test.iq_section,
      questions,
      currentQuestionIndex: test.currentQuestionIndex,
      totalQuestions: questions.length,
      responses: test.responses
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get test' });
  }
};

export const submitAnswer = async (req: AuthRequest, res: Response) => {
  try {
    const { testId } = req.params;
    const { questionId, answer, timeSpent } = req.body;
    const userId = req.user?._id;

    const test = await Test.findById(testId);
    if (!test || test.userId.toString() !== userId?.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const question = await getQuestionById(questionId);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const isCorrect = question.correct_answer === answer;

    // Record response
    test.responses.push({
      questionId,
      selectedAnswer: answer,
      isCorrect,
      timeSpent: Math.min(timeSpent, question.time_limit * 1000 + 5000), // Cap at time limit + buffer
      timestamp: new Date()
    });

    test.currentQuestionIndex++;

    // Calculate next difficulty
    const performanceData = test.responses.map(r => ({
      questionDifficulty: (test.questions.find(q => q.toString() === r.questionId.toString()) as any)?.difficulty || 5,
      isCorrect: r.isCorrect,
      timeSpent: r.timeSpent,
      timeLimit: (test.questions.find(q => q.toString() === r.questionId.toString()) as any)?.time_limit * 1000 || 40000
    }));

    const nextDifficulty = calculateNextDifficulty(performanceData, test.iq_section);

    await test.save();

    res.json({
      isCorrect,
      explanation: question.explanation,
      nextDifficulty,
      questionsRemaining: test.questions.length - test.currentQuestionIndex
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit answer' });
  }
};

export const submitTest = async (req: AuthRequest, res: Response) => {
  try {
    const { testId } = req.params;
    const userId = req.user?._id;

    const test = await Test.findById(testId).populate('questions');
    if (!test || test.userId.toString() !== userId?.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (!test.isActive) {
      return res.status(400).json({ error: 'Test already completed' });
    }

    // Mark test as complete
    test.isActive = false;
    test.completedAt = new Date();
    const startTime = test.startedAt?.getTime() || Date.now();
    test.totalTime = Date.now() - startTime;

    await test.save();

    // Calculate analytics
    const responses = test.responses.map(r => ({
      questionId: r.questionId.toString(),
      selectedAnswer: r.selectedAnswer,
      isCorrect: r.isCorrect,
      timeSpent: r.timeSpent / 1000, // Convert to seconds
      type: (test.questions as any[]).find(
        q => q._id.toString() === r.questionId.toString()
      )?.type || 'unknown'
    }));

    const analytics = calculateAnalytics(responses, test.iq_section, test.totalTime / 1000);

    // Create result record
    const result = new TestResult({
      userId,
      testId: test._id,
      iq_section: test.iq_section,
      ...analytics
    });

    await result.save();

    res.json({
      resultId: result._id,
      testId: test._id,
      ...analytics
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit test' });
  }
};

export const getUserTests = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const tests = await Test.find({ userId }).sort({ createdAt: -1 });
    res.json({ tests });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get tests' });
  }
};

export default {
  createTest,
  getTest,
  submitAnswer,
  submitTest,
  getUserTests
};
