import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        items: [
            {
                business: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Business',
                    required: true,
                },
                service: {
                    id: {
                        type: String,
                        required: true,
                    },
                    name: {
                        type: String,
                        required: true,
                    },
                    price: {
                        type: Number,
                        required: true,
                    },
                    duration: Number,
                },
                scheduledDate: {
                    type: Date,
                    required: true,
                },
                scheduledTime: {
                    type: String,
                    required: true,
                },
                quantity: {
                    type: Number,
                    default: 1,
                    min: 1,
                },
                notes: String,
                addedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        totalAmount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Calculate total amount before saving
cartSchema.pre('save', function (next) {
    this.totalAmount = this.items.reduce(
        (total, item) => total + item.service.price * item.quantity,
        0
    );
    next();
});

export default mongoose.model('Cart', cartSchema);
