import * as metaService from '../services/meta.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await metaService.getCategories();

  res.json({
    success: true,
    data: { categories },
  });
});

export const getLocations = asyncHandler(async (req, res) => {
  const locations = await metaService.getLocations();

  res.json({
    success: true,
    data: { locations },
  });
});
