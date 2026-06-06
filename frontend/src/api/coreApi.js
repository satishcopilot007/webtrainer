import api from './axiosConfig';

export const getSiteSettings = () => api.get('/core/settings/');
export const submitContactForm = (data) => api.post('/core/contact/', data);
export const getFAQs = () => api.get('/core/faq/');
export const getTestimonials = () => api.get('/testimonials/');
export const getFeaturedTestimonials = () => api.get('/testimonials/featured/');
export const getPlacements = () => api.get('/placements/');
export const getHiringPartners = () => api.get('/placements/partners/');
