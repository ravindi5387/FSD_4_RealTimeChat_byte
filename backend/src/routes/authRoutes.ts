import { Router } from 'express';
import { login, register } from '../controllers/authController';
import { requireAuth } from '../middleware/authMiddleware';
import { AuthenticatedRequest } from '../types/auth';

const router = Router();
router.post('/register', register);
router.post('/login', login);
router.get('/me', requireAuth, (req: AuthenticatedRequest, res) => {
  res.status(200).json({ user: req.user });
});

export default router;
