import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { marketplaceAPI } from '../lib/api';

function MarketplaceCategory() {
    const { category } = useParams();
    const navigate = useNavigate();
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('rating');
    const [selectedArea, setSelectedArea] = useState('');

    const categoryNames = {
        food: 'Food & Restaurants',
        cinema: 'Cinemas & Theaters',
        laundry: 'Laundry Services',
        haircut: 'Salons & Barbers',
        electronics: 'Electronics',
        fashion: 'Fashion',
        market: 'Markets',
    };

    const areas = ['Dhanmondi', 'Gulshan', 'Banani', 'Mirpur', 'Uttara'];

    useEffect(() => {
        fetchBusinesses();
    }, [category, sortBy, selectedArea]);

    const fetchBusinesses = async () => {
        try {
            setLoading(true);
            const params = { sort: sortBy };
            if (selectedArea) params.area = selectedArea;

            const response = await marketplaceAPI.getByCategory(category, params);
            setBusinesses(response.data);
        } catch (error) {
            console.error('Error fetching businesses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewBusiness = async (id, externalUrl) => {
        try {
            await marketplaceAPI.incrementView(id);
            if (externalUrl) {
                window.open(externalUrl, '_blank');
            } else {
                navigate(`/listings/${id}`);
            }
        } catch (error) {
            console.error('Error tracking view:', error);
            if (externalUrl) window.open(externalUrl, '_blank');
            else navigate(`/listings/${id}`);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="text-center text-gray-600">Loading marketplace...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
                    ← Back to Home
                </Link>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    {categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1)}
                </h1>
                <p className="text-gray-600">Browse all providers and book your service</p>
            </div>

            {/* Filters & Sort */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Sort */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sort By
                        </label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="rating">⭐ Top Rated</option>
                            <option value="popular">🔥 Most Popular</option>
                            <option value="newest">🆕 Newest</option>
                        </select>
                    </div>

                    {/* Area Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Filter by Area
                        </label>
                        <select
                            value={selectedArea}
                            onChange={(e) => setSelectedArea(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Areas</option>
                            {areas.map((area) => (
                                <option key={area} value={area}>
                                    {area}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Results */}
            {businesses.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <p className="text-gray-600 text-lg mb-4">
                        No businesses found in this category yet.
                    </p>
                    <p className="text-gray-500">Check back soon!</p>
                </div>
            ) : (
                <>
                    <div className="mb-4 text-gray-600">
                        Showing {businesses.length} {businesses.length === 1 ? 'result' : 'results'}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {businesses.map((business) => (
                            <div
                                key={business._id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                            >
                                {/* Image */}
                                {business.imageUrl && (
                                    <img
                                        src={business.imageUrl}
                                        alt={business.name}
                                        className="w-full h-48 object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/400x300?text=' + business.category;
                                        }}
                                    />
                                )}

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        {business.name}
                                    </h3>

                                    {/* Rating & Popularity */}
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="flex items-center">
                                            <span className="text-yellow-500 mr-1">⭐</span>
                                            <span className="font-semibold text-gray-700">
                                                {business.rating ? business.rating.toFixed(1) : 'New'}
                                            </span>
                                            {business.reviewCount > 0 && (
                                                <span className="text-gray-500 text-sm ml-1">
                                                    ({business.reviewCount})
                                                </span>
                                            )}
                                        </div>
                                        {business.popularity > 0 && (
                                            <div className="text-sm text-gray-600">
                                                👁️ {business.popularity} views
                                            </div>
                                        )}
                                    </div>

                                    {/* Location */}
                                    <p className="text-gray-600 mb-3">
                                        📍 {business.location.area}, {business.location.city}
                                    </p>

                                    {/* Description */}
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {business.shortDescription || business.description}
                                    </p>

                                    {/* Phone */}
                                    <p className="text-gray-700 mb-4">
                                        📞 {business.phone}
                                    </p>

                                    {/* Book Button */}
                                    <button
                                        onClick={() => handleViewBusiness(business._id, business.externalBookingUrl)}
                                        className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        {business.externalBookingUrl ? '🔗 Book Now' : '📋 View Details'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default MarketplaceCategory;
