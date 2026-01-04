import { chatWithAI } from '../utils/openaiService.js';
import ChatHistory from '../models/ChatHistory.js';

// @desc    Chat with AI
// @route   POST /api/chat
// @access  Public
export const chat = async (req, res, next) => {
    try {
        const { message, context } = req.body;
        const userId = req.user?._id;

        if (!message) {
            return res.status(400).json({
                success: false,
                error: { message: 'Message is required' },
            });
        }

        const aiResponse = await chatWithAI(message, context, userId);

        res.status(200).json({
            success: true,
            data: {
                response: aiResponse,
                sessionId: context.sessionId,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get chat history
// @route   GET /api/chat/history/:sessionId
// @access  Public
export const getChatHistory = async (req, res, next) => {
    try {
        const { sessionId } = req.params;

        const chatHistory = await ChatHistory.findOne({ sessionId });

        if (!chatHistory) {
            return res.status(404).json({
                success: false,
                error: { message: 'Chat history not found' },
            });
        }

        res.status(200).json({
            success: true,
            data: chatHistory,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Submit chat feedback
// @route   POST /api/chat/feedback
// @access  Public
export const submitFeedback = async (req, res, next) => {
    try {
        const { sessionId, feedback, resolved } = req.body;

        await ChatHistory.updateOne(
            { sessionId },
            { $set: { feedback, resolved: resolved || false } }
        );

        res.status(200).json({
            success: true,
            message: 'Feedback submitted',
        });
    } catch (error) {
        next(error);
    }
};
