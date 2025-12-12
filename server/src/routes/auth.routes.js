import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { validate, schemas } from '../middlewares/validate.js';
import { authRateLimit } from '../middlewares/rateLimit.js';

const router = express.Router();

router.post('/register', authRateLimit, validate(schemas.register), authController.register);
router.post('/login', authRateLimit, validate(schemas.login), authController.login);
router.post('/logout', authController.logout);
router.get('/me', authenticate, authController.getMe);

export default router;
