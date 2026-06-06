import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  FaStar, FaUsers, FaChevronRight, FaCheckCircle,
  FaTools, FaBriefcase, FaLightbulb,
} from 'react-icons/fa';
import CourseSidebar from '../components/courses/CourseSidebar';
import CurriculumAccordion from '../components/courses/CurriculumAccordion';
import CourseCard from '../components/courses/CourseCard';
import StarRating from '../components/common/StarRating';
import Loader from '../components/common/Loader';
import AvatarGenerator from '../components/common/AvatarGenerator';
import { getCourseBySlug, getCourses } from '../api/courseApi';

const CourseDetailPage = () => {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      try {
        const { data } = await getCourseBySlug(slug);
        setCourse(data);

        if (data.category) {
          const catSlug = typeof data.category === 'object' ? data.category.slug : data.category;
          const { data: related } = await getCourses({ category: catSlug, page_size: 4 });
          const results = related.results || related;
          setRelatedCourses(results.filter((c) => c.slug !== slug).slice(0, 3));
        }
      } catch {
        setCourse(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourse();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (isLoading) return <Loader />;

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Course Not Found</h2>
          <Link to="/courses" className="text-primary-500 hover:underline">Browse all courses</Link>
        </div>
      </div>
    );
  }

  const {
    title, short_description, description, category, rating, rating_count,
    enrollment_count, highlights, prerequisites, tools_covered,
    modules, reviews, career_opportunities,
  } = course;

  const categoryName = typeof category === 'object' ? category?.name : category;
  const categorySlug = typeof category === 'object' ? category?.slug : category;

  return (
    <>
      <Helmet>
        <title>{title} | TrainerMentors</title>
        <meta name="description" content={short_description || `Learn ${title} with expert mentors at TrainerMentors.`} />
        <meta property="og:title" content={`${title} | TrainerMentors`} />
        <meta property="og:description" content={short_description} />
        <link rel="canonical" href={`https://trainermentors.com/courses/${slug}`} />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#461E96] to-[#461E96]/80 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <FaChevronRight className="text-xs" />
            <Link to="/courses" className="hover:text-white transition-colors">Courses</Link>
            {categoryName && (
              <>
                <FaChevronRight className="text-xs" />
                <Link to={`/courses?category=${categorySlug}`} className="hover:text-white transition-colors">
                  {categoryName}
                </Link>
              </>
            )}
            <FaChevronRight className="text-xs" />
            <span className="text-white/90">{title}</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {categoryName && (
              <span className="inline-block px-3 py-1 bg-secondary-500 text-white text-xs font-semibold rounded-full mb-4">
                {categoryName}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">{title}</h1>
            <p className="text-white/80 text-lg max-w-3xl mb-6">{short_description}</p>

            <div className="flex flex-wrap items-center gap-6 text-white/90">
              {rating > 0 && (
                <div className="flex items-center gap-2">
                  <StarRating rating={rating} />
                  <span className="font-semibold">{rating}</span>
                  <span className="text-white/60">({rating_count} reviews)</span>
                </div>
              )}
              {enrollment_count > 0 && (
                <div className="flex items-center gap-2">
                  <FaUsers />
                  <span>{enrollment_count.toLocaleString()} enrolled</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Content */}
          <div className="flex-1 min-w-0">
            {/* Description */}
            {description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-10"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Course</h2>
                <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: description }} />
              </motion.div>
            )}

            {/* Highlights */}
            {highlights && highlights.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-10"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaLightbulb className="text-yellow-500" /> Course Highlights
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {highlights.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{typeof item === 'object' ? item.text : item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Prerequisites */}
            {prerequisites && prerequisites.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-10"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Prerequisites</h2>
                <ul className="space-y-2">
                  {prerequisites.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-600">
                      <FaChevronRight className="text-primary-500 mt-1 text-xs flex-shrink-0" />
                      <span>{typeof item === 'object' ? item.text : item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Tools Covered */}
            {tools_covered && tools_covered.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-10"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaTools className="text-primary-500" /> Tools & Technologies
                </h2>
                <div className="flex flex-wrap gap-3">
                  {tools_covered.map((tool, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium border border-gray-200"
                    >
                      {typeof tool === 'object' ? tool.name : tool}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Curriculum */}
            {modules && modules.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-10"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Curriculum</h2>
                <CurriculumAccordion modules={modules} />
              </motion.div>
            )}

            {/* Career Opportunities */}
            {career_opportunities && career_opportunities.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-10"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaBriefcase className="text-primary-500" /> Career Opportunities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {career_opportunities.map((opp, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-primary-50 rounded-lg">
                      <FaCheckCircle className="text-primary-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{typeof opp === 'object' ? opp.title : opp}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Reviews */}
            {reviews && reviews.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-10"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Student Reviews</h2>
                <div className="space-y-4">
                  {reviews.map((review, i) => (
                    <div key={review.id || i} className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3 mb-3">
                        <AvatarGenerator name={review.user_name || review.user || 'Student'} size={40} />
                        <div>
                          <p className="font-semibold text-gray-800">{review.user_name || review.user || 'Student'}</p>
                          <StarRating rating={review.rating} size="sm" />
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{review.comment || review.text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 xl:w-96 flex-shrink-0">
            <div className="sticky top-24">
              <CourseSidebar course={course} />
            </div>
          </div>
        </div>
      </section>

      {/* Related Courses */}
      {relatedCourses.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center"
            >
              Related Courses
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedCourses.map((c) => (
                <motion.div
                  key={c.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <CourseCard course={c} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default CourseDetailPage;
