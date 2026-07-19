import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { FaChartLine, FaBook, FaTrophy, FaArrowRight, FaClock, FaPlay } from 'react-icons/fa';
import useAuthStore from '../store/useAuthStore';
import { getUserEnrollments } from '../api/enrollmentApi';
import FeaturedCourses from '../components/home/FeaturedCourses';
import TestimonialSlider from '../components/home/TestimonialSlider';
import EnhancedTestimonials from '../components/home/EnhancedTestimonials';
import SuccessStories from '../components/home/SuccessStories';
import BlogListing from '../components/blog/BlogListing';
import EmployerCarousel from '../components/common/EmployerCarousel';
import AlumniSection from '../components/common/AlumniSection';
import StickyFooterCTA from '../components/common/StickyFooterCTA';
import { SITE_NAME } from '../utils/constants';

const DashboardPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const [enrollments, setEnrollments] = useState([]);
  const [isLoadingEnrollments, setIsLoadingEnrollments] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    if (!user) {
      fetchProfile();
    }
  }, [isAuthenticated, user, navigate, fetchProfile]);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    let isMounted = true;
    setIsLoadingEnrollments(true);
    getUserEnrollments(user.id)
      .then((response) => {
        if (isMounted) setEnrollments(Array.isArray(response.data) ? response.data : []);
      })
      .catch(() => {
        if (isMounted) setEnrollments([]);
      })
      .finally(() => {
        if (isMounted) setIsLoadingEnrollments(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user?.id]);

  const enrolledCourses = useMemo(
    () => enrollments.filter((enrollment) => enrollment.status !== 'dropped'),
    [enrollments],
  );

  const certificates = enrolledCourses.filter(
    (enrollment) => enrollment.status === 'completed' || Number(enrollment.progress_percentage) >= 100,
  ).length;

  const learningHours = enrolledCourses.reduce(
    (total, enrollment) => total + Math.max(0, Number(enrollment.learning_hours) || 0),
    0,
  );

  const currentStreak = Math.max(0, Number(user?.current_streak) || 0);

  const stats = [
    { label: 'Courses Enrolled', value: enrolledCourses.length, icon: FaBook, color: 'bg-blue-500' },
    { label: 'Learning Hours', value: `${learningHours}h`, icon: FaClock, color: 'bg-green-500' },
    { label: 'Certificates', value: certificates, icon: FaTrophy, color: 'bg-yellow-500' },
    { label: 'Current Streak', value: `${currentStreak} days`, icon: FaChartLine, color: 'bg-purple-500' }
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard | {SITE_NAME}</title>
        <meta name="description" content="Welcome to your learning dashboard. View your courses, track progress, and continue learning." />
      </Helmet>

      {/* Welcome Banner */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.first_name || user?.name?.split(' ')[0] || 'Learner'}! 👋</h1>
          <p className="text-primary-100 text-lg">Ready to continue your learning journey?</p>
        </div>
      </motion.section>

      {/* Learning Stats */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Your Learning Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="text-white text-xl" />
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.label}</h3>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Currently Enrolled Courses */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Your Current Courses</h2>
            <Link to="/courses" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold">
              View All <FaArrowRight />
            </Link>
          </div>
          {isLoadingEnrollments ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center text-gray-500">
              Loading your courses...
            </div>
          ) : enrolledCourses.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
              <FaBook className="text-4xl text-primary-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">No courses enrolled yet</h3>
              <p className="text-gray-600 mb-5">Your enrolled courses and progress will appear here.</p>
              <Link to="/courses" className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-5 py-3 rounded-xl font-semibold">
                Browse Courses <FaArrowRight />
              </Link>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {enrolledCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow border border-gray-200 group cursor-pointer"
              >
                {/* Course Image */}
                <div className="relative overflow-hidden h-48">
                  <img
                    src={course.thumbnail || 'https://via.placeholder.com/400x300?text=Course'}
                    alt={course.course_title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <button className="absolute bottom-4 left-4 bg-primary-500 hover:bg-primary-600 text-white p-3 rounded-full transition-colors">
                    <FaPlay className="text-lg" />
                  </button>
                </div>

                {/* Course Info */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{course.course_title}</h3>
                  <p className="text-sm capitalize text-gray-600 mb-3">Status: {course.status}</p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-700">Progress</span>
                      <span className="text-xs font-bold text-primary-600">{Number(course.progress_percentage) || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(0, Number(course.progress_percentage) || 0))}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                    <Link 
                      to={`/courses/${course.course_id}`}
                      className="text-primary-600 hover:text-primary-700 font-bold text-sm"
                    >
                      Continue
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* Featured Courses Section */}
      <FeaturedCourses />

      {/* Employer Carousel */}
      <EmployerCarousel />

      {/* Testimonials */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">What Our Students Say</h2>
          <TestimonialSlider />
        </div>
      </section>

      {/* Success Stories */}
      <SuccessStories />

      {/* Latest Blogs */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-gray-800">Latest from Our Blog</h2>
          <BlogListing limit={3} />
        </div>
      </section>

      {/* Alumni Section */}
      <AlumniSection />

      {/* Sticky CTA */}
      <StickyFooterCTA />
    </>
  );
};

export default DashboardPage;
