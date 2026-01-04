import express from 'express';
import { chat, getChatHistory, submitFeedback } from '../controllers/chat.controller.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', chat);
router.get('/history/:sessionId', getChatHistory);
router.post('/feedback', submitFeedback);

export default router;
