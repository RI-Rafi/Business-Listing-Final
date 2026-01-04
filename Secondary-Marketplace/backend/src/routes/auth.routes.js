import express from 'express';
import {
    registerCustomer,
    registerProvider,
    login,
    logout,
    getMe,
} from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register-customer', registerCustomer);
router.post('/register-provider', registerProvider);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;
