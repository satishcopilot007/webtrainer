import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaHandsHelping, FaHeart, FaGraduationCap } from 'react-icons/fa';

const CSRPage = () => {
  const initiatives = [
    { icon: <FaGraduationCap className="text-4xl" />, title: 'Free Courses for Underprivileged', desc: '5000+ students trained for free' },
    { icon: <FaHeart className="text-4xl" />, title: 'Healthcare Worker Training', desc: 'Skill development for medical professionals' },
    { icon: <FaHandsHelping className="text-4xl" />, title: 'Community Programs', desc: 'Empowering local communities' },
  ];

  return (
    <>
      <Helmet>
        <title>CSR Initiatives | TrainerMentors</title>
        <meta name="description" content="Our corporate social responsibility programs" />
      </Helmet>

      <section className="pt-32 pb-16 bg-gradient-to-br from-green-900 via-dark-800 to-dark-900">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="text-6xl mb-4">❤️</div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">CSR Initiatives</h1>
            <p className="text-xl text-gray-300">Making a difference in the community</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-dark-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {initiatives.map((init, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl p-8 text-center"
              >
                <div className="text-green-400 mb-4">{init.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{init.title}</h3>
                <p className="text-gray-400">{init.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="bg-green-600/20 border border-green-500/50 rounded-2xl p-8 text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Join Our Mission</h2>
            <p className="text-gray-300 mb-6">Help us empower underprivileged communities through education</p>
            <button className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition">
              Donate / Support
            </button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default CSRPage;
