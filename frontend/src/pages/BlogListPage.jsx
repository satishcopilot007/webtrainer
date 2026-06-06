import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaArrowRight } from 'react-icons/fa';

const SAMPLE_BLOGS = [
  {
    id: 1,
    slug: 'how-ai-is-transforming-the-tech-industry-2025',
    title: 'How AI is Transforming the Tech Industry in 2025',
    excerpt: 'Artificial Intelligence is reshaping every sector — from healthcare to finance. Discover the key trends and skills you need to stay ahead in the AI-driven world.',
    thumbnail: null,
    category: 'Artificial Intelligence',
    date: '2025-04-20',
    author: 'TrainerMentors Team',
  },
  {
    id: 2,
    slug: 'why-sap-careers-are-booming',
    title: 'Why SAP Careers Are Booming: A Complete Guide',
    excerpt: 'SAP professionals are in high demand across the globe. Learn why SAP skills can accelerate your career and how to get started with the right certification.',
    thumbnail: null,
    category: 'SAP',
    date: '2025-04-12',
    author: 'TrainerMentors Team',
  },
  {
    id: 3,
    slug: 'top-career-tips-for-fresh-graduates',
    title: 'Top Career Tips for Fresh Graduates in Tech',
    excerpt: 'Starting your career in technology? Here are practical tips on building your resume, acing interviews, and landing your dream job in the competitive tech market.',
    thumbnail: null,
    category: 'Career Tips',
    date: '2025-03-28',
    author: 'TrainerMentors Team',
  },
];

const categoryColors = {
  'Artificial Intelligence': 'bg-purple-100 text-purple-700',
  'SAP': 'bg-blue-100 text-blue-700',
  'Career Tips': 'bg-green-100 text-green-700',
};

const BlogListPage = () => {
  return (
    <>
      <Helmet>
        <title>Blog | TrainerMentors</title>
        <meta name="description" content="Read the latest articles on tech careers, AI trends, SAP insights, and expert career tips from TrainerMentors." />
        <link rel="canonical" href="https://trainermentors.com/blog" />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-r from-[#461E96] to-[#461E96]/80 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Our Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 text-lg max-w-2xl mx-auto"
          >
            Insights, tips, and trends to keep you ahead in the tech industry.
          </motion.p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SAMPLE_BLOGS.map((blog, i) => (
              <motion.article
                key={blog.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
              >
                {/* Thumbnail */}
                <div className="h-48 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                  <span className="text-4xl text-primary-300 font-bold">TM</span>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${categoryColors[blog.category] || 'bg-gray-100 text-gray-700'}`}>
                      {blog.category}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <FaCalendarAlt />
                      {new Date(blog.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                    <Link to={`/blog/${blog.slug}`} className="hover:text-primary-500 transition-colors">
                      {blog.title}
                    </Link>
                  </h2>

                  <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                    {blog.excerpt}
                  </p>

                  <Link
                    to={`/blog/${blog.slug}`}
                    className="inline-flex items-center gap-2 text-primary-500 text-sm font-semibold hover:text-primary-700 transition-colors"
                  >
                    Read More <FaArrowRight className="text-xs" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Pagination Placeholder */}
          <div className="flex justify-center items-center gap-2 mt-12">
            <button disabled className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium opacity-40 cursor-not-allowed">
              Previous
            </button>
            <button className="w-10 h-10 rounded-lg bg-primary-500 text-white text-sm font-medium">
              1
            </button>
            <button disabled className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium opacity-40 cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogListPage;
