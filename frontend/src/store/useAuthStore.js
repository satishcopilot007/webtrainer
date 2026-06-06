import { create } from 'zustand';
import { login as loginApi, register as registerApi, getProfile } from '../api/authApi';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const response = await loginApi(credentials);
      const { data: loginData } = response;
      const { user, accessToken, refreshToken } = loginData.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      set({ user, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  },

  register: async (userData) => {
    set({ isLoading: true });
    try {
      const response = await registerApi(userData);
      const { data: regData } = response;
      const { user, accessToken, refreshToken } = regData.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      set({ user, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      
      // Extract field-specific errors from response
      const errorData = error.response?.data;
      let fieldErrors = {};
      let errorMessage = 'Registration failed';

      if (errorData?.errors && typeof errorData.errors === 'object') {
        // Server returned field-specific errors
        fieldErrors = errorData.errors;
        errorMessage = errorData.message || 'Validation failed';
      } else if (errorData?.message) {
        // Server returned a general error message
        errorMessage = errorData.message;
      }

      return { 
        success: false, 
        error: fieldErrors.email ? errorMessage : errorMessage,
        fieldErrors: fieldErrors,
        rawError: errorData
      };
    }
  },

  fetchProfile: async () => {
    try {
      const response = await getProfile();
      const { data: user } = response.data;
      set({ user, isAuthenticated: true });
    } catch (error) {
      console.error('Error fetching profile:', error);
      set({ user: null, isAuthenticated: false });
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
