import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaStar, FaArrowRight } from 'react-icons/fa';
import { useState } from 'react';

const ITCoursesPage = () => {
  const domains = [
    {
      id: 1,
      name: 'DATA SCIENCE',
      icon: '📊',
      color: 'from-orange-500 to-orange-600',
      courses: ['Data Science', 'Data Analytics', 'Advanced Generative AI']
    },
    {
      id: 2,
      name: 'SOFTWARE DEVELOPMENT',
      icon: '💻',
      color: 'from-blue-500 to-blue-600',
      courses: ['Agentic AI', 'Financial Analyst', 'PySpark']
    },
    {
      id: 3,
      name: 'CYBER SECURITY',
      icon: '🔒',
      color: 'from-red-500 to-red-600',
      courses: ['Data Science with AI', 'Databricks', 'Python']
    },
    {
      id: 4,
      name: 'CLOUD COMPUTING',
      icon: '☁️',
      color: 'from-cyan-500 to-cyan-600',
      courses: ['AWS Solutions', 'Azure Fundamentals', 'Cloud Architecture']
    },
    {
      id: 5,
      name: 'SAP COURSES',
      icon: '📈',
      color: 'from-purple-500 to-purple-600',
      courses: ['SAP HANA', 'SAP FICO', 'SAP SD']
    },
    {
      id: 6,
      name: 'DIGITAL MARKETING TRAINING',
      icon: '📱',
      color: 'from-green-500 to-green-600',
      courses: ['SEO Mastery', 'Social Media Marketing', 'Email Marketing']
    }
  ];

  const allCourses = [
    { id: 1, name: 'Data Science', image: '🔬', rating: 4.9, reviews: 156 },
    { id: 2, name: 'Data Analytics', image: '📊', rating: 4.8, reviews: 142 },
    { id: 3, name: 'Advanced Generative AI', image: '🤖', rating: 4.9, reviews: 98 },
    { id: 4, name: 'Agentic AI', image: '🦾', rating: 4.7, reviews: 76 },
    { id: 5, name: 'Financial Analyst', image: '💰', rating: 4.8, reviews: 134 },
    { id: 6, name: 'PySpark', image: '⚡', rating: 4.9, reviews: 102 },
    { id: 7, name: 'Data Science with AI', image: '🧠', rating: 4.8, reviews: 119 },
    { id: 8, name: 'Databricks', image: '🔧', rating: 4.7, reviews: 87 },
    { id: 9, name: 'Python', image: '🐍', rating: 4.9, reviews: 178 }
  ];

  const [selectedDomain, setSelectedDomain] = useState(domains[0]);

  const filteredCourses = allCourses.filter((course, idx) => idx < 6);

  return (
    <>
      <Helmet>
        <title>IT Courses | TrainerMentors</title>
        <meta name="description" content="IT and Software Development courses with industry-ready training" />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-purple-600 to-blue-600 relative overflow-hidden">
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
              IT Courses
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Master cutting-edge technology skills with hands-on training from industry experts
            </p>
          </motion.div>
        </div>
      </section>

      {/* Domains & Courses Section */}
      <section className="py-20 bg-gradient-to-b from-dark-900 to-dark-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Domains */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Domains</h2>
              {domains.map((domain) => (
                <motion.button
                  key={domain.id}
                  onClick={() => setSelectedDomain(domain)}
                  className={`w-full p-4 rounded-xl font-semibold text-left text-white transition-all ${
                    selectedDomain.id === domain.id
                      ? `bg-gradient-to-r ${domain.color} shadow-lg`
                      : 'bg-dark-700 hover:bg-dark-600'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{domain.icon}</span>
                    <span>{domain.name}</span>
                  </div>
                </motion.button>
              ))}
            </motion.div>

            {/* Right Column - Courses */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Courses</h2>
              <motion.div
                className="space-y-4"
                key={selectedDomain.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {allCourses.map((course) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-xl p-4 flex items-center space-x-4 hover:shadow-lg transition-all group cursor-pointer"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center text-4xl flex-shrink-0">
                      {course.image}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-dark-900 group-hover:text-primary-600 transition-colors">
                        {course.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={i < Math.floor(course.rating) ? 'text-yellow-400' : 'text-gray-300'}
                              size={14}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">{course.rating} ({course.reviews} reviews)</span>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-all flex items-center space-x-1 group/btn">
                      <span className="hidden sm:inline">EXPLORE</span>
                      <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Advance Your Tech Career?</h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of professionals who transformed their careers with our IT courses
          </p>
          <button className="bg-white text-primary-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all inline-flex items-center space-x-2">
            <span>EXPLORE ALL COURSES</span>
            <FaArrowRight />
          </button>
        </div>
      </section>
    </>
  );
};

export default ITCoursesPage;
