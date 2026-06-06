import api from './axiosConfig';

export const enrollCourse = (data) => api.post('/payments/enroll/', data);
export const getMyEnrollments = () => api.get('/payments/my-enrollments/');
