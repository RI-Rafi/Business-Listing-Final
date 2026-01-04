import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import {
    getUserPreferences,
    updateUserPreferences,
    addAIMemory,
    trackInteraction
} from '../controllers/preferences.controller.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getUserPreferences);
router.put('/', updateUserPreferences);
router.post('/memory', addAIMemory);
router.post('/track', trackInteraction);

export default router;
