import api from './axiosConfig';

export const getBlogs = (params) => api.get('/blog/', { params });
export const getBlogBySlug = (slug) => api.get(`/blog/${slug}/`);
export const getFeaturedBlogs = () => api.get('/blog/featured/');
