import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const TrainingDropdown = ({ scrolled }) => {
  const [isOpen, setIsOpen] = useState(false);

  const linkTextColor = scrolled 
    ? 'text-gray-700 group-hover:text-primary-600' 
    : 'text-gray-200 group-hover:text-white';

  const dropdownBg = scrolled 
    ? 'bg-white shadow-xl' 
    : 'bg-dark-800 shadow-2xl border border-white/10';

  return (
    <div className="relative group">
      {/* Main Button */}
      <button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className={`flex items-center space-x-1 text-sm font-medium transition-colors duration-200 ${linkTextColor}`}
      >
        <span>Training Programs</span>
        <FaChevronDown className={`text-xs transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            className={`absolute left-0 mt-0 w-56 rounded-lg overflow-hidden ${dropdownBg} z-50`}
          >
            {/* Online Training */}
            <Link
              to="/online-training"
              className={`flex items-center space-x-3 px-4 py-4 transition-all ${
                scrolled 
                  ? 'hover:bg-primary-50 text-gray-700' 
                  : 'hover:bg-primary-500/20 text-gray-200'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-lg">
                🎓
              </div>
              <div>
                <div className="font-semibold">Online Training</div>
                <div className={`text-xs ${scrolled ? 'text-gray-500' : 'text-gray-400'}`}>
                  Learn at your own pace
                </div>
              </div>
            </Link>

            {/* Divider */}
            <div className={`h-px ${scrolled ? 'bg-gray-200' : 'bg-white/10'}`} />

            {/* Corporate Training */}
            <Link
              to="/corporate-training"
              className={`flex items-center space-x-3 px-4 py-4 transition-all ${
                scrolled 
                  ? 'hover:bg-secondary-50 text-gray-700' 
                  : 'hover:bg-secondary-500/20 text-gray-200'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary-500 to-primary-500 flex items-center justify-center text-white text-lg">
                🏢
              </div>
              <div>
                <div className="font-semibold">Corporate Training</div>
                <div className={`text-xs ${scrolled ? 'text-gray-500' : 'text-gray-400'}`}>
                  For your team
                </div>
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TrainingDropdown;
