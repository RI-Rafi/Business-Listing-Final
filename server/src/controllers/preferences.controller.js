// NAIEF'S WORKING
import UserPreferences from '../models/UserPreferences.js';
import { ApiError } from '../utils/ApiError.js';

// Get user preferences
export const getUserPreferences = async (req, res) => {
    try {
        let preferences = await UserPreferences.findOne({ user: req.user._id });

        if (!preferences) {
            // Create default preferences
            preferences = await UserPreferences.create({
                user: req.user._id,
                aiMemory: {
                    importantNotes: [],
                    lastActive: new Date()
                }
            });
        }

        res.json({ preferences });
    } catch (error) {
        throw new ApiError(500, 'Failed to fetch preferences');
    }
};

// Update user preferences
export const updateUserPreferences = async (req, res) => {
    try {
        const { homeArea, favoriteDeliveryPlatform, dietaryPreferences, savedLocations } = req.body;

        const preferences = await UserPreferences.findOneAndUpdate(
            { user: req.user._id },
            {
                $set: {
                    homeArea,
                    favoriteDeliveryPlatform,
                    dietaryPreferences,
                    savedLocations,
                    'aiMemory.lastActive': new Date()
                }
            },
            { new: true, upsert: true }
        );

        res.json({ preferences });
    } catch (error) {
        throw new ApiError(500, 'Failed to update preferences');
    }
};

// Add AI memory note
export const addAIMemory = async (req, res) => {
    try {
        const { note } = req.body;

        const preferences = await UserPreferences.findOneAndUpdate(
            { user: req.user._id },
            {
                $push: { 'aiMemory.importantNotes': note },
                $set: { 'aiMemory.lastActive': new Date() }
            },
            { new: true, upsert: true }
        );

        res.json({ preferences });
    } catch (error) {
        throw new ApiError(500, 'Failed to add memory');
    }
};

// Track interaction
export const trackInteraction = async (req, res) => {
    try {
        const { action, targetId, metadata } = req.body;

        await UserPreferences.findOneAndUpdate(
            { user: req.user._id },
            {
                $push: {
                    interactionHistory: {
                        action,
                        targetId,
                        metadata,
                        timestamp: new Date()
                    }
                }
            },
            { upsert: true }
        );

        res.json({ success: true });
    } catch (error) {
        throw new ApiError(500, 'Failed to track interaction');
    }
};
