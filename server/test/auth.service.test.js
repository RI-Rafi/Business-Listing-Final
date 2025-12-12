import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import mongoose from 'mongoose';
import { connectDB } from '../src/config/db.js';
import * as authService from '../src/services/auth.service.js';
import User from '../src/models/User.js';
import dotenv from 'dotenv';

dotenv.config();

describe('Auth Service', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should register a new user', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    const user = await authService.registerUser(userData);

    expect(user).toHaveProperty('id');
    expect(user.email).toBe('test@example.com');
    expect(user.name).toBe('Test User');
    expect(user).not.toHaveProperty('password');
  });

  it('should throw error if email already exists', async () => {
    await User.create({
      name: 'Existing User',
      email: 'existing@example.com',
      password: 'password123',
    });

    await expect(
      authService.registerUser({
        name: 'New User',
        email: 'existing@example.com',
        password: 'password123',
      })
    ).rejects.toThrow('Email already registered');
  });

  it('should login with valid credentials', async () => {
    await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    const result = await authService.loginUser('test@example.com', 'password123');

    expect(result).toHaveProperty('token');
    expect(result.user.email).toBe('test@example.com');
  });

  it('should throw error with invalid credentials', async () => {
    await expect(
      authService.loginUser('nonexistent@example.com', 'password123')
    ).rejects.toThrow('Invalid email or password');
  });
});

