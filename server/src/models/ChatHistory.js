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
            listingId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Listing',
            },
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('ChatHistory', chatHistorySchema);
