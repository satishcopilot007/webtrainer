import { create } from 'zustand';
import { getCourses, getCategories, getFeaturedCourses, normalizeCourse } from '../api/courseApi';

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

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
      const normalizedCourses = (Array.isArray(courses) ? courses : [])
        .map(normalizeCourse)
        .filter(Boolean);
      set({
        courses: normalizedCourses,
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
      try {
        // Fallback for deployments that haven't exposed /categories yet.
        const response = await getCourses({ page: 1, pageSize: 500 });
        const payload = response.data?.data || [];
        const courseList = (Array.isArray(payload) ? payload : []).map(normalizeCourse).filter(Boolean);

        const map = new Map();
        courseList.forEach((course) => {
          const cat = course.category || {};
          const name = cat.name || 'General';
          const slug = cat.slug || slugify(name);
          const key = slug || name;
          if (!map.has(key)) {
            map.set(key, { id: cat.id || key, name, slug, course_count: 0 });
          }
          map.get(key).course_count += 1;
        });

        set({ categories: Array.from(map.values()) });
      } catch (fallbackError) {
        console.error('Error building fallback categories:', fallbackError);
        set({ categories: [] });
      }
    }
  },

  fetchFeaturedCourses: async () => {
    try {
      const response = await getFeaturedCourses();
      const payload = response.data?.data || response.data || [];
      const courses = (Array.isArray(payload) ? payload : [])
        .map(normalizeCourse)
        .filter(Boolean);
      set({ featuredCourses: courses });
    } catch (error) {
      console.error('Error fetching featured courses:', error);
      set({ featuredCourses: [] });
    }
  },

  setFilters: (filters) => set({ filters }),
}));

export default useCourseStore;
