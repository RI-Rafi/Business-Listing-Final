import OpenAI from 'openai';
import { config } from '../config/env.js';
import ChatHistory from '../models/ChatHistory.js';
import Business from '../models/Business.js';

const openai = new OpenAI({
    apiKey: config.openaiApiKey,
});

export const chatWithAI = async (message, context, userId) => {
    try {
        // Build context information
        let contextInfo = '';
        if (context?.businessId) {
            const business = await Business.findById(context.businessId).populate('serviceCategory');
            if (business) {
                contextInfo = `
          Business Name: ${business.name}
          Category: ${business.serviceCategory?.name || 'N/A'}
          Rating: ${business.averageRating} stars (${business.totalReviews} reviews)
          Description: ${business.description}
          Services offered: ${business.services.map(s => `${s.name} ($${s.price})`).join(', ')}
          Location: ${business.address?.city || 'N/A'}
        `;
            }
        }

        // Sarcastic personality system prompt
        const systemPrompt = `You are "SassBot", a witty and sarcastic marketplace assistant. 
Your job is to help customers learn about services and businesses, but do it with playful sarcasm and humor.
Be helpful and informative, but keep it fun and slightly snarky. Think of yourself as a friend who loves to tease but genuinely wants to help.
Don't be mean or offensive - just entertaining and cheeky.
Keep responses concise (2-3 sentences max) and end with a relevant emoji.
${contextInfo ? `Context about what the user is asking about:\n${contextInfo}` : ''}`;

        // Get chat history
        const chatHistory = await ChatHistory.findOne({ sessionId: context.sessionId });
        const previousMessages = chatHistory?.messages.slice(-6) || []; // Last 6 messages for context

        const messages = [
            { role: 'system', content: systemPrompt },
            ...previousMessages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: message },
        ];

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: messages,
            temperature: 0.9, // More creative/sarcastic
            max_tokens: 150,
        });

        const aiResponse = completion.choices[0].message.content;

        // Save to chat history (self-learning)
        await ChatHistory.updateOne(
            { sessionId: context.sessionId },
            {
                $push: {
                    messages: [
                        { role: 'user', content: message, timestamp: new Date() },
                        { role: 'assistant', content: aiResponse, timestamp: new Date() },
                    ],
                },
                $set: {
                    user: userId,
                    context: {
                        businessId: context.businessId,
                        serviceId: context.serviceId,
                    },
                },
            },
            { upsert: true }
        );

        return aiResponse;
    } catch (error) {
        console.error('OpenAI API Error:', error);
        // Fallback sarcastic response if API fails
        return "Well, looks like my AI brain is taking a coffee break ☕ Try again in a sec, will ya?";
    }
};
