import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { listingAPI } from '../lib/api';
import ListingCard from '../components/ListingCard';
import FilterBar from '../components/FilterBar';
import SuggestedLocationsPanel from '../components/SuggestedLocationsPanel';
import Pagination from '../components/Pagination';

function Listings() {
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const params = {
          search: searchParams.get('search') || '',
          category: searchParams.get('category') || '',
          city: searchParams.get('city') || '',
          area: searchParams.get('area') || '',
          sort: sort,
          page: searchParams.get('page') || '1',
          limit: '12',
        };

        const response = await listingAPI.getListings(params);
        setListings(response.data.listings);
        setPagination(response.data.pagination);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [searchParams, sort]);

  const handleSortChange = (e) => {
    setSort(e.target.value);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', e.target.value);
    newParams.set('page', '1');
    window.location.search = newParams.toString();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading listings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Business Listings</h1>
            <select
              value={sort}
              onChange={handleSortChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="az">A-Z</option>
            </select>
          </div>

          <FilterBar />

          {listings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No listings found.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <ListingCard key={listing._id} listing={listing} />
                ))}
              </div>
              {pagination && <Pagination pagination={pagination} />}
            </>
          )}
        </div>

        <div className="lg:w-80">
          <SuggestedLocationsPanel />
        </div>
      </div>
    </div>
  );
}

export default Listings;

