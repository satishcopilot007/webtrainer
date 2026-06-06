import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaGift, FaPlay, FaClock } from 'react-icons/fa';

const FreeCoursesPage = () => {
  const freeCourses = [
    { id: 1, title: 'Introduction to Python', duration: '4 weeks', students: 15000 },
    { id: 2, title: 'Basics of Web Development', duration: '6 weeks', students: 12000 },
    { id: 3, title: 'Digital Marketing Fundamentals', duration: '3 weeks', students: 8000 },
  ];

  return (
    <>
      <Helmet>
        <title>Free Courses | TrainerMentors</title>
        <meta name="description" content="Free training courses available for everyone" />
      </Helmet>

      <section className="pt-32 pb-16 bg-gradient-to-br from-purple-900 via-dark-800 to-dark-900">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="text-6xl mb-4">🎁</div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Free Courses</h1>
            <p className="text-xl text-gray-300">Learn quality skills without paying a penny</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-dark-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {freeCourses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl overflow-hidden hover:shadow-2xl transition-all"
              >
                <div className="h-32 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <FaPlay className="text-5xl text-white" />
                </div>
                <div className="p-6">
                  <div className="inline-block bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-bold mb-3">FREE</div>
                  <h3 className="text-xl font-bold text-white mb-4">{course.title}</h3>
                  <div className="space-y-2 text-gray-400 mb-6">
                    <div className="flex items-center gap-2">
                      <FaClock className="text-purple-400" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="text-sm">{course.students.toLocaleString()} students enrolled</div>
                  </div>
                  <button className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition font-semibold">
                    Enroll Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default FreeCoursesPage;
