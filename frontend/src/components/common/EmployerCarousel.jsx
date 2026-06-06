import { motion } from 'framer-motion';
import { EMPLOYER_PARTNERS } from '../../utils/constants';

const EmployerCarousel = () => {
  // Duplicate array for infinite scroll effect
  const duplicatedLogos = [...EMPLOYER_PARTNERS, ...EMPLOYER_PARTNERS];

  return (
    <section className="py-12 bg-gradient-to-r from-gray-50 to-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <h3 className="text-center text-xl font-bold text-gray-800 mb-8">
          Our Alumni Work At
        </h3>
        
        <div className="relative overflow-hidden">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-gray-100 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-gray-100 to-transparent z-10 pointer-events-none" />
          
          <motion.div
            className="flex gap-8 whitespace-nowrap"
            animate={{ x: [0, -2000] }}
            transition={{ 
              duration: 30, 
              repeat: Infinity, 
              ease: 'linear' 
            }}
          >
            {duplicatedLogos.map((employer, index) => (
              <motion.div
                key={index}
                className="flex-shrink-0 w-48 h-24 flex flex-col items-center justify-center bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-orange-300 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl mb-2">{employer.logo}</div>
                <div className="text-center">
                  <p className="font-semibold text-gray-800 text-sm">{employer.name}</p>
                  <p className="text-xs text-gray-500">{employer.sector}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EmployerCarousel;
