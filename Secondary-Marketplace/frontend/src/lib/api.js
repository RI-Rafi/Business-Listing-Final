const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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

// Cart API
export const cartAPI = {
    getCart: () => api('/cart'),
    addToCart: (data) => api('/cart/add', { method: 'POST', body: data }),
    updateCartItem: (itemId, data) => api(`/cart/items/${itemId}`, { method: 'PUT', body: data }),
    deleteCartItem: (itemId) => api(`/cart/items/${itemId}`, { method: 'DELETE' }),
    checkout: () => api('/cart/checkout', { method: 'POST' }),
};

// Auth API
export const authAPI = {
    registerCustomer: (data) => api('/auth/register-customer', { method: 'POST', body: data }),
    registerProvider: (data) => api('/auth/register-provider', { method: 'POST', body: data }),
    login: (data) => api('/auth/login', { method: 'POST', body: data }),
    logout: () => api('/auth/logout', { method: 'POST' }),
    getMe: () => api('/auth/me'),
};

// Chat API
export const chatAPI = {
    chat: (data) => api('/chat', { method: 'POST', body: data }),
    getChatHistory: (sessionId) => api(`/chat/history/${sessionId}`),
};

export default api;
