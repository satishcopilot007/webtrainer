import api from './axiosConfig';

export const submitEnquiry = (data) => api.post('/leads', data);
export const bookDemo = (data) => api.post('/leads', data);
