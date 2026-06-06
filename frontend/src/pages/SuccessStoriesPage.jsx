import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaArrowUp, FaStar, FaAward, FaCheckCircle } from 'react-icons/fa';
import { SUCCESS_STORIES } from '../utils/constants';
import { SITE_NAME } from '../utils/constants';

const SuccessStoriesPage = () => {
  return (
    <>
      <Helmet>
        <title>Success Stories | {SITE_NAME} - Student Career Transformations</title>
        <meta name="description" content="Read inspiring success stories of TrainerMentors students who achieved their career goals and landed high-paying jobs." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <FaAward className="text-orange-400 text-3xl" />
              <span className="text-orange-400 font-semibold text-lg">Success Stories</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Real Students, Real Results
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover how our students transformed their careers and achieved their dreams
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {SUCCESS_STORIES.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8 text-center text-white">
                  <div className="text-6xl mb-4">{story.studentPhoto}</div>
                  <h3 className="text-3xl font-bold">{story.studentName}</h3>
                  <p className="text-orange-100 text-lg mt-2">{story.company}</p>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                  {/* Course Info */}
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <p className="text-sm text-gray-600 mb-1">Course Completed</p>
                    <p className="font-bold text-gray-900 text-lg">{story.course}</p>
                    <p className="text-orange-600 font-semibold">{story.duration}</p>
                  </div>

                  {/* Title */}
                  <div className="bg-gradient-to-r from-orange-50 to-purple-50 rounded-lg p-4">
                    <h4 className="text-xl font-bold text-gray-900 italic">
                      "{story.title}"
                    </h4>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 text-base leading-relaxed">
                    {story.description}
                  </p>

                  {/* Before & After */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Before */}
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200 text-center">
                      <p className="text-xs text-gray-600 mb-1">Previous Role</p>
                      <p className="font-bold text-gray-900 text-sm">{story.previousRole}</p>
                      <p className="text-red-600 font-semibold mt-2">{story.previousSalary}</p>
                    </div>

                    {/* Growth */}
                    <div className="flex items-center justify-center">
                      <div className="flex flex-col items-center">
                        <FaArrowUp className="text-green-500 text-3xl mb-2" />
                        <p className="font-bold text-green-600 text-lg">{story.improvement}</p>
                        <p className="text-xs text-gray-600">{story.metric}</p>
                      </div>
                    </div>

                    {/* After */}
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200 text-center">
                      <p className="text-xs text-gray-600 mb-1">Current Role</p>
                      <p className="font-bold text-gray-900 text-sm">{story.currentRole}</p>
                      <p className="text-green-600 font-bold mt-2 text-lg">{story.currentSalary}</p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400" size={20} />
                    ))}
                  </div>

                  {/* Verification Badge */}
                  <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
                    <FaCheckCircle />
                    <span>Verified Graduate</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-12 text-white text-center shadow-2xl"
          >
            <div>
              <p className="text-5xl font-bold mb-2">{SUCCESS_STORIES.length}+</p>
              <p className="text-lg">Success Stories</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">4.9/5</p>
              <p className="text-lg">Average Rating</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">100%</p>
              <p className="text-lg">Job Placement</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Create Your Success Story?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of students who have transformed their careers. Start your journey today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/courses"
                className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-10 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Explore Courses
              </a>
              <a
                href="/contact"
                className="inline-block border-2 border-white hover:bg-white/10 text-white font-bold px-10 py-4 rounded-full transition-all duration-300"
              >
                Get in Touch
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default SuccessStoriesPage;
