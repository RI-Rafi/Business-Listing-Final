import express from 'express';
import {
    getCart,
    addToCart,
    updateCartItem,
    deleteCartItem,
    checkout,
} from '../controllers/cart.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/items/:itemId', updateCartItem);
router.delete('/items/:itemId', deleteCartItem);
router.post('/checkout', checkout);

export default router;
