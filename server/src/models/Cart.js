import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: [
            {
                listing: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Listing',
                    required: true,
                },
                serviceName: String,
                price: Number,
                scheduledDate: Date,
                scheduledTime: String,
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

// Calculate total before saving
cartSchema.pre('save', function (next) {
    this.totalAmount = this.items.reduce(
        (total, item) => total + (item.price || 0) * item.quantity,
        0
    );
    next();
});

export default mongoose.model('Cart', cartSchema);
