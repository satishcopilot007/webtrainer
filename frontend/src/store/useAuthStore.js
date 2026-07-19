import { create } from 'zustand';
import { login as loginApi, register as registerApi, continueWithGoogle as googleApi, getProfile } from '../api/authApi';

const saveSession = (set, authData) => {
  const { user, accessToken, refreshToken } = authData;
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  set({ user, isAuthenticated: true, isLoading: false });
  return user;
};

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const response = await loginApi(credentials);
      const { data: loginData } = response;
      const user = saveSession(set, loginData.data);
      return { success: true, user };
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
      saveSession(set, regData.data);
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

  continueWithGoogle: async (credential) => {
    set({ isLoading: true });
    try {
      const response = await googleApi(credential);
      const user = saveSession(set, response.data.data);
      return { success: true, user };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error.response?.data?.message || 'Unable to continue with Google',
      };
    }
  },

  fetchProfile: async () => {
    try {
      const response = await getProfile();
      const { data: user } = response.data;
      set({ user, isAuthenticated: true });
      return { success: true, user };
    } catch (error) {
      set({ user: null, isAuthenticated: false });
      return { success: false, error: error.response?.data?.message || 'Unable to load profile' };
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
