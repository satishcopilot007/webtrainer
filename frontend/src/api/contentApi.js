import api from './axiosConfig';

export const getPublicFounders = () => api.get('/founders');
export const getPublicBlogs = () => api.get('/blogs');
export const getPublicBlog = (slug) => api.get(`/blogs/${encodeURIComponent(slug)}`);