import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaClock, FaUsers, FaStar, FaArrowRight } from 'react-icons/fa';
import { COURSE_CATEGORIES } from '../utils/constants';

const CourseCategoryPage = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  
  const category = COURSE_CATEGORIES.find(cat => cat.slug === categorySlug);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Category Not Found</h1>
          <button
            onClick={() => navigate('/courses')}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <>
      <Helmet>
        <title>{category.name} | TrainerMentors</title>
        <meta name="description" content={category.description} />
      </Helmet>

      {/* Hero Section */}
      <section className={`pt-32 pb-16 bg-gradient-to-br ${category.color} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-20" />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="text-6xl mb-4">{category.icon}</div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              {category.name}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              {category.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20 bg-dark-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {category.courses.map((course) => (
              <motion.div
                key={course.id}
                variants={itemVariants}
                className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-300 group cursor-pointer"
                onClick={() => navigate(`/courses/${course.id}`)}
              >
                {/* Image Placeholder */}
                <div className={`h-48 bg-gradient-to-br ${category.color} flex items-center justify-center text-5xl`}>
                  {category.icon}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                    {course.name}
                  </h3>

                  {/* Level Badge */}
                  <div className="mb-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      course.level === 'beginner' ? 'bg-green-500/20 text-green-300' :
                      course.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                    </span>
                  </div>

                  {/* Course Stats */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-2 text-gray-300 text-sm">
                      <FaClock className="text-primary-400" />
                      <span>8 weeks program</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300 text-sm">
                      <FaUsers className="text-secondary-400" />
                      <span>500+ students enrolled</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300 text-sm">
                      <FaStar className="text-yellow-400" />
                      <span>4.8/5 rating</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2 group/btn">
                    <span>Explore Course</span>
                    <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Learning?</h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of students transforming their careers with our expert-led courses
          </p>
          <button className="bg-white text-primary-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all">
            Explore All Courses
          </button>
        </div>
      </section>
    </>
  );
};

export default CourseCategoryPage;
