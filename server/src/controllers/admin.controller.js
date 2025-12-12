import * as adminService from '../services/admin.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getStats();

  res.json({
    success: true,
    data: stats,
  });
});
