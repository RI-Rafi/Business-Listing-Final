import { config } from '../config/env.js';

const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;
const GEOAPIFY_BASE_URL = 'https://api.geoapify.com/v1';

/**
 * Geocode an address to get coordinates
 * @param {string} address - The address to geocode (e.g., "Dhanmondi, Dhaka, Bangladesh")
 * @returns {Promise<{lat: number, lng: number} | null>} - Returns coordinates or null if not found
 */
export const geocodeAddress = async (address) => {
  if (!GEOAPIFY_API_KEY) {
    console.warn('⚠️ GEOAPIFY_API_KEY not set. Geocoding will fail.');
    return null;
  }

  if (!address || typeof address !== 'string' || address.trim().length === 0) {
    return null;
  }

  try {
    const url = `${GEOAPIFY_BASE_URL}/geocode/search?text=${encodeURIComponent(address)}&format=json&apiKey=${GEOAPIFY_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Geoapify API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      const lat = result.lat;
      const lng = result.lon;

      if (lat && lng) {
        return { lat, lng };
      }
    }

    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};

/**
 * Build address string from location object
 * @param {Object} location - Location object with city and area
 * @returns {string} - Formatted address string
 */
export const buildAddressString = (location) => {
  if (!location) return '';
  
  const parts = [];
  if (location.area) parts.push(location.area);
  if (location.city) parts.push(location.city);
  parts.push('Bangladesh');
  
  return parts.join(', ');
};
