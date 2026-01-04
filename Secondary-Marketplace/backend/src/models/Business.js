import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        serviceCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
            required: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        address: {
            street: String,
            city: String,
            area: String,
        },
        images: [String],
        services: [
            {
                name: {
                    type: String,
                    required: true,
                },
                description: String,
                price: {
                    type: Number,
                    required: true,
                },
                duration: {
                    type: Number, // in minutes
                    default: 60,
                },
                isAvailable: {
                    type: Boolean,
                    default: true,
                },
            },
        ],
        workingHours: {
            type: String,
            default: 'Mon-Sat: 9AM-8PM',
        },
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        totalReviews: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Business', businessSchema);
