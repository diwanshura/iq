import { Router } from 'express';
import isAuthenticated from '../middleware/auth.middleware.js';
import {
  getResult,
  getUserResults,
  getResultStats
} from '../controllers/resultsController.js';

const router = Router();

router.get('/', isAuthenticated, getUserResults);
router.get('/stats', isAuthenticated, getResultStats);
router.get('/:resultId', isAuthenticated, getResult);

export default router;
