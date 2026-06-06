import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaStar, FaComment } from 'react-icons/fa';

const FeedbackPage = () => {
  return (
    <>
      <Helmet>
        <title>Feedback | TrainerMentors</title>
        <meta name="description" content="Share your feedback to help us improve" />
      </Helmet>

      <section className="pt-32 pb-16 bg-gradient-to-br from-blue-900 via-dark-800 to-dark-900">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="text-6xl mb-4">💬</div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">We Value Your Feedback</h1>
            <p className="text-xl text-gray-300">Help us improve our learning experience</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-dark-900">
        <div className="max-w-2xl mx-auto px-6">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl p-8 shadow-2xl"
          >
            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">Your Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-dark-600 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                placeholder="Enter your name"
              />
            </div>

            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">Email Address</label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-dark-600 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">Course/Program</label>
              <select className="w-full px-4 py-3 bg-dark-600 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500">
                <option>Select a course</option>
                <option>Full Stack Development</option>
                <option>Data Science Masters</option>
                <option>Cloud AWS Architect</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="text-3xl text-gray-500 hover:text-yellow-400 transition"
                  >
                    <FaStar />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">Your Feedback</label>
              <textarea
                className="w-full px-4 py-3 bg-dark-600 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500 h-32"
                placeholder="Share your thoughts and suggestions..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition"
            >
              Submit Feedback
            </button>
          </motion.form>
        </div>
      </section>
    </>
  );
};

export default FeedbackPage;
