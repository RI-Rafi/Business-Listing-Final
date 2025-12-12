import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Discover Local Businesses
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Find the best local businesses in your area
        </p>
        <Link
          to="/listings"
          className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-medium"
        >
          Browse Listings
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">Search & Filter</h3>
          <p className="text-gray-600">
            Find businesses by category, location, or search term
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-4xl mb-4">⭐</div>
          <h3 className="text-xl font-semibold mb-2">Bookmark Favorites</h3>
          <p className="text-gray-600">
            Save your favorite businesses for easy access
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-xl font-semibold mb-2">Add Your Business</h3>
          <p className="text-gray-600">
            Register and list your business to reach more customers
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;

