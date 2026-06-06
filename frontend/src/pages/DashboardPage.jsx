import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { FaChartLine, FaBook, FaTrophy, FaArrowRight, FaClock, FaStar, FaPlay, FaLock } from 'react-icons/fa';
import useAuthStore from '../store/useAuthStore';
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

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    if (!user) {
      fetchProfile();
    }
  }, [isAuthenticated, user, navigate, fetchProfile]);

  // Sample enrolled courses data
  const enrolledCourses = [
    {
      id: 1,
      title: 'Python for Data Science',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
      progress: 65,
      instructor: 'Dr. Rajesh Kumar',
      rating: 4.8,
      students: 2543,
      nextLesson: 'Advanced Data Manipulation'
    },
    {
      id: 2,
      title: 'Full-Stack Web Development',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
      progress: 40,
      instructor: 'Sarah Johnson',
      rating: 4.9,
      students: 3421,
      nextLesson: 'React Hooks & State Management'
    },
    {
      id: 3,
      title: 'Cloud Computing with AWS',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
      progress: 25,
      instructor: 'Mike Chen',
      rating: 4.7,
      students: 1892,
      nextLesson: 'EC2 & Auto Scaling'
    }
  ];

  // Learning stats
  const stats = [
    { label: 'Courses Enrolled', value: '3', icon: FaBook, color: 'bg-blue-500' },
    { label: 'Learning Hours', value: '24h', icon: FaClock, color: 'bg-green-500' },
    { label: 'Certificates', value: '1', icon: FaTrophy, color: 'bg-yellow-500' },
    { label: 'Current Streak', value: '7 days', icon: FaChartLine, color: 'bg-purple-500' }
  ];

  // Recommended courses
  const recommendedCourses = [
    {
      id: 4,
      title: 'AI & Machine Learning',
      instructor: 'Dr. Priya Singh',
      students: 4532,
      rating: 4.9,
      price: '₹4,999',
      image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&h=300&fit=crop'
    },
    {
      id: 5,
      title: 'Cybersecurity Mastery',
      instructor: 'James Wilson',
      students: 2156,
      rating: 4.8,
      price: '₹5,499',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop'
    },
    {
      id: 6,
      title: 'DevOps & Kubernetes',
      instructor: 'Amit Patel',
      students: 1823,
      rating: 4.7,
      price: '₹4,799',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop'
    }
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
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.first_name || 'Learner'}! 👋</h1>
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
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <button className="absolute bottom-4 left-4 bg-primary-500 hover:bg-primary-600 text-white p-3 rounded-full transition-colors">
                    <FaPlay className="text-lg" />
                  </button>
                </div>

                {/* Course Info */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{course.instructor}</p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-700">Progress</span>
                      <span className="text-xs font-bold text-primary-600">{course.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Next Lesson */}
                  <p className="text-xs text-gray-600 mb-3">
                    <strong>Next:</strong> {course.nextLesson}
                  </p>

                  {/* Rating & Continue Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <FaStar className="text-yellow-400 text-sm" />
                      <span className="text-sm font-semibold text-gray-800">{course.rating}</span>
                      <span className="text-xs text-gray-500">({course.students.toLocaleString()})</span>
                    </div>
                    <Link 
                      to={`/courses/${course.id}`}
                      className="text-primary-600 hover:text-primary-700 font-bold text-sm"
                    >
                      Continue
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Courses */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Recommended For You</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow border border-gray-200 group cursor-pointer"
              >
                <div className="relative overflow-hidden h-40">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{course.instructor}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <FaStar className="text-yellow-400 text-sm" />
                    <span className="text-sm font-semibold">{course.rating}</span>
                    <span className="text-xs text-gray-500">({course.students.toLocaleString()} students)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary-600">{course.price}</span>
                    <Link 
                      to={`/courses/${course.id}`}
                      className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                    >
                      Enroll
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
