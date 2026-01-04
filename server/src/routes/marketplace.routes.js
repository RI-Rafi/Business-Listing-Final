import express from 'express';
import { getMarketplaceByCategory, incrementPopularity } from '../controllers/marketplace.controller.js';

const router = express.Router();

router.get('/:category', getMarketplaceByCategory);
router.post('/:id/view', incrementPopularity);

export default router;
