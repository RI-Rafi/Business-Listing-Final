import User from '../models/User.js';
import { sendTokenResponse } from '../utils/auth.js';
import { config } from '../config/env.js';

// @desc    Register customer
// @route   POST /api/auth/register-customer
// @access  Public
export const registerCustomer = async (req, res, next) => {
    try {
        const { name, email, password, phone } = req.body;

        const user = await User.create({
            name,
            email,
            password,
            phone,
            role: 'customer',
        });

        sendTokenResponse(user, 201, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Register service provider
// @route   POST /api/auth/register-provider
// @access  Public
export const registerProvider = async (req, res, next) => {
    try {
        const { name, email, password, phone, businessName, businessLicense } = req.body;

        const user = await User.create({
            name,
            email,
            password,
            phone,
            role: 'provider',
            providerProfile: {
                businessName,
                businessLicense,
                verified: false, // Needs admin approval
            },
        });

        res.status(201).json({
            success: true,
            message: 'Provider registration submitted. Awaiting admin approval.',
            data: {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: { message: 'Please provide email and password' },
            });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                error: { message: 'Invalid credentials' },
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: { message: 'Invalid credentials' },
            });
        }

        // Check if provider is verified
        if (user.role === 'provider' && !user.providerProfile.verified) {
            return res.status(403).json({
                success: false,
                error: { message: 'Provider account pending admin approval' },
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
    res.cookie(config.cookieName, 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        data: {},
    });
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            user: req.user,
        },
    });
};
