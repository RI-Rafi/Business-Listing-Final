import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { metaAPI } from '../lib/api';

function SuggestedLocationsPanel() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await metaAPI.getLocations();
        setLocations(response.data.locations);
      } catch (error) {
        console.error('Failed to load locations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  const handleLocationClick = (city, area) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('city', city);
    newParams.set('area', area);
    newParams.set('page', '1');
    navigate(`/listings?${newParams.toString()}`);
  };

  // Group locations by city
  const groupedLocations = locations.reduce((acc, loc) => {
    if (!acc[loc.city]) {
      acc[loc.city] = [];
    }
    acc[loc.city].push(loc.area);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <p>Loading locations...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md sticky top-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Suggested Locations</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-600 hover:text-gray-800"
        >
          {isOpen ? '−' : '+'}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-4">
          {Object.entries(groupedLocations).map(([city, areas]) => (
            <div key={city}>
              <h4 className="font-medium text-gray-700 mb-2">{city}</h4>
              <div className="flex flex-wrap gap-2">
                {areas.map((area) => (
                  <button
                    key={area}
                    onClick={() => handleLocationClick(city, area)}
                    className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SuggestedLocationsPanel;

