import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.get('/me/bookmarks', authenticate, userController.getBookmarks);
router.post('/me/bookmarks/:listingId', authenticate, userController.toggleBookmark);

export default router;
