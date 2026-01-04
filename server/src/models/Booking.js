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
                    listing: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Listing',
                    },
                    serviceName: String,
                    price: Number,
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
        customerPhone: String,
        customerEmail: String,
        confirmedAt: Date,
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Booking', bookingSchema);
