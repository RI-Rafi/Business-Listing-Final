// NAIEF'S WORKING
import Listing from '../models/Listing.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Get marketplace by category
// @route   GET /api/marketplace/:category
// @access  Public
export const getMarketplaceByCategory = asyncHandler(async (req, res) => {
    const { category } = req.params;
    const { sort = 'rating', area } = req.query;

    // Build filter
    const filter = {
        category: category.charAt(0).toUpperCase() + category.slice(1),
        isActive: true,
    };

    if (area) {
        filter['location.area'] = area;
    }

    // Build sort
    let sortOption = {};
    switch (sort) {
        case 'rating':
            sortOption = { rating: -1, reviewCount: -1 };
            break;
        case 'popular':
            sortOption = { popularity: -1 };
            break;
        case 'newest':
            sortOption = { createdAt: -1 };
            break;
        default:
            sortOption = { rating: -1 };
    }

    const listings = await Listing.find(filter)
        .sort(sortOption)
        .populate('owner', 'name email');

    res.status(200).json({
        success: true,
        count: listings.length,
        data: listings,
    });
});

// @desc    Increment popularity when user views
// @route   POST /api/marketplace/:id/view
// @access  Public
export const incrementPopularity = asyncHandler(async (req, res) => {
    const listing = await Listing.findByIdAndUpdate(
        req.params.id,
        { $inc: { popularity: 1 } },
        { new: true }
    );

    if (!listing) {
        res.status(404);
        throw new Error('Listing not found');
    }

    res.status(200).json({
        success: true,
        data: listing,
    });
});
