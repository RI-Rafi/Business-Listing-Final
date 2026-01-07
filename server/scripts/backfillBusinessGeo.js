import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Listing from '../src/models/Listing.js';
import { geocodeAddress, buildAddressString } from '../src/services/geoapify.service.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI not set in environment variables');
  process.exit(1);
}

if (!process.env.GEOAPIFY_API_KEY) {
  console.error('❌ GEOAPIFY_API_KEY not set in environment variables');
  process.exit(1);
}

// Rate limiting: delay between geocoding requests (ms)
const DELAY_MS = 200; // 200ms = ~5 requests per second (well under free tier limits)

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function backfillGeo() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find listings missing coordinates
    const listings = await Listing.find({
      $or: [
        { 'geo.coordinates': { $exists: false } },
        { 'geo.coordinates': null },
        { 'geo.coordinates': [] },
      ],
      isActive: true,
    }).lean();

    console.log(`\n📊 Found ${listings.length} listings missing coordinates`);

    if (listings.length === 0) {
      console.log('✅ All listings already have coordinates');
      await mongoose.disconnect();
      return;
    }

    let successCount = 0;
    let failCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < listings.length; i++) {
      const listing = listings[i];
      const address = buildAddressString(listing.location);

      if (!address || address.trim().length === 0) {
        console.log(`⏭️  [${i + 1}/${listings.length}] Skipping "${listing.name}" - no address`);
        skippedCount++;
        continue;
      }

      console.log(`\n[${i + 1}/${listings.length}] Geocoding: "${listing.name}"`);
      console.log(`   Address: ${address}`);

      const coords = await geocodeAddress(address);

      if (coords) {
        await Listing.findByIdAndUpdate(listing._id, {
          geo: {
            type: 'Point',
            coordinates: [coords.lng, coords.lat], // MongoDB GeoJSON: [lng, lat]
          },
        });

        console.log(`   ✅ Success: [${coords.lat}, ${coords.lng}]`);
        successCount++;
      } else {
        console.log(`   ❌ Failed to geocode`);
        failCount++;
      }

      // Rate limiting delay
      if (i < listings.length - 1) {
        await delay(DELAY_MS);
      }
    }

    console.log('\n📈 Summary:');
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Failed: ${failCount}`);
    console.log(`   ⏭️  Skipped: ${skippedCount}`);
    console.log(`   📊 Total: ${listings.length}`);

    await mongoose.disconnect();
    console.log('\n✅ Backfill complete!');
  } catch (error) {
    console.error('❌ Error during backfill:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

backfillGeo();
