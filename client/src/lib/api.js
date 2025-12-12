const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'An error occurred');
  }

  return data;
};

export const authAPI = {
  register: (data) => api('/auth/register', { method: 'POST', body: data }),
  login: (data) => api('/auth/login', { method: 'POST', body: data }),
  logout: () => api('/auth/logout', { method: 'POST' }),
  getMe: () => api('/auth/me'),
};

export const listingAPI = {
  getListings: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api(`/listings?${query}`);
  },
  getListing: (id) => api(`/listings/${id}`),
  createListing: (data) => api('/listings', { method: 'POST', body: data }),
  updateListing: (id, data) => api(`/listings/${id}`, { method: 'PUT', body: data }),
  deleteListing: (id) => api(`/listings/${id}`, { method: 'DELETE' }),
  getMyListings: () => api('/listings/my-listings'),
};

export const userAPI = {
  getBookmarks: () => api('/users/me/bookmarks'),
  toggleBookmark: (listingId) => api(`/users/me/bookmarks/${listingId}`, { method: 'POST' }),
};

export const metaAPI = {
  getCategories: () => api('/meta/categories'),
  getLocations: () => api('/meta/locations'),
};

export default api;

