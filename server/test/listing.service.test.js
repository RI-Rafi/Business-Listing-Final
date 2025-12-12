import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import mongoose from 'mongoose';
import { connectDB } from '../src/config/database.js';
import * as listingService from '../src/services/listing.service.js';
import Listing from '../src/models/Listing.js';
import User from '../src/models/User.js';

describe('Listing Service', () => {
  let testUser;

  beforeAll(async () => {
    await connectDB();
  });

  beforeEach(async () => {
    await Listing.deleteMany({});
    await User.deleteMany({});
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a listing', async () => {
    const listingData = {
      name: 'Test Listing',
      category: 'Haircut',
      location: { city: 'Dhaka', area: 'Gulshan' },
      shortDescription: 'Test short description',
      description: 'Test full description',
    };

    const listing = await listingService.createListing(listingData, testUser._id);

    expect(listing).toBeDefined();
    expect(listing.name).toBe('Test Listing');
    expect(listing.owner._id.toString()).toBe(testUser._id.toString());
  });

  it('should get listings with filters', async () => {
    await Listing.create([
      {
        owner: testUser._id,
        name: 'Hair Salon',
        category: 'Haircut',
        location: { city: 'Dhaka', area: 'Gulshan' },
        shortDescription: 'A hair salon',
        description: 'Full description',
      },
      {
        owner: testUser._id,
        name: 'Laundry Shop',
        category: 'Laundry',
        location: { city: 'Dhaka', area: 'Dhanmondi' },
        shortDescription: 'A laundry shop',
        description: 'Full description',
      },
    ]);

    const result = await listingService.getListings({ category: 'Haircut' });

    expect(result.listings).toHaveLength(1);
    expect(result.listings[0].category).toBe('Haircut');
    expect(result.pagination.total).toBe(1);
  });
});

