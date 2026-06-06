// Utility functions for course handling

export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/--+/g, '-');
};

/**
 * Find a course by slug across all categories
 */
export const findCourseBySlug = (slug, categories) => {
  for (const category of categories) {
    // Check simple courses list
    if (category.courses && !category.domains) {
      const course = category.courses.find(c => generateSlug(c.name) === slug);
      if (course) {
        return {
          ...course,
          category: category.name,
          categorySlug: category.slug,
        };
      }
    }

    // Check domain-based courses (IT, Non-IT)
    if (category.domains) {
      for (const domain of category.domains) {
        const course = domain.courses.find(c => generateSlug(c.name) === slug);
        if (course) {
          return {
            ...course,
            category: category.name,
            categorySlug: category.slug,
            domain: domain.name,
          };
        }
      }
    }
  }
  return null;
};

/**
 * Get all courses in a specific category
 */
export const getCoursesByCategory = (categorySlug, categories) => {
  const category = categories.find(c => c.slug === categorySlug);
  if (!category) return [];

  if (category.courses && !category.domains) {
    return category.courses;
  }

  if (category.domains) {
    return category.domains.flatMap(domain => domain.courses);
  }

  return [];
};

/**
 * Get all domains in a category (for IT/Non-IT)
 */
export const getDomainsByCategorySlug = (categorySlug, categories) => {
  const category = categories.find(c => c.slug === categorySlug);
  return category?.domains || [];
};

export default {
  generateSlug,
  findCourseBySlug,
  getCoursesByCategory,
  getDomainsByCategorySlug,
};
