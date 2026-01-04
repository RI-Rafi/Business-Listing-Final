import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        business: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Business',
            required: true,
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking',
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
        },
        response: String, // Provider response
    },
    {
        timestamps: true,
    }
);

// Update business rating after review
reviewSchema.post('save', async function () {
    const Business = mongoose.model('Business');
    const businessId = this.business;

    const stats = await this.constructor.aggregate([
        { $match: { business: businessId } },
        {
            $group: {
                _id: '$business',
                avgRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 },
            },
        },
    ]);

    if (stats.length > 0) {
        await Business.findByIdAndUpdate(businessId, {
            averageRating: stats[0].avgRating.toFixed(1),
            totalReviews: stats[0].totalReviews,
        });
    }
});

export default mongoose.model('Review', reviewSchema);
