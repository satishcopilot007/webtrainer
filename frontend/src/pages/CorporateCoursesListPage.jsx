import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaArrowRight, FaExternalLinkAlt } from 'react-icons/fa';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CORPORATE_COHORTS } from '../data/corporateCohorts';

const CorporateCoursesListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(CORPORATE_COHORTS.map((course) => course.category))).sort();
    return ['All', ...uniqueCategories];
  }, []);

  useEffect(() => {
    if (!categories.includes(selectedCategory)) {
      setSelectedCategory('All');
    }
  }, [categories, selectedCategory]);

  useEffect(() => {
    const nextParams = new URLSearchParams();
    const trimmedQuery = searchQuery.trim();

    if (trimmedQuery) {
      nextParams.set('q', trimmedQuery);
    }
    if (selectedCategory && selectedCategory !== 'All') {
      nextParams.set('category', selectedCategory);
    }

    setSearchParams(nextParams, { replace: true });
  }, [searchQuery, selectedCategory, setSearchParams]);

  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return CORPORATE_COHORTS.filter((course) => {
      const categoryMatch = selectedCategory === 'All' || course.category === selectedCategory;
      const textMatch = !query
        || course.name.toLowerCase().includes(query)
        || course.category.toLowerCase().includes(query);

      return categoryMatch && textMatch;
    });
  }, [searchQuery, selectedCategory]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <>
      <Helmet>
        <title>Corporate Courses | TrainerMentors</title>
        <meta name="description" content="Enterprise certification and training programs" />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-orange-600 to-red-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==')] opacity-40" />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Corporate Courses ({CORPORATE_COHORTS.length})
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Complete cohort catalog imported from The Test Tribe corporate offerings
            </p>
          </motion.div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20 bg-gradient-to-b from-dark-900 to-dark-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2">
              <label htmlFor="course-search" className="block text-sm text-gray-300 mb-2">Search Cohort</label>
              <input
                id="course-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by cohort name or category"
                className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label htmlFor="category-filter" className="block text-sm text-gray-300 mb-2">Category</label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-gray-300 mb-6">Showing {filteredCourses.length} of {CORPORATE_COHORTS.length} cohorts</p>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredCourses.map((course) => (
              <motion.div
                key={course.id}
                variants={itemVariants}
                className="bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer"
              >
                {/* Image */}
                <div className="h-48 bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-6xl">
                  🎓
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-dark-900 group-hover:text-primary-600 transition-colors mb-3">
                    {course.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {course.category}
                  </p>

                  <div className="mb-6">
                    <a
                      href={course.syllabus}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
                    >
                      Open Syllabus
                      <FaExternalLinkAlt className="text-xs" />
                    </a>
                  </div>

                  {/* CTA Button */}
                  <a
                    href={course.syllabus}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2 group/btn"
                  >
                    <span>VIEW DETAILS</span>
                    <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredCourses.length === 0 && (
            <div className="mt-10 text-center bg-white/10 rounded-xl p-8 border border-white/20">
              <p className="text-white text-lg font-semibold">No cohorts matched your filters.</p>
              <p className="text-gray-300 mt-2">Try a different keyword or reset category to All.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-white mb-6">Transform Your Enterprise</h2>
          <p className="text-xl text-white/90 mb-8">
            Build a skilled, certified workforce with our corporate training programs
          </p>
          <button className="bg-white text-primary-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all inline-flex items-center space-x-2">
            <span>REQUEST CALLBACK</span>
            <FaArrowRight />
          </button>
        </div>
      </section>
    </>
  );
};

export default CorporateCoursesListPage;
