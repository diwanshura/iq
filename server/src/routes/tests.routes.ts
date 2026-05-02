import { Router } from 'express';
import isAuthenticated from '../middleware/auth.middleware.js';
import {
  createTest,
  getTest,
  submitAnswer,
  submitTest,
  getUserTests
} from '../controllers/testController.js';

const router = Router();

router.post('/', isAuthenticated, createTest);
router.get('/', isAuthenticated, getUserTests);
router.get('/:testId', isAuthenticated, getTest);
router.post('/:testId/answers', isAuthenticated, submitAnswer);
router.post('/:testId/submit', isAuthenticated, submitTest);

export default router;
