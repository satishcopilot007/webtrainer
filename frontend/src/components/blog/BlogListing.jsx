import { motion } from 'framer-motion';
import { FaCalendar, FaClock, FaTag, FaArrowRight } from 'react-icons/fa';
import { BLOG_POSTS } from '../../utils/constants';
import { Link } from 'react-router-dom';

const BlogListing = ({ limit = 6 }) => {
  const displayedPosts = BLOG_POSTS.slice(0, limit);

  return (
    <section className="border-b border-[#254777] bg-gradient-to-br from-[#071b35] via-[#0b2f66] to-[#000240] py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-orange-600 font-semibold">Our Blog</span>
          <h2 className="mt-2 text-4xl font-bold text-[#f0f6fc] md:text-5xl">
            Latest Articles & Insights
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#8b949e]">
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
              className="group overflow-hidden rounded-xl border border-[#30363d] bg-[#161b22] shadow-lg shadow-black/20 transition-all duration-300 hover:border-[#58a6ff]/60 hover:shadow-2xl"
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
                <h3 className="mb-3 line-clamp-2 text-xl font-bold text-[#f0f6fc] transition-colors group-hover:text-orange-500">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="mb-4 line-clamp-2 text-sm text-[#8b949e]">
                  {post.excerpt}
                </p>

                {/* Meta Info */}
                <div className="mb-4 flex flex-wrap gap-3 border-b border-[#30363d] pb-4 text-xs text-[#8b949e]">
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
                  <p className="text-xs text-[#8b949e]">By {post.author}</p>
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
