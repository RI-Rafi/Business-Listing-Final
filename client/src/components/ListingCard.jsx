import { Link } from 'react-router-dom';

function ListingCard({ listing }) {
  return (
    <Link
      to={`/listings/${listing._id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
    >
      {listing.imageUrl ? (
        <img
          src={listing.imageUrl}
          alt={listing.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
          }}
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400">No Image</span>
        </div>
      )}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{listing.name}</h3>
        <p className="text-sm text-blue-600 mb-2">{listing.category}</p>
        <p className="text-sm text-gray-600 mb-2">
          {listing.location.city}, {listing.location.area}
        </p>
        <p className="text-gray-700 text-sm line-clamp-2">{listing.shortDescription}</p>
      </div>
    </Link>
  );
}

export default ListingCard;

