import express from 'express';
import { chat, getChatHistory } from '../controllers/chat.controller.js';

const router = express.Router();

router.post('/', chat);
router.get('/history/:sessionId', getChatHistory);

export default router;
