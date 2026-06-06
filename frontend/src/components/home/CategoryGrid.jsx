import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaBriefcase, FaLaptopCode, FaPaintBrush, FaLayerGroup,
} from 'react-icons/fa';
import useCourseStore from '../../store/useCourseStore';

const CATEGORY_ICONS = {
  'corporate': FaBriefcase,
  'technical': FaLaptopCode,
  'non-technical': FaPaintBrush,
  'certificate': FaLayerGroup,
};

const CATEGORY_COLORS = {
  'corporate': 'border-green-400 text-green-600 bg-green-50',
  'technical': 'border-blue-400 text-blue-600 bg-blue-50',
  'non-technical': 'border-pink-400 text-pink-600 bg-pink-50',
  'certificate': 'border-purple-400 text-purple-600 bg-purple-50',
};

const DEFAULT_COLOR = 'border-primary-400 text-primary-500 bg-primary-50';

const CategoryGrid = () => {
  const store = useCourseStore();
  const categories = Array.isArray(store.categories) ? store.categories : [];
  const { fetchCategories } = store;

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-secondary-500 font-semibold uppercase tracking-wider text-sm mb-2"
          >
            Browse by domain
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl md:text-4xl font-bold text-dark-800"
          >
            Explore Categories
          </motion.h2>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, i) => {
            const Icon = CATEGORY_ICONS[cat.slug] || FaLayerGroup;
            const color = CATEGORY_COLORS[cat.slug] || DEFAULT_COLOR;

            return (
              <motion.div
                key={cat.id || cat.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/courses/${cat.slug}`}
                  className={`block border-2 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 group ${color}`}
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-sm mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="text-2xl" />
                  </div>
                  <h3 className="font-semibold text-dark-800 mb-1">{cat.name}</h3>
                  <p className="text-sm text-gray-500">
                    {cat.course_count ?? 0} {cat.course_count === 1 ? 'Course' : 'Courses'}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
