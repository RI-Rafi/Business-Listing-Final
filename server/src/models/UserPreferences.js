import mongoose from 'mongoose';

const userPreferencesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    homeArea: {
        type: String,
        enum: ['Gulshan', 'Banani', 'Dhanmondi', 'Uttara', 'Mirpur', 'Bashundhara', 'Mohakhali', 'Tejgaon', 'Badda', 'Rampura', 'Motijheel', 'Old Dhaka'],
        default: null
    },
    favoriteDeliveryPlatform: {
        type: String,
        enum: ['Foodpanda', 'Uber Eats', 'Pathao', 'HungryNaki'],
        default: null
    },
    dietaryPreferences: {
        type: [String], // e.g., 'Vegetarian', 'Halal', 'Spicy'
        default: []
    },
    savedLocations: [{
        label: String, // 'Home', 'Work'
        area: String,
        address: String
    }],
    interactionHistory: [{
        action: String, // 'view_listing', 'add_to_cart', 'search'
        targetId: mongoose.Schema.Types.ObjectId, // Listing ID
        timestamp: {
            type: Date,
            default: Date.now
        },
        metadata: Object // Extra details
    }],
    aiMemory: {
        // Structured memory for the AI to read/write
        lastConversationTopic: String,
        importantNotes: [String], // "User likes window seats at cafes"
        lastActive: Date
    }
}, {
    timestamps: true
});

const UserPreferences = mongoose.model('UserPreferences', userPreferencesSchema);

export default UserPreferences;
