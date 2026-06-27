import api from './axiosConfig';
import { findCourseBySlug } from '../utils/courseUtils';
import { COURSE_CATEGORIES, COURSE_DETAILS } from '../utils/constants';

export const getCourses = (params) => api.get('/courses', { params });
export const getCourseById = (id) => api.get(`/courses/${id}`);

/**
 * Get course by slug with fallback to mock data
 * First tries to fetch from backend API
 * Falls back to mock data from constants if API fails
 */
export const getCourseBySlug = async (slug) => {
  try {
    // Try to fetch from backend API first
    const response = await api.get(`/courses/${slug}`);
    // Check if response has success flag (from API wrapper)
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  } catch (error) {
    // Fallback to mock data if API fails
    console.warn('API fetch failed, using mock data:', error.message);
    const mockCourse = findCourseBySlug(slug, COURSE_CATEGORIES);
    
    if (!mockCourse) {
      throw new Error('Course not found');
    }

    // Get curriculum from COURSE_DETAILS if available
    const courseDetails = COURSE_DETAILS[mockCourse.name];
    const curriculum = courseDetails?.curriculum || [
      {
        id: '1',
        title: 'Module 1: Foundations',
        topics: ['Introduction', 'Core Concepts', 'Best Practices'],
        duration_hours: 8,
        order: 1,
      },
      {
        id: '2',
        title: 'Module 2: Core Concepts',
        topics: ['Advanced Techniques', 'Practical Applications', 'Case Studies'],
        duration_hours: 10,
        order: 2,
      },
      {
        id: '3',
        title: 'Module 3: Advanced Topics',
        topics: ['Real-World Scenarios', 'Problem Solving', 'Optimization'],
        duration_hours: 8,
        order: 3,
      },
      {
        id: '4',
        title: 'Module 4: Real-World Projects',
        topics: ['Project Implementation', 'Deployment', 'Maintenance'],
        duration_hours: 6,
        order: 4,
      },
    ];

    // Transform mock course data to match API response format
    return {
      id: slug,
      title: mockCourse.name,
      slug: slug,
      short_description: mockCourse.description || `Learn ${mockCourse.name}`,
      description: mockCourse.description || `Comprehensive ${mockCourse.name} course designed for professionals looking to advance their skills.`,
      level: mockCourse.level || 'Intermediate',
      mode: 'online',
      duration_weeks: mockCourse.duration || 6,
      duration_hours: (mockCourse.duration || 6) * 40,
      price: courseDetails?.price || mockCourse.price || 25000,
      discount_price: courseDetails?.discount_price || mockCourse.discount_price || 15000,
      discount_percentage: courseDetails?.discount_percentage || mockCourse.discount_percentage || 37,
      effective_price: courseDetails?.discount_price || mockCourse.discount_price || 15000,
      enrollment_count: 150,
      rating: courseDetails?.rating || 4.8,
      review_count: courseDetails?.reviews || 42,
      category: {
        id: mockCourse.categorySlug,
        name: mockCourse.category,
      },
      mentor: null,
      thumbnail: mockCourse.thumbnail || null,
      curriculum: curriculum,
      tools_covered: [
        'Industry Standard Tools',
        'Best Practices',
        'Modern Frameworks',
      ],
      highlights: [
        'Expert instruction',
        'Real-world projects',
        'Lifetime access',
        'Job assistance',
      ],
      batches: [],
    };
  }
};
export const createCourse = (data) => api.post('/courses', data);
export const updateCourse = (id, data) => api.put(`/courses/${id}`, data);
export const deleteCourse = (id) => api.delete(`/courses/${id}`);
export const getFeaturedCourses = () => api.get('/courses/featured');
export const getCategories = () => api.get('/categories');

// Mock mentors data for About page
export const getMentors = async () => {
  return Promise.resolve({
    data: [
      {
        id: 1,
        name: 'Rajesh Kumar',
        title: 'Lead Architect',
        company: 'Google',
        image: 'https://via.placeholder.com/150?text=Rajesh',
        specialization: 'Cloud & DevOps',
      },
      {
        id: 2,
        name: 'Priya Sharma',
        title: 'Senior Data Scientist',
        company: 'Amazon',
        image: 'https://via.placeholder.com/150?text=Priya',
        specialization: 'AI & ML',
      },
      {
        id: 3,
        name: 'Amit Patel',
        title: 'Full Stack Lead',
        company: 'Microsoft',
        image: 'https://via.placeholder.com/150?text=Amit',
        specialization: 'Web Development',
      },
      {
        id: 4,
        name: 'Neha Desai',
        title: 'Security Expert',
        company: 'Cisco',
        image: 'https://via.placeholder.com/150?text=Neha',
        specialization: 'Cybersecurity',
      },
    ]
  });
};
