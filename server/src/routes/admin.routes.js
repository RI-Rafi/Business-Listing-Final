import express from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/stats', authenticate, authorize('admin'), adminController.getStats);

export default router;
