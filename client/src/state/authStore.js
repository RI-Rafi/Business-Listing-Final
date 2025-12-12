import { create } from 'zustand';
import { authAPI } from '../lib/api.js';

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,

  setUser: (user) => set({ user, loading: false }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  login: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const response = await authAPI.login({ email, password });
      set({ user: response.data.user, loading: false });
      return response;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  register: async (name, email, password) => {
    try {
      set({ loading: true, error: null });
      const response = await authAPI.register({ name, email, password });
      set({ loading: false });
      return response;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authAPI.logout();
      set({ user: null, error: null });
    } catch (error) {
      set({ error: error.message });
    }
  },

  checkAuth: async () => {
    try {
      set({ loading: true });
      const response = await authAPI.getMe();
      set({ user: response.data.user, loading: false });
    } catch (error) {
      set({ user: null, loading: false });
    }
  },
}));

export default useAuthStore;

