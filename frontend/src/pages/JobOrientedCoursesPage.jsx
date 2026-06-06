import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaStar, FaClock, FaUsers, FaArrowRight } from 'react-icons/fa';

const JobOrientedCoursesPage = () => {
  const courses = [
    {
      id: 1,
      title: 'JOB ORIENTED BUSINESS ANALYST COURSE',
      image: '📊',
      description: 'Master business analysis and become industry-ready',
      duration: '6 Months',
      students: '5000+',
      rating: 4.9,
      reviews: 256,
      price: '₹45,000',
      placement: '100% Placement Assistance'
    },
    {
      id: 2,
      title: 'JOB ORIENTED WEB FULL STACK COURSE',
      image: '🌐',
      description: 'Complete web development from frontend to backend',
      duration: '8 Months',
      students: '8000+',
      rating: 4.9,
      reviews: 342,
      price: '₹55,000',
      placement: '100% Placement Assistance'
    },
    {
      id: 3,
      title: 'JOB ORIENTED JAVA FULLSTACK COURSE',
      image: '☕',
      description: 'Enterprise-level Java development skills',
      duration: '7 Months',
      students: '6000+',
      rating: 4.8,
      reviews: 298,
      price: '₹50,000',
      placement: '100% Placement Assistance'
    },
    {
      id: 4,
      title: 'JOB ORIENTED DATA ENGINEERING',
      image: '🔧',
      description: 'Build scalable data pipelines and architecture',
      duration: '8 Months',
      students: '3500+',
      rating: 4.9,
      reviews: 187,
      price: '₹60,000',
      placement: '100% Placement Assistance'
    },
    {
      id: 5,
      title: 'JOB ORIENTED DATA ANALYTICS',
      image: '📈',
      description: 'Transform raw data into actionable insights',
      duration: '6 Months',
      students: '5500+',
      rating: 4.9,
      reviews: 276,
      price: '₹45,000',
      placement: '100% Placement Assistance'
    },
    {
      id: 6,
      title: 'JOB ORIENTED DATA SCIENCE AI WITH DATA ANALYTICS',
      image: '🤖',
      description: 'AI/ML and advanced data science techniques',
      duration: '10 Months',
      students: '4200+',
      rating: 4.8,
      reviews: 312,
      price: '₹75,000',
      placement: '100% Placement Assistance'
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
        <title>Job Oriented Courses | TrainerMentors</title>
        <meta name="description" content="Industry-focused job oriented courses for immediate job placement" />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-blue-600 to-blue-700 relative overflow-hidden">
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
              Job Oriented Courses
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Industry-focused training designed to land you your dream job with guaranteed placement assistance
            </p>
          </motion.div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-20 bg-gradient-to-b from-dark-900 to-dark-800">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            {courses.map((course) => (
              <motion.div
                key={course.id}
                variants={itemVariants}
                className="bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex items-center p-6 group cursor-pointer"
              >
                {/* Image */}
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-6xl flex-shrink-0 mr-6">
                  {course.image}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl lg:text-2xl font-bold text-dark-900 group-hover:text-primary-600 transition-colors mb-3">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {course.description}
                  </p>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-6 text-sm text-gray-700">
                    <div className="flex items-center space-x-2">
                      <FaClock className="text-primary-500" />
                      <span className="font-semibold">Duration: {course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaUsers className="text-secondary-500" />
                      <span className="font-semibold">{course.students} Students</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaStar className="text-yellow-500" />
                      <span className="font-semibold">{course.rating} ({course.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col items-end space-y-4 ml-6">
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Starting at</div>
                    <div className="text-2xl font-bold text-primary-600">{course.price}</div>
                  </div>
                  <button className="px-6 py-2 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-all flex items-center space-x-2 group/btn">
                    <span>ENROLL NOW</span>
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
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Your Career?</h2>
          <p className="text-xl text-white/90 mb-8">
            Book your free demo class today and kickstart your journey to success
          </p>
          <button className="bg-white text-primary-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all inline-flex items-center space-x-2">
            <span>RESERVE MY SEAT NOW</span>
            <FaArrowRight />
          </button>
        </div>
      </section>
    </>
  );
};

export default JobOrientedCoursesPage;
