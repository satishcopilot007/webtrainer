import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaCalendar, FaClock, FaTag, FaArrowRight, FaSearch } from 'react-icons/fa';
import { useState } from 'react';
import { BLOG_POSTS, SITE_NAME } from '../utils/constants';
import { Link } from 'react-router-dom';

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Get unique categories
  const categories = ['All', ...new Set(BLOG_POSTS.map(post => post.category))];

  // Filter posts
  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Helmet>
        <title>Blog | {SITE_NAME} - Tech Career Insights & Tips</title>
        <meta name="description" content="Read articles about tech careers, programming, cloud computing, data science, and professional development." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Blog</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Insights, tips, and trends from industry experts
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="bg-gradient-to-br from-slate-50 to-orange-50 py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="relative max-w-2xl mx-auto">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 rounded-xl border border-gray-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-lg"
              />
            </div>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-orange-400 hover:text-orange-600'
                }`}
              >
                <FaTag size={14} />
                {category}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {filteredPosts.length > 0 ? (
            <>
              <p className="text-center text-gray-600 mb-12">
                Found {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post, index) => (
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
                      <div className="absolute top-3 left-3 bg-white text-orange-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <FaTag size={12} />
                        {post.category}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                        {post.title}
                      </h3>

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
                          Read
                          <FaArrowRight className="group-hover/cta:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-2xl text-gray-600 mb-4">No articles found</p>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Learn More, Grow Your Career
            </h2>
            <p className="text-lg text-orange-100 mb-8">
              Subscribe to our newsletter for the latest insights and career tips
            </p>
            <a
              href="/contact"
              className="inline-block bg-white text-orange-600 hover:bg-gray-100 font-bold px-8 py-4 rounded-full transition-all duration-300"
            >
              Get in Touch
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default BlogPage;
