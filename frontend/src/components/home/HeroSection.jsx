import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaInstagram, FaFacebookF, FaTwitter, FaPlay } from 'react-icons/fa';
import { SOCIAL_LINKS, STATS } from '../../utils/constants';
import useUIStore from '../../store/useUIStore';

const floatingShapes = [
  { size: 'w-64 h-64', color: 'bg-primary-500/10', top: '10%', left: '-5%', delay: 0 },
  { size: 'w-48 h-48', color: 'bg-secondary-500/10', top: '60%', right: '-3%', delay: 1 },
  { size: 'w-32 h-32', color: 'bg-accent-pink/10', bottom: '15%', left: '20%', delay: 2 },
  { size: 'w-40 h-40', color: 'bg-accent-green/10', top: '20%', right: '15%', delay: 0.5 },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const HeroSection = () => {
  const openDemoModal = useUIStore((s) => s.openDemoModal);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-primary-900 via-dark-800 to-dark-900">
      {/* Floating animated shapes */}
      {floatingShapes.map((shape, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${shape.size} ${shape.color} blur-3xl`}
          style={{ top: shape.top, left: shape.left, right: shape.right, bottom: shape.bottom }}
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, delay: shape.delay, ease: 'easeInOut' }}
        />
      ))}

      {/* Social side bar */}
      <div className="hidden lg:flex flex-col items-center gap-6 absolute left-6 top-1/2 -translate-y-1/2 z-10">
        <div className="w-px h-16 bg-white/20" />
        <motion.a 
          href={SOCIAL_LINKS.whatsapp} 
          target="_blank" 
          rel="noopener noreferrer"
          whileHover={{ scale: 1.2, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="text-green-400 hover:text-green-300 transition-colors shadow-lg rounded-full p-3 bg-green-500/20 backdrop-blur-sm"
          title="Chat with us on WhatsApp">
          <FaWhatsapp size={28} />
        </motion.a>
        <motion.a 
          href={SOCIAL_LINKS.instagram} 
          target="_blank" 
          rel="noopener noreferrer"
          whileHover={{ scale: 1.2, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="text-pink-400 hover:text-pink-300 transition-colors shadow-lg rounded-full p-3 bg-pink-500/20 backdrop-blur-sm"
          title="Follow us on Instagram">
          <FaInstagram size={28} />
        </motion.a>
        <motion.a 
          href={SOCIAL_LINKS.facebook} 
          target="_blank" 
          rel="noopener noreferrer"
          whileHover={{ scale: 1.2, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="text-blue-400 hover:text-blue-300 transition-colors shadow-lg rounded-full p-3 bg-blue-500/20 backdrop-blur-sm"
          title="Like us on Facebook">
          <FaFacebookF size={28} />
        </motion.a>
        <motion.a 
          href={SOCIAL_LINKS.twitter} 
          target="_blank" 
          rel="noopener noreferrer"
          whileHover={{ scale: 1.2, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="text-sky-400 hover:text-sky-300 transition-colors shadow-lg rounded-full p-3 bg-sky-500/20 backdrop-blur-sm"
          title="Follow us on Twitter">
          <FaTwitter size={28} />
        </motion.a>
        <div className="w-px h-16 bg-white/20" />
      </div>

      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text content */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.p variants={itemVariants}
              className="text-secondary-400 font-semibold tracking-widest uppercase text-sm mb-4">
              Unlock Your Potential
            </motion.p>

            <motion.h1 variants={itemVariants}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Empowering Your Career Through{' '}
              <span className="bg-gradient-to-r from-secondary-400 to-accent-green bg-clip-text text-transparent">
                Expert-Led Training
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-gray-300 text-lg leading-relaxed mb-8 max-w-xl">
              Join thousands of successful professionals who transformed their careers with our
              industry-relevant courses, expert mentors, and guaranteed placement support.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <Link to="/courses"
                className="px-8 py-3.5 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-secondary-500/30 transition-all duration-300">
                Explore Courses
              </Link>
              <button onClick={openDemoModal}
                className="px-8 py-3.5 border-2 border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center gap-2">
                <FaPlay size={12} /> Book Free Demo
              </button>
            </motion.div>
          </motion.div>

          {/* Right: Stats counters */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:grid grid-cols-2 gap-6"
          >
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.15 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors"
              >
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-secondary-400 to-accent-green bg-clip-text text-transparent">
                  {stat.value.toLocaleString()}{stat.suffix}
                </p>
                <p className="text-gray-400 text-sm mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
};

export default HeroSection;
