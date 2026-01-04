import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { listingAPI, userAPI, cartAPI } from '../lib/api';
import useAuthStore from '../state/authStore';
import DeliveryModal from '../components/DeliveryModal';
import OrderingFlow from '../components/OrderingFlow';

function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showOrderingFlow, setShowOrderingFlow] = useState(false);

  // Booking State
  const [bookingData, setBookingData] = useState({
    scheduledDate: '',
    scheduledTime: '',
    quantity: 1,
    notes: ''
  });
  const [addingToCart, setAddingToCart] = useState(false);

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
      toast.success(response.data.bookmarked ? 'Bookmark added!' : 'Bookmark removed');
    } catch (err) {
      toast.error('Failed to toggle bookmark: ' + err.message);
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
      toast.success('Listing deleted successfully');
      navigate('/listings');
    } catch (err) {
      toast.error('Failed to delete listing: ' + err.message);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (!bookingData.scheduledDate || !bookingData.scheduledTime) {
      toast.error('Please select a date and time');
      return;
    }

    try {
      setAddingToCart(true);
      await cartAPI.addToCart({
        listingId: id,
        serviceName: listing.name,
        price: 50, // Default price
        ...bookingData
      });
      toast.success('✅ Added to cart!');
      // Wait a moment to show the toast before navigating
      setTimeout(() => {
        navigate('/cart');
      }, 500);
    } catch (err) {
      toast.error('Failed to add to cart: ' + err.message);
      console.error('Cart error:', err);
    } finally {
      setAddingToCart(false);
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
                  className={`px-4 py-2 rounded-lg ${isBookmarked
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2 text-lg">Contact & Hours</h3>
                <div className="space-y-2">
                  <p className="text-gray-600"><span className="font-medium">Phone:</span> {listing.phone}</p>
                  {listing.hours && (
                    <div>
                      <span className="font-medium text-gray-600">Hours:</span>
                      <p className="text-gray-600 whitespace-pre-line">{listing.hours}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Booking Section - Only for non-owners */}
              {!isOwner && (
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <h3 className="font-bold text-gray-800 mb-4 text-lg">📅 Book Service</h3>
                  <form onSubmit={handleAddToCart} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Date</label>
                        <input
                          type="date"
                          required
                          className="w-full px-3 py-2 border rounded-lg"
                          value={bookingData.scheduledDate}
                          onChange={e => setBookingData({ ...bookingData, scheduledDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Time</label>
                        <input
                          type="time"
                          required
                          className="w-full px-3 py-2 border rounded-lg"
                          value={bookingData.scheduledTime}
                          onChange={e => setBookingData({ ...bookingData, scheduledTime: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        className="w-full px-3 py-2 border rounded-lg"
                        value={bookingData.quantity}
                        onChange={e => setBookingData({ ...bookingData, quantity: e.target.value })}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={addingToCart}
                      className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {addingToCart ? 'Adding...' : 'Add to Cart 🛒'}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {listing.deliveryPlatforms && listing.deliveryPlatforms.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Available on:</h3>
                <div className="flex flex-wrap gap-2">
                  {listing.deliveryPlatforms.map((platform, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-green-100 text-green-800 rounded-lg"
                    >
                      {platform.name}
                    </span>
                  ))}
                </div>

                {/* Smart Ordering Button */}
                <button
                  onClick={() => setShowOrderingFlow(true)}
                  className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg"
                >
                  🚗 Order for Delivery
                </button>
              </div>
            )}

            {/* For businesses without menu but want ordering (Electronics, etc.) */}
            {!listing.deliveryPlatforms?.length && (listing.category === 'Electronics' || listing.category === 'Fashion') && (
              <button
                onClick={() => setShowOrderingFlow(true)}
                className="mb-6 w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all"
              >
                📦 Order / Request Delivery
              </button>
            )}

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

      {/* Smart Ordering Flow Modal */}
      {showOrderingFlow && listing && (
        <OrderingFlow
          business={listing}
          onClose={() => setShowOrderingFlow(false)}
        />
      )}

      {/* Delivery Modal */}
      {showDeliveryModal && listing && (
        <DeliveryModal
          business={listing}
          onClose={() => setShowDeliveryModal(false)}
          onDeliverySelect={(platform) => {
            console.log('Selected platform:', platform);
          }}
        />
      )}
    </div>
  );
}

export default ListingDetail;
