// Sample businesses for testing the marketplace
// Run this with: node server/src/seeds/sampleBusinesses.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Listing from '../models/Listing.js';
import User from '../models/User.js';

dotenv.config();

const sampleBusinesses = [
    // FOOD Category
    {
        name: 'Koshai Paradise',
        category: 'Food',
        location: { city: 'Dhaka', area: 'Dhanmondi' },
        shortDescription: 'Best koshai in town! Crispy outside, soft inside.',
        description: 'Traditional Bengali koshai made fresh daily. Our secret recipe passed down three generations. Delivery available.',
        phone: '+880 1711-111111',
        hours: '7 AM - 10 PM Daily',
        imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
        externalBookingUrl: 'https://foodpanda.com.bd',
        rating: 4.8,
        reviewCount: 245,
        popularity: 1520,
        isActive: true,
    },
    {
        name: 'Biriyani House',
        category: 'Food',
        location: { city: 'Dhaka', area: 'Gulshan' },
        shortDescription: 'Authentic Hyderabadi biriyani with tender meat',
        description: 'Premium biriyani restaurant serving Hyderabadi, Kolkata, and Dhaka style biriyani. Catering services available for events.',
        phone: '+880 1722-222222',
        hours: '11 AM - 11 PM',
        imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400',
        externalBookingUrl: 'https://foodpanda.com.bd',
        rating: 4.9,
        reviewCount: 567,
        popularity: 2350,
        isActive: true,
    },
    {
        name: 'Dragon Wok Chinese',
        category: 'Food',
        location: { city: 'Dhaka', area: 'Banani' },
        shortDescription: 'Authentic Chinese cuisine and Thai favorites',
        description: 'Best Chinese restaurant in Banani. Chowmein, fried rice, dim sum, and more. Dine-in and delivery both available.',
        phone: '+880 1733-333333',
        hours: '12 PM - 10 PM',
        imageUrl: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400',
        externalBookingUrl: 'https://foodpanda.com.bd',
        rating: 4.6,
        reviewCount: 189,
        popularity: 890,
        isActive: true,
    },

    // CINEMA Category
    {
        name: 'MovieSite Cineplex',
        category: 'Cinema',
        location: { city: 'Dhaka', area: 'Gulshan' },
        shortDescription: 'Premium movie experience with luxury seating',
        description: 'State-of-the-art cinema with Dolby Atmos sound, 4K projection, and reclining seats. Online booking available.',
        phone: '+880 1744-444444',
        hours: '10 AM - 12 AM',
        imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400',
        externalBookingUrl: 'https://www.blockbusterbd.net/',
        rating: 4.7,
        reviewCount: 432,
        popularity: 3200,
        isActive: true,
    },
    {
        name: 'Star Cineplex',
        category: 'Cinema',
        location: { city: 'Dhaka', area: 'Bashundhara' },
        shortDescription: 'Largest multiplex in Bangladesh',
        description: 'Multiple screens showing latest Hollywood and Bollywood releases. Advance booking recommended on weekends.',
        phone: '+880 1755-555555',
        hours: '11 AM - 11 PM',
        imageUrl: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400',
        externalBookingUrl: 'https://www.starcineplex.com/',
        rating: 4.5,
        reviewCount: 678,
        popularity: 4100,
        isActive: true,
    },

    // LAUNDRY Category
    {
        name: 'Quick Clean Laundry',
        category: 'Laundry',
        location: { city: 'Dhaka', area: 'Dhanmondi' },
        shortDescription: 'Same day service available! Free pickup & delivery',
        description: 'Professional laundry and dry cleaning service. We handle everything from everyday clothes to delicate fabrics.',
        phone: '+880 1766-666666',
        hours: '8 AM - 8 PM',
        imageUrl: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400',
        externalBookingUrl: null,
        rating: 4.4,
        reviewCount: 156,
        popularity: 670,
        isActive: true,
    },
    {
        name: 'Express Wash & Dry',
        category: 'Laundry',
        location: { city: 'Dhaka', area: 'Mirpur' },
        shortDescription: 'Budget-friendly laundry with quality service',
        description: 'Affordable laundry service for students and professionals. Iron service included free with wash.',
        phone: '+880 1777-777777',
        hours: '7 AM - 9 PM',
        imageUrl: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=400',
        externalBookingUrl: null,
        rating: 4.2,
        reviewCount: 98,
        popularity: 345,
        isActive: true,
    },

    // HAIRCUT Category
    {
        name: 'Gentleman\'s Cut',
        category: 'Haircut',
        location: { city: 'Dhaka', area: 'Gulshan' },
        shortDescription: 'Premium men\'s grooming salon',
        description: 'Specialized in modern and classic hairstyles for men. Hot towel shave, beard trimming, and styling services.',
        phone: '+880 1788-888888',
        hours: '10 AM - 9 PM',
        imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400',
        externalBookingUrl: null,
        rating: 4.9,
        reviewCount: 234,
        popularity: 1100,
        isActive: true,
    },
    {
        name: 'Beauty Haven Salon',
        category: 'Haircut',
        location: { city: 'Dhaka', area: 'Dhanmondi' },
        shortDescription: 'Unisex salon with spa services',
        description: 'Complete salon services: haircut, coloring, highlights, spa, facial, and bridal makeup. Expert stylists.',
        phone: '+880 1799-999999',
        hours: '9 AM - 8 PM (Closed Sunday)',
        imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400',
        externalBookingUrl: null,
        rating: 4.7,
        reviewCount: 312,
        popularity: 1450,
        isActive: true,
    },

    // ELECTRONICS Category
    {
        name: 'Tech Hub',
        category: 'Electronics',
        location: { city: 'Dhaka', area: 'Banani' },
        shortDescription: 'Latest gadgets and accessories',
        description: 'Smartphones, laptops, tablets, and accessories. Authorized Apple and Samsung reseller. Trade-in available.',
        phone: '+880 1800-000001',
        hours: '10 AM - 8 PM',
        imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
        externalBookingUrl: 'https://www.daraz.com.bd',
        rating: 4.5,
        reviewCount: 189,
        popularity: 890,
        isActive: true,
    },

    // FASHION Category
    {
        name: 'Trendy Threads',
        category: 'Fashion',
        location: { city: 'Dhaka', area: 'Uttara' },
        shortDescription: 'Latest fashion trends for men and women',
        description: 'Imported and local clothing brands. Casual wear, formal wear, and party outfits. Custom tailoring available.',
        phone: '+880 1811-111112',
        hours: '11 AM - 9 PM',
        imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
        externalBookingUrl: null,
        rating: 4.3,
        reviewCount: 145,
        popularity: 560,
        isActive: true,
    },
];

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Find or create a demo user to own these businesses
        let demoUser = await User.findOne({ email: 'demo@marketplace.com' });
        if (!demoUser) {
            demoUser = await User.create({
                name: 'Demo Owner',
                email: 'demo@marketplace.com',
                password: 'demo123456',
                role: 'user',
            });
            console.log('Created demo user');
        }

        // Clear existing listings
        await Listing.deleteMany({});
        console.log('Cleared existing listings');

        // Add owner to each business
        const businessesWithOwner = sampleBusinesses.map(business => ({
            ...business,
            owner: demoUser._id,
        }));

        // Insert all businesses
        const inserted = await Listing.insertMany(businessesWithOwner);
        console.log(`✅ Successfully added ${inserted.length} businesses to the marketplace!`);

        console.log('\nSample businesses by category:');
        const grouped = inserted.reduce((acc, b) => {
            acc[b.category] = (acc[b.category] || 0) + 1;
            return acc;
        }, {});
        console.log(grouped);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
