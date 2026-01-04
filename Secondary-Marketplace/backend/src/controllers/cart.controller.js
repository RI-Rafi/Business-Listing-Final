import Cart from '../models/Cart.js';
import Business from '../models/Business.js';
import Booking from '../models/Booking.js';
import { sendBookingConfirmation, sendProviderNotification } from '../utils/emailService.js';

// @desc    Get customer's cart
// @route   GET /api/cart
// @access  Private (customer)
export const getCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ customer: req.user._id }).populate('items.business');

        if (!cart) {
            return res.status(200).json({
                success: true,
                data: { items: [], totalAmount: 0 },
            });
        }

        res.status(200).json({
            success: true,
            data: cart,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add service to cart
// @route   POST /api/cart/add
// @access  Private (customer)
export const addToCart = async (req, res, next) => {
    try {
        const { businessId, serviceId, scheduledDate, scheduledTime, quantity, notes } = req.body;

        // Get business and service details
        const business = await Business.findById(businessId);
        if (!business) {
            return res.status(404).json({
                success: false,
                error: { message: 'Business not found' },
            });
        }

        const service = business.services.id(serviceId);
        if (!service) {
            return res.status(404).json({
                success: false,
                error: { message: 'Service not found' },
            });
        }

        if (!service.isAvailable) {
            return res.status(400).json({
                success: false,
                error: { message: 'Service is not available' },
            });
        }

        // Find or create cart
        let cart = await Cart.findOne({ customer: req.user._id });

        if (!cart) {
            cart = new Cart({ customer: req.user._id, items: [] });
        }

        // Add item to cart
        cart.items.push({
            business: businessId,
            service: {
                id: service._id.toString(),
                name: service.name,
                price: service.price,
                duration: service.duration,
            },
            scheduledDate,
            scheduledTime,
            quantity: quantity || 1,
            notes: notes || '',
        });

        await cart.save();

        await cart.populate('items.business');

        res.status(200).json({
            success: true,
            message: 'Service added to cart',
            data: cart,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update cart item
// @route   PUT /api/cart/items/:itemId
// @access  Private (customer)
export const updateCartItem = async (req, res, next) => {
    try {
        const { itemId } = req.params;
        const { scheduledDate, scheduledTime, quantity, notes } = req.body;

        const cart = await Cart.findOne({ customer: req.user._id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                error: { message: 'Cart not found' },
            });
        }

        const item = cart.items.id(itemId);
        if (!item) {
            return res.status(404).json({
                success: false,
                error: { message: 'Item not found in cart' },
            });
        }

        // Update fields
        if (scheduledDate) item.scheduledDate = scheduledDate;
        if (scheduledTime) item.scheduledTime = scheduledTime;
        if (quantity) item.quantity = quantity;
        if (notes !== undefined) item.notes = notes;

        await cart.save();
        await cart.populate('items.business');

        res.status(200).json({
            success: true,
            message: 'Cart item updated',
            data: cart,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete cart item
// @route   DELETE /api/cart/items/:itemId
// @access  Private (customer)
export const deleteCartItem = async (req, res, next) => {
    try {
        const { itemId } = req.params;

        const cart = await Cart.findOne({ customer: req.user._id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                error: { message: 'Cart not found' },
            });
        }

        cart.items = cart.items.filter(item => item._id.toString() !== itemId);
        await cart.save();
        await cart.populate('items.business');

        res.status(200).json({
            success: true,
            message: 'Item removed from cart',
            data: cart,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private (customer)
export const clearCart = async (req, res, next) => {
    try {
        await Cart.findOneAndUpdate(
            { customer: req.user._id },
            { items: [], totalAmount: 0 }
        );

        res.status(200).json({
            success: true,
            message: 'Cart cleared',
            data: { items: [], totalAmount: 0 },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Checkout (create booking from cart)
// @route   POST /api/cart/checkout
// @access  Private (customer)
export const checkout = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ customer: req.user._id }).populate('items.business');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                error: { message: 'Cart is empty' },
            });
        }

        // Create booking with cart snapshot
        const booking = await Booking.create({
            customer: req.user._id,
            cartSnapshot: {
                items: cart.items.map(item => ({
                    business: item.business._id,
                    service: item.service,
                    scheduledDate: item.scheduledDate,
                    scheduledTime: item.scheduledTime,
                    quantity: item.quantity,
                    notes: item.notes,
                })),
                totalAmount: cart.totalAmount,
            },
            customerPhone: req.user.phone,
            customerEmail: req.user.email,
            status: 'pending',
        });

        // Send email to customer
        const firstBusiness = cart.items[0].business;
        await sendBookingConfirmation(booking, firstBusiness);

        // Notify provider(s)
        const uniqueBusinesses = [...new Set(cart.items.map(item => item.business._id.toString()))];
        for (const businessId of uniqueBusinesses) {
            const business = await Business.findById(businessId).populate('owner');
            if (business.owner) {
                await sendProviderNotification(business.owner, booking);
            }
        }

        // Clear cart
        cart.items = [];
        cart.totalAmount = 0;
        await cart.save();

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: booking,
        });
    } catch (error) {
        next(error);
    }
};
