// NAIEF'S WORKING
import Cart from '../models/Cart.js';
import Listing from '../models/Listing.js';
import Booking from '../models/Booking.js';

// @desc    Get customer's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res, next) => {
    try {
        console.log('\n🛒 GET CART REQUEST');
        console.log(`👤 User ID: ${req.user._id || req.user.id}`);

        const userId = req.user._id || req.user.id;
        let cart = await Cart.findOne({ customer: userId }).populate('items.listing');

        if (!cart) {
            console.log('📝 No cart found, creating new one');
            cart = await Cart.create({ customer: userId, items: [] });
        } else {
            console.log(`✅ Cart found with ${cart.items.length} items`);
        }

        res.status(200).json({
            success: true,
            data: cart,
        });

        console.log('🎉 Get cart complete\n');
    } catch (error) {
        console.error('❌ Get cart error:', error.message);
        next(error);
    }
};

// @desc    Add to cart
// @route   POST /api/cart/add
// @access  Private
export const addToCart = async (req, res, next) => {
    try {
        const { listingId, serviceName, price, scheduledDate, scheduledTime, quantity, notes } = req.body;

        console.log('\n🛒 ADD TO CART REQUEST');
        console.log(`👤 User ID: ${req.user._id || req.user.id}`);
        console.log(`📦 Listing ID: ${listingId}`);
        console.log(`📅 Date: ${scheduledDate}, Time: ${scheduledTime}`);

        const listing = await Listing.findById(listingId);
        if (!listing) {
            console.log('❌ Listing not found');
            return res.status(404).json({
                success: false,
                error: { message: 'Listing not found' },
            });
        }

        console.log(`✅ Listing found: ${listing.name}`);

        // Use req.user._id which is the full ObjectId
        const userId = req.user._id || req.user.id;
        let cart = await Cart.findOne({ customer: userId });

        if (!cart) {
            console.log('📝 Creating new cart for user');
            cart = new Cart({ customer: userId, items: [] });
        } else {
            console.log(`🛒 Existing cart found with ${cart.items.length} items`);
        }

        const newItem = {
            listing: listingId,
            serviceName: serviceName || listing.name,
            price: price || 0,
            scheduledDate,
            scheduledTime,
            quantity: quantity || 1,
            notes: notes || '',
        };

        cart.items.push(newItem);
        console.log(`➕ Item added to cart. Total items: ${cart.items.length}`);

        await cart.save();
        console.log('💾 Cart saved successfully');

        await cart.populate('items.listing');
        console.log('✅ Cart populated with listing details');

        res.status(200).json({
            success: true,
            message: 'Added to cart',
            data: cart,
        });

        console.log('🎉 Cart add complete\n');
    } catch (error) {
        console.error('❌ Cart add error:', error.message);
        next(error);
    }
};

// @desc    Update cart item
// @route   PUT /api/cart/items/:itemId
// @access  Private
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
                error: { message: 'Item not found' },
            });
        }

        if (scheduledDate) item.scheduledDate = scheduledDate;
        if (scheduledTime) item.scheduledTime = scheduledTime;
        if (quantity) item.quantity = quantity;
        if (notes !== undefined) item.notes = notes;

        await cart.save();
        await cart.populate('items.listing');

        res.status(200).json({
            success: true,
            message: 'Cart updated',
            data: cart,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete cart item
// @route   DELETE /api/cart/items/:itemId
// @access  Private
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
        await cart.populate('items.listing');

        res.status(200).json({
            success: true,
            message: 'Item removed',
            data: cart,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Checkout
// @route   POST /api/cart/checkout
// @access  Private
export const checkout = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ customer: req.user._id }).populate('items.listing');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                error: { message: 'Cart is empty' },
            });
        }

        const booking = await Booking.create({
            customer: req.user._id,
            cartSnapshot: {
                items: cart.items.map(item => ({
                    listing: item.listing._id,
                    serviceName: item.serviceName,
                    price: item.price,
                    scheduledDate: item.scheduledDate,
                    scheduledTime: item.scheduledTime,
                    quantity: item.quantity,
                    notes: item.notes,
                })),
                totalAmount: cart.totalAmount,
            },
            customerPhone: req.user.phone || '',
            customerEmail: req.user.email,
            status: 'pending',
        });

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
