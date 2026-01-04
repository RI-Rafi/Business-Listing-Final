import { useState } from 'react';
import '../styles/index.css';

// DEMO DATA - Replace with API calls later
const DEMO_SERVICES = [
    { _id: '1', name: 'Salon Services', icon: '💇', description: 'Haircuts, styling, and beauty services' },
    { _id: '2', name: 'Restaurants', icon: '🍽️', description: 'Dining and food delivery' },
    { _id: '3', name: 'Healthcare', icon: '🏥', description: 'Medical consultations and treatments' },
    { _id: '4', name: 'Home Services', icon: '🏠', description: 'Cleaning, repairs, and maintenance' },
    { _id: '5', name: 'Fitness', icon: '💪', description: 'Gym, yoga, and personal training' },
    { _id: '6', name: 'Education', icon: '📚', description: 'Tutoring and courses' },
];

const DEMO_BUSINESSES = [
    {
        _id: 'b1',
        name: 'Premium Hair Salon',
        serviceCategory: '1',
        averageRating: 4.8,
        totalReviews: 156,
        address: { city: 'Dhaka', area: 'Dhanmondi' },
        services: [
            { id: 's1', name: 'Haircut', price: 500, duration: 60 },
            { id: 's2', name: 'Hair Coloring', price: 2000, duration: 120 },
            { id: 's3', name: 'Facial', price: 1200, duration: 90 },
        ]
    },
    {
        _id: 'b2',
        name: 'Style Studio',
        serviceCategory: '1',
        averageRating: 4.5,
        totalReviews: 89,
        address: { city: 'Dhaka', area: 'Gulshan' },
        services: [
            { id: 's4', name: 'Haircut & Styling', price: 800, duration: 45 },
            { id: 's5', name: 'Beard Trim', price: 300, duration: 30 },
        ]
    },
    {
        _id: 'b3',
        name: 'Tasty Bites Restaurant',
        serviceCategory: '2',
        averageRating: 4.7,
        totalReviews: 234,
        address: { city: 'Dhaka', area: 'Banani' },
        services: [
            { id: 's6', name: 'Lunch Buffet', price: 600, duration: 90 },
            { id: 's7', name: 'Dinner Set', price: 900, duration: 120 },
        ]
    },
];

function MarketplacePage() {
    const [selectedCategory, setSelectedCategory] = useState('1');
    const [searchQuery, setSearchQuery] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [minRating, setMinRating] = useState('');
    const [selectedArea, setSelectedArea] = useState('');

    // Filter businesses
    const filteredBusinesses = DEMO_BUSINESSES.filter(business => {
        if (business.serviceCategory !== selectedCategory) return false;
        if (searchQuery && !business.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (minPrice && business.services.some(s => s.price < Number(minPrice))) return false;
        if (maxPrice && business.services.every(s => s.price > Number(maxPrice))) return false;
        if (minRating && business.averageRating < Number(minRating)) return false;
        if (selectedArea && business.address.area !== selectedArea) return false;
        return true;
    });

    const selectedCategoryName = DEMO_SERVICES.find(s => s._id === selectedCategory)?.name || 'Services';

    return (
        <div className="container" style={{ padding: '2rem' }}>
            {/* Header */}
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Service Marketplace
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                Browse and book services from verified providers
            </p>

            {/* Category Selection */}
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                    Select Category:
                </h2>
                <div className="grid grid-cols-3">
                    {DEMO_SERVICES.map(service => (
                        <div
                            key={service._id}
                            onClick={() => setSelectedCategory(service._id)}
                            className="card"
                            style={{
                                cursor: 'pointer',
                                borderWidth: '2px',
                                borderColor: selectedCategory === service._id ? '#2563eb' : 'transparent',
                                backgroundColor: selectedCategory === service._id ? '#eff6ff' : 'white'
                            }}
                        >
                            <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '0.5rem' }}>
                                {service.icon}
                            </div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', textAlign: 'center' }}>
                                {service.name}
                            </h3>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', textAlign: 'center', marginTop: '0.5rem' }}>
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                    🔍 Filters
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                            Search
                        </label>
                        <input
                            type="text"
                            placeholder="Search businesses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                            Min Price
                        </label>
                        <input
                            type="number"
                            placeholder="Min price"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                            Max Price
                        </label>
                        <input
                            type="number"
                            placeholder="Max price"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                            Min Rating
                        </label>
                        <select value={minRating} onChange={(e) => setMinRating(e.target.value)}>
                            <option value="">All Ratings</option>
                            <option value="4">4+ Stars</option>
                            <option value="4.5">4.5+ Stars</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                            Area
                        </label>
                        <select value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)}>
                            <option value="">All Areas</option>
                            <option value="Dhanmondi">Dhanmondi</option>
                            <option value="Gulshan">Gulshan</option>
                            <option value="Banani">Banani</option>
                        </select>
                    </div>
                </div>

                <button
                    onClick={() => {
                        setSearchQuery('');
                        setMinPrice('');
                        setMaxPrice('');
                        setMinRating('');
                        setSelectedArea('');
                    }}
                    className="btn-secondary"
                    style={{ marginTop: '1rem' }}
                >
                    Clear Filters
                </button>
            </div>

            {/* Business Listings */}
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
                {selectedCategoryName} ({filteredBusinesses.length})
            </h2>

            {filteredBusinesses.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ fontSize: '1.25rem', color: '#6b7280' }}>No businesses found</p>
                    <p style={{ color: '#9ca3af', marginTop: '0.5rem' }}>Try adjusting your filters</p>
                </div>
            ) : (
                <div className="grid grid-cols-3">
                    {filteredBusinesses.map(business => (
                        <div key={business._id} className="card">
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                {business.name}
                            </h3>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <span style={{ color: '#facc15' }}>⭐ {business.averageRating}</span>
                                <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                    ({business.totalReviews} reviews)
                                </span>
                            </div>

                            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
                                📍 {business.address.area}, {business.address.city}
                            </p>

                            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                    Services:
                                </h4>
                                {business.services.map(service => (
                                    <div key={service.id} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '0.5rem',
                                        backgroundColor: '#f9fafb',
                                        borderRadius: '0.25rem',
                                        marginBottom: '0.5rem'
                                    }}>
                                        <div>
                                            <p style={{ fontSize: '0.875rem', fontWeight: '500' }}>{service.name}</p>
                                            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{service.duration} min</p>
                                        </div>
                                        <p style={{ fontSize: '1rem', fontWeight: 'bold', color: '#2563eb' }}>
                                            ${service.price}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <button className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MarketplacePage;
