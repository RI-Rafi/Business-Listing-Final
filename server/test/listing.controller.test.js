import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';
import User from '../src/models/User.js';
import Listing from '../src/models/Listing.js';
import dotenv from 'dotenv';

dotenv.config();

describe('Listing Controller', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Listing.deleteMany({});

    // Create test user and get token
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });
    userId = user._id.toString();

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    authToken = loginRes.body.data.token;
  });

  it('GET /api/listings should return paginated listings', async () => {
    // Create test listings
    await Listing.create({
      owner: userId,
      name: 'Test Listing 1',
      category: 'Haircut',
      location: { city: 'Dhaka', area: 'Gulshan' },
      shortDescription: 'Test description',
      description: 'Full description',
      phone: '+8801712345678',
      isActive: true,
    });

    await Listing.create({
      owner: userId,
      name: 'Test Listing 2',
      category: 'Laundry',
      location: { city: 'Dhaka', area: 'Dhanmondi' },
      shortDescription: 'Test description',
      description: 'Full description',
      phone: '+8801712345679',
      isActive: true,
    });

    const res = await request(app).get('/api/listings').query({ page: 1, limit: 10 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('listings');
    expect(res.body.data).toHaveProperty('pagination');
    expect(res.body.data.listings.length).toBeGreaterThan(0);
  });

  it('GET /api/listings should filter by category', async () => {
    await Listing.create({
      owner: userId,
      name: 'Haircut Shop',
      category: 'Haircut',
      location: { city: 'Dhaka', area: 'Gulshan' },
      shortDescription: 'Test',
      description: 'Full',
      phone: '+8801712345678',
    });

    const res = await request(app)
      .get('/api/listings')
      .query({ category: 'Haircut' });

    expect(res.status).toBe(200);
    expect(res.body.data.listings.every((l) => l.category === 'Haircut')).toBe(true);
  });
});
