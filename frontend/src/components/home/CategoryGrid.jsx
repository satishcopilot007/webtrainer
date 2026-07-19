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
  'corporate': 'border-green-500/50 text-green-400 bg-[#161b22]',
  'technical': 'border-blue-500/50 text-blue-400 bg-[#161b22]',
  'non-technical': 'border-pink-500/50 text-pink-400 bg-[#161b22]',
  'certificate': 'border-purple-500/50 text-purple-400 bg-[#161b22]',
};

const DEFAULT_COLOR = 'border-[#30363d] text-[#58a6ff] bg-[#161b22]';

const CategoryGrid = () => {
  const store = useCourseStore();
  const categories = Array.isArray(store.categories) ? store.categories : [];
  const { fetchCategories } = store;

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <section className="border-b border-[#21262d] bg-gradient-to-br from-[#010409] via-[#0d1117] to-[#010409] py-20">
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
            className="font-display text-3xl font-bold text-[#f0f6fc] md:text-4xl"
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
                  className={`group block rounded-xl border p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#58a6ff] hover:shadow-xl hover:shadow-blue-950/20 ${color}`}
                >
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#30363d] bg-[#0d1117] shadow-sm transition-transform group-hover:scale-110">
                    <Icon className="text-2xl" />
                  </div>
                  <h3 className="mb-1 font-semibold text-[#f0f6fc]">{cat.name}</h3>
                  <p className="text-sm text-[#8b949e]">
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
