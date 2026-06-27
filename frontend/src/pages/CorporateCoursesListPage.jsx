import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaStar, FaArrowRight } from 'react-icons/fa';

const CorporateCoursesListPage = () => {
  const courses = [
    {
      id: 1,
      title: 'PMP CERTIFICATION TRAINING',
      image: '📋',
      description: 'Become a certified Project Management Professional',
      rating: 4.9,
      reviews: 234
    },
    {
      id: 2,
      title: 'CSM CERTIFICATION TRAINING',
      image: '🎯',
      description: 'Master Certified Scrum Master principles',
      rating: 4.8,
      reviews: 189
    },
    {
      id: 3,
      title: 'JIRA CERTIFICATION TRAINING',
      image: '⚙️',
      description: 'Expert-level Jira administration and usage',
      rating: 4.9,
      reviews: 156
    },
    {
      id: 4,
      title: 'PRINCE2 CERTIFICATION TRAINING',
      image: '👑',
      description: 'PRINCE2 project management methodology',
      rating: 4.7,
      reviews: 142
    },
    {
      id: 5,
      title: 'ITIL 4 CERTIFICATION TRAINING',
      image: '🔄',
      description: 'IT Service Management Excellence',
      rating: 4.8,
      reviews: 167
    },
    {
      id: 6,
      title: 'PSM CERTIFICATION TRAINING',
      image: '📈',
      description: 'Professional Scrum Master certification',
      rating: 4.9,
      reviews: 198
    }
  ];

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
        <title>Corporate Courses | TrainerMentors</title>
        <meta name="description" content="Enterprise certification and training programs" />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-orange-600 to-red-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==')] opacity-40" />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Corporate Courses
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Enterprise-level certifications and training for corporate teams
            </p>
          </motion.div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20 bg-gradient-to-b from-dark-900 to-dark-800">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {courses.map((course) => (
              <motion.div
                key={course.id}
                variants={itemVariants}
                className="bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer"
              >
                {/* Image */}
                <div className="h-48 bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-6xl">
                  {course.image}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-dark-900 group-hover:text-primary-600 transition-colors mb-3">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={i < Math.floor(course.rating) ? 'text-yellow-400' : 'text-gray-300'}
                          size={16}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 font-semibold">
                      {course.rating} ({course.reviews} reviews)
                    </span>
                  </div>

                  {/* CTA Button */}
                  <button className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2 group/btn">
                    <span>EXPLORE COURSE</span>
                    <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-white mb-6">Transform Your Enterprise</h2>
          <p className="text-xl text-white/90 mb-8">
            Build a skilled, certified workforce with our corporate training programs
          </p>
          <button className="bg-white text-primary-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all inline-flex items-center space-x-2">
            <span>REQUEST CALLBACK</span>
            <FaArrowRight />
          </button>
        </div>
      </section>
    </>
  );
};

export default CorporateCoursesListPage;
