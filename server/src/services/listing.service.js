import Listing from '../models/Listing.js';
import { ApiError } from '../utils/ApiError.js';
import { geocodeAddress, buildAddressString } from './geoapify.service.js';

export const getListings = async (filters, pagination, sort) => {
  const { search, category, city, area } = filters;
  const { page = 1, limit = 12 } = pagination;

  const query = { isActive: true };

  if (search) {
    query.$text = { $search: search };
  }
  if (category) {
    query.category = category;
  }
  if (city) {
    query['location.city'] = city;
  }
  if (area) {
    query['location.area'] = area;
  }

  const sortOptions = {};
  if (sort === 'newest') {
    sortOptions.createdAt = -1;
  } else if (sort === 'az') {
    sortOptions.name = 1;
  } else if (search) {
    sortOptions.score = { $meta: 'textScore' };
  } else {
    sortOptions.createdAt = -1;
  }

  const skip = (page - 1) * limit;

  const [listings, total] = await Promise.all([
    Listing.find(query)
      .populate('owner', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean(),
    Listing.countDocuments(query),
  ]);

  return {
    listings,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getListingById = async (listingId) => {
  const listing = await Listing.findById(listingId)
    .populate('owner', 'name email')
    .lean();

  if (!listing) {
    throw new ApiError(404, 'Listing not found');
  }

  return listing;
};

export const createListing = async (listingData, userId) => {
  // Geocode address if location is provided
  if (listingData.location && !listingData.geo?.coordinates) {
    const address = buildAddressString(listingData.location);
    if (address) {
      const coords = await geocodeAddress(address);
      if (coords) {
        listingData.geo = {
          type: 'Point',
          coordinates: [coords.lng, coords.lat], // MongoDB GeoJSON: [lng, lat]
        };
      }
    }
  }

  const listing = await Listing.create({
    ...listingData,
    owner: userId,
  });

  return await Listing.findById(listing._id)
    .populate('owner', 'name email')
    .lean();
};

export const updateListing = async (listingId, listingData, userId, userRole) => {
  const listing = await Listing.findById(listingId);

  if (!listing) {
    throw new ApiError(404, 'Listing not found');
  }

  if (listing.owner.toString() !== userId && userRole !== 'admin') {
    throw new ApiError(403, 'Not authorized to update this listing');
  }

  // Geocode address if location changed and coordinates not provided
  if (listingData.location && !listingData.geo?.coordinates) {
    const address = buildAddressString(listingData.location);
    if (address) {
      const coords = await geocodeAddress(address);
      if (coords) {
        listingData.geo = {
          type: 'Point',
          coordinates: [coords.lng, coords.lat], // MongoDB GeoJSON: [lng, lat]
        };
      }
    }
  }

  Object.assign(listing, listingData);
  await listing.save();

  return await Listing.findById(listing._id)
    .populate('owner', 'name email')
    .lean();
};

export const deleteListing = async (listingId, userId, userRole) => {
  const listing = await Listing.findById(listingId);

  if (!listing) {
    throw new ApiError(404, 'Listing not found');
  }

  if (listing.owner.toString() !== userId && userRole !== 'admin') {
    throw new ApiError(403, 'Not authorized to delete this listing');
  }

  await Listing.findByIdAndDelete(listingId);
};

export const getUserListings = async (userId) => {
  return await Listing.find({ owner: userId })
    .populate('owner', 'name email')
    .sort({ createdAt: -1 })
    .lean();
};

/**
 * Get listings optimized for map display
 * @param {Object} filters - Filter object with category, city, area, minPrice, maxPrice
 * @param {string} sort - Sort option ('rating', 'popular', 'newest')
 * @returns {Promise<{listings: Array, missingGeoCount: number}>}
 */
export const getMapListings = async (filters, sort) => {
  const { category, city, area, minPrice, maxPrice } = filters;

  const query = { 
    isActive: true,
    'geo.coordinates': { $exists: true, $ne: null } // Only return listings with coordinates
  };

  if (category) {
    query.category = category;
  }
  if (city) {
    query['location.city'] = city;
  }
  if (area) {
    query['location.area'] = area;
  }

  // Price filtering - check if any service/menuItem price is within range
  if (minPrice || maxPrice) {
    const priceConditions = [];
    
    if (minPrice && maxPrice) {
      // Both min and max: price must be between them
      priceConditions.push(
        { 'services.price': { $gte: Number(minPrice), $lte: Number(maxPrice) } },
        { 'menuItems.price': { $gte: Number(minPrice), $lte: Number(maxPrice) } }
      );
    } else if (minPrice) {
      // Only min: price must be >= minPrice
      priceConditions.push(
        { 'services.price': { $gte: Number(minPrice) } },
        { 'menuItems.price': { $gte: Number(minPrice) } }
      );
    } else if (maxPrice) {
      // Only max: price must be <= maxPrice
      priceConditions.push(
        { 'services.price': { $lte: Number(maxPrice) } },
        { 'menuItems.price': { $lte: Number(maxPrice) } }
      );
    }
    
    if (priceConditions.length > 0) {
      query.$or = priceConditions;
    }
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

  const listings = await Listing.find(query)
    .select('_id name category location geo rating reviewCount imageUrl services menuItems')
    .sort(sortOption)
    .lean();

  // Count listings that match filters but are missing coordinates
  const missingGeoQuery = { ...query };
  delete missingGeoQuery['geo.coordinates'];
  missingGeoQuery.$or = [
    { 'geo.coordinates': { $exists: false } },
    { 'geo.coordinates': null },
  ];
  const missingGeoCount = await Listing.countDocuments(missingGeoQuery);

  // Transform listings for map display
  const mapListings = listings.map(listing => {
    // Calculate price hint (minimum price from services or menuItems)
    let priceHint = null;
    const allPrices = [
      ...(listing.services || []).map(s => s.price).filter(p => p != null),
      ...(listing.menuItems || []).map(m => m.price).filter(p => p != null),
    ];
    if (allPrices.length > 0) {
      priceHint = Math.min(...allPrices);
    }

    return {
      _id: listing._id,
      name: listing.name,
      category: listing.category,
      address: listing.location ? `${listing.location.area}, ${listing.location.city}` : null,
      geo: listing.geo,
      priceHint,
      rating: listing.rating,
      reviewCount: listing.reviewCount,
      imageUrl: listing.imageUrl,
    };
  });

  return {
    listings: mapListings,
    missingGeoCount,
  };
};