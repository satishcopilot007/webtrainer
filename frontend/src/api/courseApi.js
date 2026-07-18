import api from './axiosConfig';
import { findCourseBySlug } from '../utils/courseUtils';
import { COURSE_CATEGORIES, COURSE_DETAILS } from '../utils/constants';

export const getCourses = (params) => api.get('/courses', { params });
export const getCourseById = (id) => api.get(`/courses/${id}`);
export const getFreeTutorialCourses = (params = {}) => api.get('/courses', {
  params: { pageSize: 100, ...params, is_free_tutorial: 1 },
});

const parsePrice = (value) => {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? num : 0;
};

export const normalizeCourse = (course) => {
  if (!course || typeof course !== 'object') return null;

  const categoryObj = typeof course.category === 'object'
    ? course.category
    : {
        id: course.category_id || null,
        name: course.category_name || course.category || null,
        slug: course.category_slug || course.category || null,
      };

  const rawPrice = parsePrice(course.price);
  const rawDiscountPrice = parsePrice(
    course.discounted_price ?? course.discount_price ?? course.effective_price
  );

  const basePrice = rawPrice;
  const discountedPrice = rawDiscountPrice > 0 && rawDiscountPrice < basePrice
    ? rawDiscountPrice
    : null;
  const effectivePrice = discountedPrice || basePrice || 0;
  const discountPct = discountedPrice
    ? (course.discount_percentage || Math.round((1 - discountedPrice / basePrice) * 100))
    : 0;

  return {
    ...course,
    title: course.title || course.name || 'Course',
    short_description: course.short_description || course.description || `Learn ${course.title || course.name || 'this course'}`,
    category: categoryObj,
    rating: Number(course.rating || 0),
    rating_count: Number(course.rating_count || course.total_reviews || course.review_count || 0),
    review_count: Number(course.review_count || course.total_reviews || course.rating_count || 0),
    enrollment_count: Number(course.enrollment_count || course.current_students || 0),
    duration_weeks: Number(course.duration_weeks || 0),
    price: basePrice,
    discount_price: discountedPrice,
    discounted_price: discountedPrice,
    effective_price: effectivePrice,
    discount_percentage: discountPct,
    original_price: basePrice,
    pricing_note: course.pricing_note || (effectivePrice <= 0
      ? 'Contact for price or drop email to contact@trainermentors.com'
      : null),
    price_tiers_usd: course.price_tiers_usd || {
      basic: parsePrice(course.price_basic_usd),
      intermediate: parsePrice(course.price_intermediate_usd),
      advanced: parsePrice(course.price_advanced_usd),
    },
    duration_tiers_hours: course.duration_tiers_hours || {
      basic: Number(course.duration_basic_hours || 0),
      intermediate: Number(course.duration_intermediate_hours || 0),
      advanced: Number(course.duration_advanced_hours || 0),
    },
    curriculum: course.curriculum || parseCurriculum(course.modules),
  };
};

/**
 * Parse modules from API (description string) into curriculum format (topics array)
 */
function parseCurriculum(modules) {
  if (!Array.isArray(modules) || modules.length === 0) return [];
  return modules.map((mod, idx) => {
    const desc = mod.description || '';
    // Format: "Duration: X hours | Level: Y | Topics: topic1 | topic2 | ..."
    const topicsMatch = desc.match(/Topics:\s*(.+)/i);
    const topics = topicsMatch
      ? topicsMatch[1].split(' | ').map(t => t.trim()).filter(Boolean)
      : desc.split(' | ').map(t => t.trim()).filter(Boolean);
    const durationMatch = desc.match(/Duration:\s*(\d+)\s*hours/i);
    const duration_hours = durationMatch ? Number(durationMatch[1]) : 0;
    const levelMatch = desc.match(/Level:\s*(\w+)/i);
    return {
      id: mod.id || `${idx + 1}`,
      title: mod.title || `Module ${idx + 1}`,
      topics,
      duration_hours,
      level: levelMatch ? levelMatch[1] : null,
      order: mod.sequence || idx + 1,
    };
  });
}

/**
 * Get course by slug with fallback to mock data
 * First tries to fetch from backend API
 * Falls back to mock data from constants if API fails
 */
export const getCourseBySlug = async (slug) => {
  try {
    // Try to fetch from backend API first
    const response = await api.get(`/courses/${slug}`);
    const course = response.data?.data || response.data;
    return normalizeCourse(course);
  } catch (error) {
    if (error?.response?.status === 404) {
      throw new Error('Course not found');
    }

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
    return normalizeCourse({
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
    });
  }
};

export const getFreeTutorialBySlug = async (slug) => {
  const response = await api.get(`/courses/${slug}`);
  const course = response.data?.data || response.data;
  if (Number(course?.is_free_tutorial) !== 1) throw new Error('Free course not found');
  return course;
};
export const createCourse = (data) => api.post('/courses', data);
export const updateCourse = (id, data) => api.put(`/courses/${id}`, data);
export const deleteCourse = (id) => api.delete(`/courses/${id}`);
export const getFeaturedCourses = () => api.get('/courses/featured');
export const getCategories = () => api.get('/categories');
export const getMentors = () => api.get('/mentors');
