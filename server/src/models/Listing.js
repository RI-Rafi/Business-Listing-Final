import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Food', 'Cinema', 'Laundry', 'Haircut', 'Electronics', 'Fashion', 'Market'],
      required: [true, 'Category is required'],
    },
    location: {
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
      },
      area: {
        type: String,
        required: [true, 'Area is required'],
        trim: true,
      },
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    hours: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    externalBookingUrl: {
      type: String,
      trim: true,
    },
    popularity: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    deliveryPlatforms: [{
      name: {
        type: String,
        enum: ['Foodpanda', 'Uber Eats', 'Pathao Food', 'Hungrynaki', 'Shohoz Food', 'Pathao'],
      },
      url: String,
    }],
    menuItems: [{
      name: String,
      description: String,
      price: Number,
      category: String, // e.g., "Main Course", "Beverages", "Desserts"
      image: String,
      available: { type: Boolean, default: true }
    }],
    services: [{
      name: String,
      description: String,
      price: Number,
      duration: String, // e.g., "30 minutes", "2 hours"
      available: { type: Boolean, default: true }
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

listingSchema.index({ name: 'text', description: 'text', shortDescription: 'text' });
listingSchema.index({ category: 1, 'location.city': 1, 'location.area': 1 });
listingSchema.index({ owner: 1 });
listingSchema.index({ isActive: 1 });

export default mongoose.model('Listing', listingSchema);
