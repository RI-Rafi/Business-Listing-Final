import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mapAPI, metaAPI } from '../lib/api';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to fit map bounds to markers
function FitBounds({ bounds }) {
  const map = useMap();
  
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  
  return null;
}

function MapPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [missingGeoCount, setMissingGeoCount] = useState(0);
  
  // Filter state
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
  const [selectedArea, setSelectedArea] = useState(searchParams.get('area') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'rating');
  
  const mapRef = useRef(null);

  // Fetch categories and locations
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [catsRes, locsRes] = await Promise.all([
          metaAPI.getCategories(),
          metaAPI.getLocations(),
        ]);
        setCategories(catsRes.data.categories);
        setLocations(locsRes.data.locations);
      } catch (error) {
        console.error('Failed to load meta data:', error);
      }
    };
    fetchMeta();
  }, []);

  // Fetch map listings
  useEffect(() => {
    fetchMapListings();
  }, [selectedCategory, selectedCity, selectedArea, minPrice, maxPrice, sortBy]);

  const fetchMapListings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = { sort: sortBy };
      if (selectedCategory) params.category = selectedCategory;
      if (selectedCity) params.city = selectedCity;
      if (selectedArea) params.area = selectedArea;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      // Update URL params
      const newParams = new URLSearchParams(params);
      setSearchParams(newParams);

      const response = await mapAPI.getMapListings(params);
      setListings(response.data.listings || []);
      setMissingGeoCount(response.data.missingGeoCount || 0);
    } catch (err) {
      console.error('Error fetching map listings:', err);
      setError(err.message || 'Failed to load map data');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    if (key === 'category') setSelectedCategory(value);
    else if (key === 'city') {
      setSelectedCity(value);
      setSelectedArea(''); // Reset area when city changes
    }
    else if (key === 'area') setSelectedArea(value);
    else if (key === 'minPrice') setMinPrice(value);
    else if (key === 'maxPrice') setMaxPrice(value);
    else if (key === 'sort') setSortBy(value);
  };

  const cities = [...new Set(locations.map((l) => l.city))].sort();
  const areasForCity = selectedCity
    ? [...new Set(locations.filter((l) => l.city === selectedCity).map((l) => l.area))].sort()
    : [];

  // Calculate bounds for all markers
  const bounds = listings
    .filter((listing) => listing.geo?.coordinates && listing.geo.coordinates.length === 2)
    .map((listing) => [listing.geo.coordinates[1], listing.geo.coordinates[0]]); // [lat, lng]

  // Default center (Dhaka, Bangladesh)
  const defaultCenter = [23.8103, 90.4125];
  const center = bounds.length > 0 
    ? [bounds.reduce((sum, [lat]) => sum + lat, 0) / bounds.length, 
       bounds.reduce((sum, [, lng]) => sum + lng, 0) / bounds.length]
    : defaultCenter;

  // Use API key from environment or fallback (should be in .env.local)
  const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY || '7782bcd1246c4191ae902b49a7b0a967';
  const tileUrl = `https://maps.geoapify.com/v1/tile/osm-carto/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_API_KEY}`;

  return (
    <div className="h-full flex flex-col">
      {/* Filter Panel */}
      <div className="bg-white shadow-md p-4 z-10 flex-shrink-0">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.key} value={cat.key}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Area
              </label>
              <select
                value={selectedArea}
                onChange={(e) => handleFilterChange('area', e.target.value)}
                disabled={!selectedCity}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100"
              >
                <option value="">All Areas</option>
                {areasForCity.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Price
              </label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                placeholder="Min"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Price
              </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                placeholder="Max"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort
              </label>
              <select
                value={sortBy}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="rating">Top Rated</option>
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
            <div className="text-lg text-gray-600">Loading map...</div>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
            <div className="text-center">
              <div className="text-red-600 mb-2">Error: {error}</div>
              <button
                onClick={fetchMapListings}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <>
            <MapContainer
              center={center}
              zoom={bounds.length > 0 ? 12 : 10}
              style={{ height: '100%', width: '100%' }}
              ref={mapRef}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url={tileUrl}
              />
              {listings
                .filter((listing) => listing.geo?.coordinates && listing.geo.coordinates.length === 2)
                .map((listing) => (
                  <Marker
                    key={listing._id}
                    position={[listing.geo.coordinates[1], listing.geo.coordinates[0]]}
                  >
                    <Popup>
                      <div className="p-2 min-w-[200px]">
                        <h3 className="font-bold text-lg mb-1">{listing.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Category:</strong> {listing.category}
                        </p>
                        {listing.address && (
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Address:</strong> {listing.address}
                          </p>
                        )}
                        {listing.priceHint && (
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Starting Price:</strong> ৳{listing.priceHint}
                          </p>
                        )}
                        {listing.rating > 0 && (
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Rating:</strong> ⭐ {listing.rating.toFixed(1)} ({listing.reviewCount} reviews)
                          </p>
                        )}
                        <button
                          onClick={() => navigate(`/listings/${listing._id}`)}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold"
                        >
                          View Details
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              <FitBounds bounds={bounds} />
            </MapContainer>

            {/* Info Panel */}
            <div className="absolute top-4 right-4 bg-white shadow-lg rounded-lg p-4 z-30 max-w-xs">
              <h3 className="font-bold text-lg mb-2">Map Info</h3>
              <p className="text-sm text-gray-600 mb-1">
                <strong>{listings.length}</strong> business{listings.length !== 1 ? 'es' : ''} shown
              </p>
              {missingGeoCount > 0 && (
                <p className="text-sm text-yellow-600">
                  ⚠️ {missingGeoCount} business{missingGeoCount !== 1 ? 'es' : ''} missing coordinates
                </p>
              )}
              {listings.length === 0 && !loading && (
                <p className="text-sm text-gray-500 mt-2">
                  No businesses to show on map for this selection.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MapPage;
