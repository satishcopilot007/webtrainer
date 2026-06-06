import { motion } from 'framer-motion';

const AlumniSection = () => {
  const companies = [
    { name: 'Maven', logo: '🔶' },
    { name: 'NIMAP Infotech', logo: '🌐' },
    { name: 'Dimakh Consultants', logo: '💼' },
    { name: 'JustImprove', logo: '📊' },
    { name: 'OMFYS', logo: '⚡' },
    { name: 'KNOREX', logo: '🎯' },
    { name: 'Maven', logo: '🔶' },
    { name: 'Dell', logo: '💻' },
    { name: 'Realizer', logo: '🎨' },
    { name: 'Acer', logo: '🖥️' },
    { name: 'Adobe', logo: '🎬' },
    { name: 'Amazon', logo: '📦' },
    { name: 'Infosys', logo: '🔵' },
    { name: 'LG', logo: '⚙️' },
    { name: 'EarthFast', logo: '🌍' },
    { name: 'Jio', logo: '📡' },
    { name: 'Tech Mahindra', logo: '🔧' },
    { name: 'Wipro', logo: '🌀' },
    { name: 'Mittal Solutions', logo: '🏭' },
    { name: 'Novolex', logo: '📦' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-dark-900 to-dark-800">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Our Alumni <span className="text-primary-500">Works At</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join thousands of professionals working at leading companies worldwide
          </p>
        </motion.div>

        {/* Companies Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
        >
          {companies.map((company, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="bg-white rounded-xl p-6 flex items-center justify-center hover:shadow-lg transition-all duration-300 group cursor-pointer min-h-24 border-2 border-primary-500/20 hover:border-primary-500"
            >
              <div className="text-center">
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {company.logo}
                </div>
                <p className="text-sm font-semibold text-dark-900 group-hover:text-primary-600 transition-colors">
                  {company.name}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-xl text-gray-300 mb-6">
            Be part of a community of successful professionals
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105">
            Start Your Journey
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default AlumniSection;
