import * as authService from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { config } from '../config/env.js';

export const register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);

  res.status(201).json({
    success: true,
    data: { user },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { token, user } = await authService.loginUser(email, password);

  // FIXED: Changed sameSite from 'strict' to 'lax'
  // 'strict' was causing cookies to not be sent during navigation
  // 'lax' allows cookies in same-site navigation while maintaining security
  res.cookie(config.cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // Changed from 'strict' to fix session persistence
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  console.log(`✅ User logged in: ${user.email} (ID: ${user._id})`);
  console.log(`🍪 Cookie set: ${config.cookieName}`);

  res.json({
    success: true,
    data: { user, token },
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie(config.cookieName);
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id);
  res.json({
    success: true,
    data: { user },
  });
});
