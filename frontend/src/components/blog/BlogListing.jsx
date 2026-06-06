import { motion } from 'framer-motion';
import { FaCalendar, FaClock, FaTag, FaArrowRight } from 'react-icons/fa';
import { BLOG_POSTS } from '../../utils/constants';
import { Link } from 'react-router-dom';

const BlogListing = ({ limit = 6 }) => {
  const displayedPosts = BLOG_POSTS.slice(0, limit);

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-orange-600 font-semibold">Our Blog</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2">
            Latest Articles & Insights
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
            Stay updated with industry trends, career tips, and expert insights
          </p>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayedPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Feature Image */}
              <div className="h-48 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center relative overflow-hidden">
                <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                  {post.image}
                </div>
                {/* Category Badge */}
                <div className="absolute top-3 left-3 bg-white text-orange-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <FaTag size={12} />
                  {post.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-1">
                    <FaCalendar size={12} />
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <FaClock size={12} />
                    {post.readTime}
                  </div>
                </div>

                {/* Author & CTA */}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">By {post.author}</p>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold text-sm transition-colors group/cta"
                  >
                    Read More
                    <FaArrowRight className="group-hover/cta:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        {limit && BLOG_POSTS.length > limit && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              to="/blog"
              className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-10 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              View All Articles
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default BlogListing;
