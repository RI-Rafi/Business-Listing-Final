import User from '../models/User.js';
import Listing from '../models/Listing.js';

export const getStats = async () => {
  const [users, totalListings, activeListings] = await Promise.all([
    User.countDocuments(),
    Listing.countDocuments(),
    Listing.countDocuments({ isActive: true }),
  ]);

  return {
    users,
    totalListings,
    activeListings,
  };
};

