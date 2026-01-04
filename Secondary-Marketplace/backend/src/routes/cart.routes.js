import express from 'express';
import {
    getCart,
    addToCart,
    updateCartItem,
    deleteCartItem,
    clearCart,
    checkout,
} from '../controllers/cart.controller.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('customer'));

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/items/:itemId', updateCartItem);
router.delete('/items/:itemId', deleteCartItem);
router.delete('/clear', clearCart);
router.post('/checkout', checkout);

export default router;
