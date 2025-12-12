import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listingAPI } from '../lib/api';
import useAuthStore from '../state/authStore';

function Profile() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const response = await listingAPI.getMyListings();
        setListings(response.data.listings);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      await listingAPI.deleteListing(id);
      setListings(listings.filter((l) => l._id !== id));
    } catch (err) {
      alert('Failed to delete listing: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
          <p className="text-gray-600">{user?.email}</p>
        </div>

        <div className="mb-6">
          <Link
            to="/listings/new"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Add New Listing
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>
        )}

        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Listings</h2>

          {listings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">You haven't created any listings yet.</p>
              <Link
                to="/listings/new"
                className="text-blue-600 hover:underline font-medium"
              >
                Create your first listing
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <div key={listing._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {listing.imageUrl && (
                    <img
                      src={listing.imageUrl}
                      alt={listing.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                      }}
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {listing.name}
                    </h3>
                    <p className="text-sm text-blue-600 mb-2">{listing.category}</p>
                    <p className="text-sm text-gray-600 mb-4">
                      {listing.location.city}, {listing.location.area}
                    </p>
                    <div className="flex gap-2">
                      <Link
                        to={`/listings/${listing._id}/edit`}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center text-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(listing._id)}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;

