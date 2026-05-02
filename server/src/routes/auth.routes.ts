import { Router } from 'express';
import passport from 'passport';
import { signup, login, logout, getCurrentUser } from '../controllers/authController.js';
import isAuthenticated, { AuthRequest } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/signup', signup);

router.post(
  '/login',
  passport.authenticate('local', { failureRedirect: '/api/auth/login/fail' }),
  login
);

router.post('/logout', isAuthenticated, logout);

router.get('/current-user', isAuthenticated, getCurrentUser);

router.get('/login/fail', (req: AuthRequest, res) => {
  res.status(401).json({ error: 'Authentication failed' });
});

export default router;
