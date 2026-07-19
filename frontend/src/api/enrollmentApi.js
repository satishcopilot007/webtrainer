import axios from 'axios';
import api from './axiosConfig';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Course Enrollment API endpoints
 */

/**
 * Get all enrollments for the current user
 */
export const getUserEnrollments = async (userId, pageSize = 100) => {
  const response = await api.get(`/users/${userId}/enrollments`, {
    params: { page: 1, pageSize },
  });
  return response.data;
};

/**
 * Get single enrollment details
 */
export const getEnrollmentDetail = async (enrollmentId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/accounts/enrollments/${enrollmentId}/`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching enrollment details:', error);
    throw error;
  }
};

/**
 * Enroll in a course
 */
export const enrollCourse = async (courseId, batchId = null) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/accounts/enrollments/`,
      {
        course: courseId,
        batch: batchId,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error enrolling in course:', error);
    throw error;
  }
};

/**
 * Mark payment as complete for an enrollment
 */
export const markPaymentComplete = async (enrollmentId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/accounts/enrollments/${enrollmentId}/mark_payment_complete/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error marking payment complete:', error);
    throw error;
  }
};

/**
 * Update enrollment progress
 */
export const updateEnrollmentProgress = async (enrollmentId, progressData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/accounts/enrollments/${enrollmentId}/update_progress/`,
      progressData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating enrollment progress:', error);
    throw error;
  }
};

/**
 * Cancel an enrollment
 */
export const cancelEnrollment = async (enrollmentId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/accounts/enrollments/${enrollmentId}/cancel_enrollment/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error cancelling enrollment:', error);
    throw error;
  }
};

/**
 * Callback Request API endpoints
 */

/**
 * Submit a callback request
 */
export const submitCallbackRequest = async (callbackData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/accounts/callbacks/`,
      callbackData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error submitting callback request:', error);
    throw error;
  }
};

/**
 * Get user's callback requests (authenticated only)
 */
export const getUserCallbacks = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/accounts/callbacks/`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching callback requests:', error);
    throw error;
  }
};

/**
 * Learning Progress API endpoints
 */

/**
 * Get learning progress for user's enrollments
 */
export const getLearningProgress = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/accounts/progress/`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching learning progress:', error);
    throw error;
  }
};

/**
 * Mark module as complete
 */
export const markModuleComplete = async (progressId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/accounts/progress/${progressId}/mark_complete/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error marking module complete:', error);
    throw error;
  }
};
