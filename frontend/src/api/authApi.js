import api from './axiosConfig';

export const login = (credentials) => api.post('/login', credentials);
export const register = (data) => api.post('/register', data);
export const getCurrentUser = () => api.get('/me');
export const getProfile = () => api.get('/me'); // Alias for backward compatibility
export const updateProfile = (data) => api.put('/profile', data);
export const changePassword = (data) => api.post('/change-password', data);
export const refreshToken = (refreshToken) => api.post('/refresh', { refreshToken });
