import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        cartSnapshot: {
            items: [
                {
                    business: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Business',
                    },
                    service: {
                        id: String,
                        name: String,
                        price: Number,
                        duration: Number,
                    },
                    scheduledDate: Date,
                    scheduledTime: String,
                    quantity: Number,
                    notes: String,
                },
            ],
            totalAmount: Number,
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'completed', 'cancelled'],
            default: 'pending',
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid'],
            default: 'pending',
        },
        customerPhone: String,
        customerEmail: String,
        confirmedAt: Date,
        confirmedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Booking', bookingSchema);
