import { motion } from 'framer-motion';
import { FaUsers, FaShieldAlt, FaAward, FaHandshake, FaCertificate, FaClock, FaGraduationCap, FaGlobeAmericas } from 'react-icons/fa';

const WhyChooseSection = () => {
  const features = [
    {
      id: 1,
      icon: FaUsers,
      title: 'Expert Trainers',
      description: 'Learn from industry veterans with 10+ years of experience'
    },
    {
      id: 2,
      icon: FaHandshake,
      title: 'Hands-On Projects',
      description: 'Real-world projects to build practical skills'
    },
    {
      id: 3,
      icon: FaAward,
      title: 'Placement Assistance',
      description: '100% placement support with guaranteed job opportunities'
    },
    {
      id: 4,
      icon: FaShieldAlt,
      title: 'Mock Interviews',
      description: 'Comprehensive interview preparation programs'
    },
    {
      id: 5,
      icon: FaCertificate,
      title: 'Certifications',
      description: 'Industry-recognized certificates upon completion'
    },
    {
      id: 6,
      icon: FaClock,
      title: 'Lifetime Access',
      description: 'Access course materials forever with lifetime updates'
    },
    {
      id: 7,
      icon: FaGraduationCap,
      title: 'Flexible Batches',
      description: 'Weekday, weekend, and customized batch options'
    },
    {
      id: 8,
      icon: FaGlobeAmericas,
      title: 'Online & Offline',
      description: 'Learn anywhere with our hybrid learning model'
    },
    {
      id: 9,
      icon: () => <span className="text-4xl">💻</span>,
      title: 'Digital Access',
      description: 'Complete digital learning platform with 24/7 support'
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
    <section className="relative overflow-hidden border-b border-[#254777] bg-gradient-to-br from-[#071b35] via-[#0b2f66] to-[#000240] py-20">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-sm uppercase tracking-widest text-primary-500 font-semibold mb-4">
            WHY SEVENMENTOR?
          </h2>
          <h3 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            Your Journey from <span className="text-primary-500">Learning</span> to
            <span className="text-primary-500"> Earning</span>
          </h3>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Comprehensive training platform designed to transform careers and build successful professionals
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                variants={itemVariants}
                className="group rounded-2xl border border-[#30363d] bg-gradient-to-br from-[#161b22] to-[#0d1117] p-8 transition-all duration-300 hover:border-[#58a6ff]/60 hover:shadow-2xl hover:shadow-blue-950/20"
              >
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="text-white text-2xl" />
                </div>

                {/* Content */}
                <h4 className="text-xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">
                  {feature.title}
                </h4>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <button className="px-10 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full font-bold text-lg hover:shadow-lg transition-all hover:scale-105">
            Start Your Learning Journey Today
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
