import api from './axiosConfig';

export const getAdminOverview = () => api.get('/admin/overview');

export const getTutors = (params) => api.get('/admin/tutors', { params });
export const getTutor = (id) => api.get(`/admin/tutors/${id}`);
export const uploadTutorProfileImage = (file) => api.post('/admin/tutors/profile-image', file, {
  headers: { 'Content-Type': file.type },
});
export const createTutor = (data) => api.post('/admin/tutors', data);
export const updateTutor = (id, data) => api.put(`/admin/tutors/${id}`, data);
export const deactivateTutor = (id) => api.delete(`/admin/tutors/${id}`);

export const getAdminCategories = (params) => api.get('/admin/categories', { params });
export const createCategory = (data) => api.post('/admin/categories', data);
export const updateCategory = (id, data) => api.put(`/admin/categories/${id}`, data);
export const deactivateCategory = (id) => api.delete(`/admin/categories/${id}`);

export const getAdminCourses = (params) => api.get('/admin/courses', { params });
export const getAdminCourse = (id) => api.get(`/admin/courses/${id}`);
export const createAdminCourse = (data) => api.post('/admin/courses', data);
export const updateAdminCourse = (id, data) => api.put(`/admin/courses/${id}`, data);
export const deactivateAdminCourse = (id) => api.delete(`/admin/courses/${id}`);

export const getAdminFounders = (params) => api.get('/admin/founders', { params });
export const createFounder = (data) => api.post('/admin/founders', data);
export const updateFounder = (id, data) => api.put(`/admin/founders/${id}`, data);
export const deleteFounder = (id) => api.delete(`/admin/founders/${id}`);

export const getAdminBlogs = (params) => api.get('/admin/blogs', { params });
export const createBlog = (data) => api.post('/admin/blogs', data);
export const updateBlog = (id, data) => api.put(`/admin/blogs/${id}`, data);
export const deleteBlog = (id) => api.delete(`/admin/blogs/${id}`);

export const getFeedback = (params) => api.get('/admin/feedback', { params });
export const createFeedback = (data) => api.post('/admin/feedback', data);
export const updateFeedback = (id, data) => api.put(`/admin/feedback/${id}`, data);
export const deleteFeedback = (id) => api.delete(`/admin/feedback/${id}`);

export const getAdminRecords = (type, params) => api.get(`/admin/records/${type}`, { params });

export const getApiError = (error, fallback = 'Something went wrong') => {
  const response = error?.response?.data;
  if (response?.errors && typeof response.errors === 'object') {
    const first = Object.values(response.errors).flat()[0];
    if (typeof first === 'string') return first;
  }
  return response?.message || error?.message || fallback;
};
