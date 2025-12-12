import dotenv from 'dotenv';
import { connectDB } from '../src/config/db.js';
import User from '../src/models/User.js';
import Category from '../src/models/Category.js';
import Location from '../src/models/Location.js';
import Listing from '../src/models/Listing.js';

dotenv.config();

const categories = [
  { key: 'Haircut', label: 'Haircut & Salon' },
  { key: 'Laundry', label: 'Laundry Services' },
  { key: 'Electronics', label: 'Electronics & Repair' },
  { key: 'Fashion', label: 'Fashion & Clothing' },
  { key: 'Market', label: 'Market & Grocery' },
];

const locations = [
  { city: 'Dhaka', area: 'Gulshan' },
  { city: 'Dhaka', area: 'Dhanmondi' },
  { city: 'Dhaka', area: 'Banani' },
  { city: 'Dhaka', area: 'Uttara' },
  { city: 'Dhaka', area: 'Mirpur' },
  { city: 'Chittagong', area: 'Agrabad' },
  { city: 'Chittagong', area: 'Pahartali' },
  { city: 'Sylhet', area: 'Zindabazar' },
  { city: 'Sylhet', area: 'Dargah Gate' },
];

const sampleListings = [
  {
    name: 'Elite Hair Salon',
    category: 'Haircut',
    location: { city: 'Dhaka', area: 'Gulshan' },
    shortDescription: 'Premium hair cutting and styling services',
    description: 'Professional hair salon offering cutting-edge styles, coloring, and treatments. Experienced stylists and modern facilities.',
    phone: '+8801712345678',
    hours: 'Mon-Sat: 9AM-8PM, Sun: 10AM-6PM',
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400',
  },
  {
    name: 'Quick Clean Laundry',
    category: 'Laundry',
    location: { city: 'Dhaka', area: 'Dhanmondi' },
    shortDescription: 'Fast and reliable laundry services',
    description: 'Same-day laundry service with pickup and delivery. Dry cleaning, ironing, and fabric care available.',
    phone: '+8801712345679',
    hours: 'Daily: 8AM-8PM',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
  },
  {
    name: 'TechFix Electronics',
    category: 'Electronics',
    location: { city: 'Dhaka', area: 'Banani' },
    shortDescription: 'Expert electronics repair and sales',
    description: 'Repair services for phones, laptops, and home appliances. Also sell new and refurbished electronics.',
    phone: '+8801712345680',
    hours: 'Mon-Sat: 10AM-7PM',
    imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
  },
  {
    name: 'Fashion Forward',
    category: 'Fashion',
    location: { city: 'Dhaka', area: 'Uttara' },
    shortDescription: 'Trendy clothing and accessories',
    description: 'Latest fashion trends for men and women. Quality garments and accessories at affordable prices.',
    phone: '+8801712345681',
    hours: 'Daily: 10AM-9PM',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
  },
  {
    name: 'Fresh Market',
    category: 'Market',
    location: { city: 'Dhaka', area: 'Mirpur' },
    shortDescription: 'Fresh produce and daily essentials',
    description: 'Wide variety of fresh vegetables, fruits, meat, and daily essentials. Competitive prices and quality products.',
    phone: '+8801712345682',
    hours: 'Daily: 6AM-10PM',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
  },
  {
    name: 'Style Studio',
    category: 'Haircut',
    location: { city: 'Dhaka', area: 'Dhanmondi' },
    shortDescription: 'Modern hair styling and beauty services',
    description: 'Contemporary salon with expert stylists. Haircuts, coloring, treatments, and beauty services.',
    phone: '+8801712345683',
    hours: 'Mon-Sat: 9AM-7PM',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
  },
  {
    name: 'Wash & Fold Express',
    category: 'Laundry',
    location: { city: 'Chittagong', area: 'Agrabad' },
    shortDescription: 'Express laundry service',
    description: 'Quick and efficient laundry service. Pickup and delivery available. Special rates for bulk orders.',
    phone: '+8801712345684',
    hours: 'Daily: 7AM-9PM',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
  },
  {
    name: 'Gadget Hub',
    category: 'Electronics',
    location: { city: 'Dhaka', area: 'Gulshan' },
    shortDescription: 'Electronics store and service center',
    description: 'Authorized dealer for major brands. Sales, service, and warranty support for all electronics.',
    phone: '+8801712345685',
    hours: 'Mon-Sat: 11AM-8PM',
    imageUrl: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400',
  },
  {
    name: 'Trendy Threads',
    category: 'Fashion',
    location: { city: 'Sylhet', area: 'Zindabazar' },
    shortDescription: 'Fashion boutique for all ages',
    description: 'Curated collection of fashionable clothing. Latest trends and classic styles for the whole family.',
    phone: '+8801712345686',
    hours: 'Daily: 11AM-9PM',
    imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
  },
  {
    name: 'Green Grocer',
    category: 'Market',
    location: { city: 'Chittagong', area: 'Pahartali' },
    shortDescription: 'Organic and fresh groceries',
    description: 'Organic vegetables, fruits, and grocery items. Farm-fresh produce delivered daily.',
    phone: '+8801712345687',
    hours: 'Daily: 5AM-10PM',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
  },
  {
    name: 'Classic Cuts',
    category: 'Haircut',
    location: { city: 'Sylhet', area: 'Dargah Gate' },
    shortDescription: 'Traditional and modern haircuts',
    description: 'Experienced barbers offering classic and modern haircuts. Beard trimming and grooming services.',
    phone: '+8801712345688',
    hours: 'Mon-Sat: 8AM-8PM',
    imageUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b7d?w=400',
  },
  {
    name: 'Clean & Press',
    category: 'Laundry',
    location: { city: 'Dhaka', area: 'Uttara' },
    shortDescription: 'Professional dry cleaning',
    description: 'Expert dry cleaning and laundry services. Special care for delicate fabrics and formal wear.',
    phone: '+8801712345689',
    hours: 'Mon-Sat: 9AM-7PM',
    imageUrl: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400',
  },
  {
    name: 'Smart Devices',
    category: 'Electronics',
    location: { city: 'Dhaka', area: 'Mirpur' },
    shortDescription: 'Smartphones and accessories',
    description: 'Latest smartphones, tablets, and accessories. Competitive prices and genuine products.',
    phone: '+8801712345690',
    hours: 'Daily: 10AM-9PM',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
  },
  {
    name: 'Urban Fashion',
    category: 'Fashion',
    location: { city: 'Dhaka', area: 'Banani' },
    shortDescription: 'Urban streetwear and casual fashion',
    description: 'Trendy streetwear and casual clothing. Brands and local designs for the modern lifestyle.',
    phone: '+8801712345691',
    hours: 'Daily: 11AM-10PM',
    imageUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400',
  },
  {
    name: 'Daily Mart',
    category: 'Market',
    location: { city: 'Dhaka', area: 'Gulshan' },
    shortDescription: 'Convenience store with essentials',
    description: 'One-stop shop for daily essentials. Snacks, beverages, household items, and more.',
    phone: '+8801712345692',
    hours: 'Daily: 7AM-11PM',
    imageUrl: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?w=400',
  },
  {
    name: 'Hair Art Studio',
    category: 'Haircut',
    location: { city: 'Chittagong', area: 'Agrabad' },
    shortDescription: 'Artistic hair design and coloring',
    description: 'Creative hair designs, coloring, and treatments. Transform your look with our expert stylists.',
    phone: '+8801712345693',
    hours: 'Mon-Sat: 10AM-8PM',
    imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400',
  },
  {
    name: 'Eco Wash',
    category: 'Laundry',
    location: { city: 'Sylhet', area: 'Zindabazar' },
    shortDescription: 'Eco-friendly laundry service',
    description: 'Environmentally friendly laundry service using green detergents. Same-day service available.',
    phone: '+8801712345694',
    hours: 'Daily: 8AM-8PM',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
  },
  {
    name: 'Repair Pro',
    category: 'Electronics',
    location: { city: 'Dhaka', area: 'Dhanmondi' },
    shortDescription: 'Professional repair services',
    description: 'Expert repair for all electronics. Fast turnaround and warranty on repairs.',
    phone: '+8801712345695',
    hours: 'Mon-Sat: 9AM-6PM',
    imageUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400',
  },
  {
    name: 'Boutique Elegance',
    category: 'Fashion',
    location: { city: 'Dhaka', area: 'Gulshan' },
    shortDescription: 'Elegant fashion for special occasions',
    description: 'Designer clothing and accessories for special events. Custom tailoring available.',
    phone: '+8801712345696',
    hours: 'Mon-Sat: 10AM-8PM',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
  },
  {
    name: 'Super Mart',
    category: 'Market',
    location: { city: 'Sylhet', area: 'Dargah Gate' },
    shortDescription: 'Supermarket with wide selection',
    description: 'Large supermarket with extensive selection of groceries, household items, and more.',
    phone: '+8801712345697',
    hours: 'Daily: 8AM-10PM',
    imageUrl: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?w=400',
  },
  {
    name: 'Gentleman\'s Cut',
    category: 'Haircut',
    location: { city: 'Dhaka', area: 'Banani' },
    shortDescription: 'Men\'s grooming and styling',
    description: 'Premium men\'s salon with traditional and modern services. Hot towel shaves and styling.',
    phone: '+8801712345698',
    hours: 'Mon-Sat: 9AM-7PM',
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400',
  },
  {
    name: 'Wash House',
    category: 'Laundry',
    location: { city: 'Dhaka', area: 'Mirpur' },
    shortDescription: 'Self-service and full-service laundry',
    description: 'Self-service washing machines and full-service laundry. Open 24/7 for self-service.',
    phone: '+8801712345699',
    hours: '24/7 Self-service, Full-service: 8AM-8PM',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
  },
];

const seed = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Location.deleteMany({});
    await Listing.deleteMany({});

    // Create admin user
    console.log('Creating admin user...');
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });

    // Create regular users
    console.log('Creating regular users...');
    const user1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'user123',
    });

    const user2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'user123',
    });

    // Create categories
    console.log('Creating categories...');
    await Category.insertMany(categories);

    // Create locations
    console.log('Creating locations...');
    await Location.insertMany(locations);

    // Create listings
    console.log('Creating listings...');
    const users = [user1, user2, admin];
    for (let i = 0; i < sampleListings.length; i++) {
      const listingData = {
        ...sampleListings[i],
        owner: users[i % users.length]._id,
      };
      await Listing.create(listingData);
    }

    console.log('Seed completed successfully!');
    console.log(`Created:`);
    console.log(`- 1 admin user (admin@example.com / admin123)`);
    console.log(`- 2 regular users (john@example.com / user123, jane@example.com / user123)`);
    console.log(`- ${categories.length} categories`);
    console.log(`- ${locations.length} locations`);
    console.log(`- ${sampleListings.length} listings`);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
