import * as userService from '../services/user.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const getBookmarks = asyncHandler(async (req, res) => {
  const listings = await userService.getUserBookmarks(req.user.id);

  res.json({
    success: true,
    data: { listings },
  });
});

export const toggleBookmark = asyncHandler(async (req, res) => {
  try {
    const result = await userService.toggleBookmark(req.user.id, req.params.listingId);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    throw new ApiError(404, error.message);
  }
});
