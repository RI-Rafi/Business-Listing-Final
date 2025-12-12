import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { listingAPI, userAPI } from '../lib/api';
import useAuthStore from '../state/authStore';

function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await listingAPI.getListing(id);
        setListing(response.data.listing);
        setIsBookmarked(response.data.listing.isBookmarked || false);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleBookmark = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setBookmarking(true);
      const response = await userAPI.toggleBookmark(id);
      setIsBookmarked(response.data.bookmarked);
    } catch (err) {
      alert('Failed to toggle bookmark: ' + err.message);
    } finally {
      setBookmarking(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      await listingAPI.deleteListing(id);
      navigate('/listings');
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

  if (error || !listing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">Error: {error || 'Listing not found'}</div>
        <Link to="/listings" className="text-blue-600 hover:underline">
          Back to listings
        </Link>
      </div>
    );
  }

  const isOwner = user && user.id === listing.owner._id;
  const isAdmin = user && user.role === 'admin';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <Link to="/listings" className="text-blue-600 hover:underline">
            ← Back to listings
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {listing.imageUrl && (
            <img
              src={listing.imageUrl}
              alt={listing.name}
              className="w-full h-96 object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
              }}
            />
          )}

          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{listing.name}</h1>
                <p className="text-blue-600 font-medium mb-2">{listing.category}</p>
                <p className="text-gray-600">
                  {listing.location.city}, {listing.location.area}
                </p>
              </div>

              {user && (
                <button
                  onClick={handleBookmark}
                  disabled={bookmarking}
                  className={`px-4 py-2 rounded-lg ${
                    isBookmarked
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {isBookmarked ? '★ Bookmarked' : '☆ Bookmark'}
                </button>
              )}
            </div>

            <div className="border-t border-b py-4 my-4">
              <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Phone</h3>
                <p className="text-gray-600">{listing.phone}</p>
              </div>
              {listing.hours && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Hours</h3>
                  <p className="text-gray-600 whitespace-pre-line">{listing.hours}</p>
                </div>
              )}
            </div>

            {(isOwner || isAdmin) && (
              <div className="flex gap-4 mt-6 pt-6 border-t">
                <Link
                  to={`/listings/${id}/edit`}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Edit Listing
                </Link>
                <button
                  onClick={handleDelete}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Listing
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingDetail;

