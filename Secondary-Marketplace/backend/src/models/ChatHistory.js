import mongoose from 'mongoose';

const chatHistorySchema = new mongoose.Schema(
    {
        sessionId: {
            type: String,
            required: true,
            unique: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        messages: [
            {
                role: {
                    type: String,
                    enum: ['user', 'assistant'],
                    required: true,
                },
                content: {
                    type: String,
                    required: true,
                },
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        context: {
            businessId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Business',
            },
            serviceId: String,
        },
        sentiment: {
            type: String,
            enum: ['positive', 'neutral', 'negative'],
            default: 'neutral',
        },
        resolved: {
            type: Boolean,
            default: false,
        },
        feedback: {
            type: Number,
            min: 1,
            max: 5,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('ChatHistory', chatHistorySchema);
