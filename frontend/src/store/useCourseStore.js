import { create } from 'zustand';
import { getCourses, getCategories, getFeaturedCourses } from '../api/courseApi';

const useCourseStore = create((set) => ({
  courses: [],
  categories: [],
  featuredCourses: [],
  isLoading: false,
  currentPage: 1,
  totalPages: 1,
  filters: {},
  error: null,

  fetchCourses: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getCourses(params);
      const responseData = response.data || {};
      const courses = responseData.data || (Array.isArray(responseData) ? responseData : []);
      const pagination = responseData.pagination || {};
      set({
        courses: Array.isArray(courses) ? courses : [],
        totalPages: pagination.totalPages || 1,
        currentPage: pagination.page || 1,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error fetching courses:', error);
      set({ isLoading: false, error: error.message, courses: [] });
    }
  },

  fetchCategories: async () => {
    try {
      const response = await getCategories();
      const categories = response.data?.data || response.data || [];
      set({ categories: Array.isArray(categories) ? categories : [] });
    } catch (error) {
      console.error('Error fetching categories:', error);
      set({ categories: [] });
    }
  },

  fetchFeaturedCourses: async () => {
    try {
      const response = await getFeaturedCourses();
      const courses = Array.isArray(response.data) ? response.data : response.data || [];
      set({ featuredCourses: courses });
    } catch (error) {
      console.error('Error fetching featured courses:', error);
      set({ featuredCourses: [] });
    }
  },

  setFilters: (filters) => set({ filters }),
}));

export default useCourseStore;
