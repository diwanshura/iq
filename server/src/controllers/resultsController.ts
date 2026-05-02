import { Response } from 'express';
import TestResult from '../models/TestResult.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export const getResult = async (req: AuthRequest, res: Response) => {
  try {
    const { resultId } = req.params;
    const userId = req.user?._id;

    const result = await TestResult.findById(resultId);
    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }

    if (result.userId.toString() !== userId?.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get result' });
  }
};

export const getUserResults = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const results = await TestResult.find({ userId }).sort({ completedAt: -1 });
    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get results' });
  }
};

export const getResultStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    
    const results = await TestResult.find({ userId });
    
    if (results.length === 0) {
      return res.json({
        averageIQ: 0,
        totalTests: 0,
        averageAccuracy: 0,
        bestScore: 0
      });
    }

    const stats = {
      averageIQ: Math.round(
        results.reduce((sum, r) => sum + r.estimatedIQ, 0) / results.length
      ),
      totalTests: results.length,
      averageAccuracy: Math.round(
        results.reduce((sum, r) => sum + r.accuracy, 0) / results.length * 100
      ) / 100,
      bestScore: Math.max(...results.map(r => r.estimatedIQ))
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get stats' });
  }
};

export default {
  getResult,
  getUserResults,
  getResultStats
};
