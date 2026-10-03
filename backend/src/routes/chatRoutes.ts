import { Router } from 'express';
import { getMessages, listRooms } from '../controllers/chatController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();
router.use(requireAuth);
router.get('/rooms', listRooms);
router.get('/rooms/:roomId/messages', getMessages);

export default router;
