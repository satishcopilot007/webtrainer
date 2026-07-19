import { motion } from 'framer-motion';
import { EMPLOYER_PARTNERS } from '../../utils/constants';

const EmployerCarousel = () => {
  // Duplicate array for infinite scroll effect
  const duplicatedLogos = [...EMPLOYER_PARTNERS, ...EMPLOYER_PARTNERS];

  return (
    <section className="overflow-hidden border-b border-[#254777] bg-gradient-to-br from-[#071b35] via-[#0b2f66] to-[#000240] py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h3 className="mb-8 text-center text-xl font-bold text-[#f0f6fc]">
          Our Alumni Work At
        </h3>
        
        <div className="relative overflow-hidden">
          {/* Gradient Overlays */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-[#071b35] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-[#000240] to-transparent" />
          
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
                className="flex h-24 w-48 flex-shrink-0 cursor-pointer flex-col items-center justify-center rounded-lg border border-[#30363d] bg-[#161b22] shadow-sm transition-all duration-300 hover:border-[#58a6ff] hover:shadow-md"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl mb-2">{employer.logo}</div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-[#f0f6fc]">{employer.name}</p>
                  <p className="text-xs text-[#8b949e]">{employer.sector}</p>
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
