// NAIEF'S WORKING
import { chatWithReX } from '../utils/openaiService.js';
import ChatHistory from '../models/ChatHistory.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Chat with AI
// @route   POST /api/chat
// @access  Public
export const chat = asyncHandler(async (req, res) => {
    const { message, context } = req.body;
    const userId = req.user?.id; // Optional if public

    if (!message) {
        res.status(400);
        throw new Error('Message is required');
    }

    const aiResponse = await chatWithReX(message, context || { sessionId: req.params.sessionId || 'guest' }, userId);

    res.status(200).json({
        success: true,
        data: {
            response: aiResponse,
            sessionId: context?.sessionId,
        },
    });
});

// @desc    Get chat history
// @route   GET /api/chat/history/:sessionId
// @access  Public
export const getChatHistory = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;
    const chatHistory = await ChatHistory.findOne({ sessionId });

    if (!chatHistory) {
        return res.status(200).json({
            success: true,
            data: { messages: [] },
        });
    }

    res.status(200).json({
        success: true,
        data: chatHistory,
    });
});
