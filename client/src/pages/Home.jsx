import { Link } from 'react-router-dom';

function Home() {
  const categories = [
    { id: 'food', name: 'Food & Restaurants', icon: '🍔', description: 'Find the best eateries and food services', color: 'bg-orange-50 border-orange-200' },
    { id: 'cinema', name: 'Cinema & Theaters', icon: '🎬', description: 'Book movie tickets and entertainment', color: 'bg-purple-50 border-purple-200' },
    { id: 'laundry', name: 'Laundry Services', icon: '👔', description: 'Professional cleaning and laundry', color: 'bg-blue-50 border-blue-200' },
    { id: 'haircut', name: 'Salons & Barbers', icon: '💇', description: 'Hair styling and grooming services', color: 'bg-pink-50 border-pink-200' },
    { id: 'electronics', name: 'Electronics', icon: '📱', description: 'Latest gadgets and devices', color: 'bg-gray-50 border-gray-200' },
    { id: 'fashion', name: 'Fashion', icon: '👗', description: 'Clothing and accessories', color: 'bg-red-50 border-red-200' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Welcome to Business Marketplace
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Discover and book services from top-rated providers
          </p>
          <Link
            to="/listings"
            className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Browse All Listings
          </Link>
        </div>
      </div>

      {/* Categories Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Explore Service Categories
          </h2>
          <p className="text-gray-600 text-lg">
            Click on any category to find the best providers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/marketplace/${category.id}`}
              className={`${category.color} border-2 rounded-xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer`}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{category.icon}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  {category.name}
                </h3>
                <p className="text-gray-600">
                  {category.description}
                </p>
                <div className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Explore →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Top Rated Providers
              </h3>
              <p className="text-gray-600">
                Browse verified businesses with real customer ratings
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Easy Filtering
              </h3>
              <p className="text-gray-600">
                Sort by rating, popularity, or location to find what you need
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Quick Booking
              </h3>
              <p className="text-gray-600">
                Book services instantly with one click
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
