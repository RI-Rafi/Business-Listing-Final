import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { listingAPI } from '../lib/api';
import ListingCard from '../components/ListingCard';
import FilterBar from '../components/FilterBar';
import SuggestedLocationsPanel from '../components/SuggestedLocationsPanel';

function Listings() {
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const observerTarget = useRef(null);

  const fetchListings = useCallback(async (page = 1, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      
      const params = {
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        city: searchParams.get('city') || '',
        area: searchParams.get('area') || '',
        sort: sort,
        page: page.toString(),
        limit: '12',
      };

      const response = await listingAPI.getListings(params);
      
      if (append) {
        setListings(prev => [...prev, ...response.data.listings]);
      } else {
        setListings(response.data.listings);
      }
      
      setPagination(response.data.pagination);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [searchParams, sort]);

  // Initial load and when filters change
  useEffect(() => {
    setListings([]); // Reset listings when filters change
    fetchListings(1, false);
  }, [searchParams, sort]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && pagination && pagination.page < pagination.pages && !loadingMore && !loading) {
          fetchListings(pagination.page + 1, true);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [pagination, loadingMore, loading, fetchListings]);

  const handleSortChange = (e) => {
    setSort(e.target.value);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', e.target.value);
    newParams.set('page', '1');
    window.location.search = newParams.toString();
  };

  if (loading && listings.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading listings...</div>
      </div>
    );
  }

  if (error && listings.length === 0) {
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
              
              {/* Loading indicator for infinite scroll */}
              {loadingMore && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">Loading more...</p>
                </div>
              )}

              {/* Observer target for infinite scroll */}
              {pagination && pagination.page < pagination.pages && (
                <div ref={observerTarget} className="h-10"></div>
              )}

              {/* Show end message when all pages loaded */}
              {pagination && pagination.page >= pagination.pages && listings.length > 0 && (
                <div className="text-center py-8 text-gray-600">
                  <p>You've reached the end of the listings.</p>
                </div>
              )}
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