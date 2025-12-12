import Listing from '../models/Listing.js';
import { ApiError } from '../utils/ApiError.js';

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
