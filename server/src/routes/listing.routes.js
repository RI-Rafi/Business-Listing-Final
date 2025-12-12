import express from 'express';
import * as listingController from '../controllers/listing.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { validate, schemas } from '../middlewares/validate.js';
import { listingWriteRateLimit } from '../middlewares/rateLimit.js';

const router = express.Router();

router.get('/', validate(schemas.getListings), listingController.getListings);
router.get('/my-listings', authenticate, listingController.getMyListings);
router.get('/:id', listingController.getListing);
router.post(
  '/',
  authenticate,
  listingWriteRateLimit,
  validate(schemas.createListing),
  listingController.createListing
);
router.put(
  '/:id',
  authenticate,
  listingWriteRateLimit,
  validate(schemas.updateListing),
  listingController.updateListing
);
router.delete(
  '/:id',
  authenticate,
  listingWriteRateLimit,
  listingController.deleteListing
);

export default router;
