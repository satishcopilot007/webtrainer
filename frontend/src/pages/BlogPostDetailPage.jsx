import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUser, FaClock, FaArrowLeft, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { BLOG_POSTS } from '../utils/constants';
import { useEffect, useState } from 'react';
import { getPublicBlog, getPublicBlogs } from '../api/contentApi';

const BlogPostDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const fallbackBlog = BLOG_POSTS.find(post => post.slug === slug);
  const [blog, setBlog] = useState(fallbackBlog || null);
  const [posts, setPosts] = useState(BLOG_POSTS);
  const [loading, setLoading] = useState(!fallbackBlog);

  useEffect(() => {
    setLoading(!fallbackBlog);
    Promise.allSettled([getPublicBlog(slug), getPublicBlogs()]).then(([detail, list]) => {
      if (detail.status === 'fulfilled') {
        const item = detail.value.data.data;
        setBlog({ ...item, date: item.published_at, readTime: item.read_time, image: item.image_url || '📝' });
      } else setBlog(fallbackBlog || null);
      if (list.status === 'fulfilled' && list.value.data.data?.length) {
        const managed = list.value.data.data.map((item) => ({ ...item, date: item.published_at, readTime: item.read_time, image: item.image_url || '📝' }));
        const managedSlugs = new Set(managed.map((item) => item.slug));
        setPosts([...managed, ...BLOG_POSTS.filter((item) => !managedSlugs.has(item.slug))]);
      } else setPosts(BLOG_POSTS);
      setLoading(false);
    });
  }, [fallbackBlog, slug]);

  // Get related posts (same category, different post)
  const relatedPosts = posts.filter(
    post => post.category === blog?.category && post.id !== blog?.id
  ).slice(0, 3);

  if (loading) return <div className="min-h-[60vh] grid place-items-center text-gray-500">Loading article…</div>;

  if (!blog) {
    return (
      <>
        <Helmet>
          <title>Blog Post Not Found | TrainerMentors</title>
        </Helmet>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Post Not Found</h1>
            <p className="text-gray-600 mb-6">Sorry, the blog post you're looking for doesn't exist.</p>
            <Link to="/blog" className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition">
              Back to Blog
            </Link>
          </div>
        </div>
      </>
    );
  }

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out this article: ${blog.title}`;
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <>
      <Helmet>
        <title>{blog.title} | TrainerMentors Blog</title>
        <meta name="description" content={blog.excerpt} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt} />
        <meta name="article:published_time" content={blog.date} />
        <meta name="article:author" content={blog.author} />
        <meta name="article:section" content={blog.category} />
      </Helmet>

      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 py-3"
      >
        <div className="max-w-4xl mx-auto px-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-primary-500 hover:text-primary-600 font-semibold transition"
          >
            <FaArrowLeft size={16} /> Back
          </button>
        </div>
      </motion.div>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-primary-50 to-secondary-50 py-12"
      >
        <div className="max-w-4xl mx-auto px-6">
          {/* Category & Date */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">
              {blog.category}
            </span>
            <span className="flex items-center gap-1 text-gray-600 text-sm">
              <FaCalendarAlt size={14} /> {new Date(blog.date).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1 text-gray-600 text-sm">
              <FaClock size={14} /> {blog.readTime}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
            {blog.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <div className="text-3xl">{blog.image}</div>
              <div>
                <p className="font-semibold text-gray-800">{blog.author}</p>
                <p className="text-sm">Content Writer</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg max-w-none"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
              {/* Featured Image Placeholder */}
              <div className="mb-8 h-96 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center">
                {blog.image_url ? <img src={blog.image_url} alt="" className="h-full w-full rounded-xl object-cover" /> : <div className="text-8xl">{blog.image}</div>}
              </div>

              {/* Content */}
              <div className="text-gray-700 leading-relaxed space-y-6 text-base md:text-lg">
                {blog.content.split('\n\n').map((paragraph, index) => (
                  <div key={index}>
                    {paragraph.split('\n').map((line, lineIndex) => {
                      // Bold text between ** **
                      if (line.includes('**')) {
                        return (
                          <p key={lineIndex} className="mb-3">
                            {line.split('**').map((part, i) => 
                              i % 2 === 0 ? part : <strong key={i}>{part}</strong>
                            )}
                          </p>
                        );
                      }
                      // Numbered list items
                      if (line.match(/^\d+\./)) {
                        return (
                          <p key={lineIndex} className="mb-2 ml-4">
                            {line}
                          </p>
                        );
                      }
                      // Regular paragraphs
                      return (
                        <p key={lineIndex} className="mb-3">
                          {line}
                        </p>
                      );
                    })}
                  </div>
                ))}
              </div>

              {(blog.external_url || blog.reference_url) && (
                <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-5">
                  <h3 className="font-bold text-gray-800">Sources &amp; references</h3>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {blog.external_url && <a href={blog.external_url} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white">Open original {blog.source_platform || 'post'}</a>}
                    {blog.reference_url && <a href={blog.reference_url} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700">View reference</a>}
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-gray-200 my-12"></div>

              {/* Author Box */}
              <div className="bg-gray-50 rounded-xl p-6 flex items-start gap-4 mb-8">
                <div className="text-5xl">{blog.image}</div>
                <div>
                  <p className="font-bold text-gray-800">{blog.author}</p>
                  <p className="text-sm text-gray-600 mb-2">
                    {blog.author} is a content writer at TrainerMentors specializing in tech careers, industry trends, and professional development.
                  </p>
                  <p className="text-xs text-gray-500">Last updated: {new Date(blog.date).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Share Section */}
              <div className="bg-primary-50 rounded-xl p-6 mb-8">
                <h3 className="font-bold text-gray-800 mb-4">Share This Article</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    <FaFacebook /> Share
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="bg-blue-400 text-white p-3 rounded-lg hover:bg-blue-500 transition flex items-center gap-2"
                  >
                    <FaTwitter /> Tweet
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="bg-blue-700 text-white p-3 rounded-lg hover:bg-blue-800 transition flex items-center gap-2"
                  >
                    <FaLinkedin /> Share
                  </button>
                </div>
              </div>

              {/* CTA Section */}
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl p-8 text-center">
                <h3 className="text-2xl font-bold mb-3">Ready to Master {blog.category}?</h3>
                <p className="mb-6">Enroll in our comprehensive courses and accelerate your career today.</p>
                <Link
                  to="/courses"
                  className="inline-block bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Explore Courses →
                </Link>
              </div>
            </div>
          </motion.article>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm hover:shadow-lg transition border border-gray-100 overflow-hidden group cursor-pointer"
                  onClick={() => navigate(`/blog/${post.slug}`)}
                >
                  <div className="h-40 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {post.image_url ? <img src={post.image_url} alt="" className="h-full w-full object-cover" /> : <div className="text-6xl">{post.image}</div>}
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded">
                      {post.category}
                    </span>
                    <h3 className="font-bold text-gray-800 mt-3 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="py-12 bg-dark-900 text-white">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-300 mb-6">Get the latest articles, industry insights, and career tips delivered to your inbox.</p>
          <form className="flex gap-2 flex-col sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button className="bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default BlogPostDetailPage;
