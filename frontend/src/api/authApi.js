import api from './axiosConfig';

const withLegacyFallback = async (primary, fallback) => {
	try {
		return await primary();
	} catch (error) {
		if (error.response?.status !== 404) throw error;
		return fallback();
	}
};

export const login = (credentials) => withLegacyFallback(
	() => api.post('/auth/login', credentials),
	() => api.post('/login', credentials),
);
export const register = (data) => withLegacyFallback(
	() => api.post('/auth/register', data),
	() => api.post('/register', data),
);
export const continueWithGoogle = (credential) => withLegacyFallback(
	() => api.post('/auth/google', { credential }),
	() => api.post('/google-auth', { credential }),
);
export const getCurrentUser = () => withLegacyFallback(
	() => api.get('/auth/me'),
	() => api.get('/me'),
);
export const getProfile = getCurrentUser;
export const updateProfile = (data) => withLegacyFallback(
	() => api.put('/auth/profile', data),
	() => api.put('/profile', data),
);
export const changePassword = (data) => withLegacyFallback(
	() => api.post('/auth/change-password', data),
	() => api.post('/change-password', data),
);
export const refreshToken = (refreshTokenValue) => withLegacyFallback(
	() => api.post('/auth/refresh', { refreshToken: refreshTokenValue }),
	() => api.post('/refresh', { refreshToken: refreshTokenValue }),
);
