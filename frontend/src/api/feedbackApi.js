import api from './axiosConfig';

export const getFeedbackCourseOptions = () => api.get('/courses/options');
export const submitPublicFeedback = (data) => api.post('/feedback', data);