import { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import CourseCard from '../components/courses/CourseCard';
import Loader from '../components/common/Loader';
import useCourseStore from '../store/useCourseStore';

const LEVELS = ['beginner', 'intermediate', 'advanced'];
const MODES = ['online', 'classroom', 'hybrid', 'corporate', '1-on-1'];
const LEVEL_LABELS = {
  'beginner': 'Beginner',
  'intermediate': 'Intermediate',
  'advanced': 'Advanced',
};
const MODE_LABELS = {
  'online': 'Online',
  'classroom': 'Classroom',
  'hybrid': 'Hybrid',
  'corporate': 'Corporate',
  '1-on-1': '1-on-1',
};
const MAIN_CATEGORIES = {
  corporate: 'Corporate Courses',
  technical: 'Technical Courses',
  'non-technical': 'Non-Technical Courses',
};

const CourseCatalogPage = () => {
  const { mainCategory } = useParams(); // From URL like /courses/it
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const store = useCourseStore();
  const courses = Array.isArray(store.courses) ? store.courses : [];
  const categories = Array.isArray(store.categories) ? store.categories : [];
  const { isLoading, totalPages, fetchCourses, fetchCategories } = store;

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const selectedCategory = searchParams.get('category') || '';
  const selectedLevel = searchParams.get('level') || '';
  const selectedMode = searchParams.get('mode') || '';

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const params = { page: currentPage };
    // When search is active, search across ALL courses regardless of category
    if (!search) {
      if (mainCategory) params.category = mainCategory;
      if (selectedCategory) params.category = selectedCategory;
    }
    if (selectedLevel) params.level = selectedLevel;
    if (selectedMode) params.mode = selectedMode;
    if (search) params.search = search;
    fetchCourses(params);
  }, [currentPage, mainCategory, selectedCategory, selectedLevel, selectedMode, search, fetchCourses]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearch('');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilter('search', search);
  };

  const goToPage = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', String(page));
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters = selectedCategory || selectedLevel || selectedMode || searchParams.get('search');

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Category</h3>
        <div className="space-y-2">
          <button
            onClick={() => updateFilter('category', '')}
            className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!selectedCategory ? 'bg-primary-100 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => updateFilter('category', cat.slug)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat.slug ? 'bg-primary-100 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Level Filter */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Level</h3>
        <div className="space-y-2">
          <button
            onClick={() => updateFilter('level', '')}
            className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!selectedLevel ? 'bg-primary-100 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            All Levels
          </button>
          {LEVELS.map((lvl) => (
            <button
              key={lvl}
              onClick={() => updateFilter('level', lvl)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedLevel === lvl ? 'bg-primary-100 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {LEVEL_LABELS[lvl] || lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Mode Filter */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Mode</h3>
        <div className="space-y-2">
          <button
            onClick={() => updateFilter('mode', '')}
            className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!selectedMode ? 'bg-primary-100 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            All Modes
          </button>
          {MODES.map((m) => (
            <button
              key={m}
              onClick={() => updateFilter('mode', m)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedMode === m ? 'bg-primary-100 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {MODE_LABELS[m] || m}
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full py-2 text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{mainCategory ? MAIN_CATEGORIES[mainCategory] : 'All Courses'} | TrainerMentors</title>
        <meta name="description" content={`Browse our ${mainCategory ? MAIN_CATEGORIES[mainCategory] : 'comprehensive catalog of expert-led'} courses. Find the perfect course to advance your career.`} />
        <link rel="canonical" href={`https://trainermentors.com/courses${mainCategory ? '/' + mainCategory : ''}`} />
      </Helmet>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#461E96] to-[#461E96]/80 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            {mainCategory ? MAIN_CATEGORIES[mainCategory] : 'All Courses'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 text-lg max-w-2xl mx-auto"
          >
            Explore our industry-aligned courses and start building the career you deserve.
          </motion.p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-xl mx-auto">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
            />
          </div>
        </form>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium"
          >
            <FaFilter />
            {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filters */}
          {showMobileFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg">Filters</h2>
                <button onClick={() => setShowMobileFilters(false)}>
                  <FaTimes className="text-gray-400" />
                </button>
              </div>
              <FilterPanel />
            </motion.div>
          )}

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-lg mb-4">Filters</h2>
              <FilterPanel />
            </div>
          </aside>

          {/* Course Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader />
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No courses found matching your criteria.</p>
                <button onClick={clearFilters} className="mt-4 text-primary-500 hover:underline font-medium">
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <motion.div
                      key={course.slug}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3 }}
                    >
                      <CourseCard course={course} />
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Previous
                    </button>
                    {(() => {
                      const pages = [];
                      const maxVisible = 5;
                      let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                      let end = Math.min(totalPages, start + maxVisible - 1);
                      if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
                      if (start > 1) {
                        pages.push(1);
                        if (start > 2) pages.push('...');
                      }
                      for (let i = start; i <= end; i++) pages.push(i);
                      if (end < totalPages) {
                        if (end < totalPages - 1) pages.push('...');
                        pages.push(totalPages);
                      }
                      return pages.map((page, idx) => (
                        page === '...' ? (
                          <span key={`dots-${idx}`} className="px-2 text-gray-400">...</span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                              page === currentPage
                                ? 'bg-primary-500 text-white'
                                : 'border border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      ));
                    })()}
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default CourseCatalogPage;
