import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaCheckCircle } from 'react-icons/fa';

const CurriculumAccordion = ({ modules = [] }) => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <div className="space-y-3">
      {modules.map((mod, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={mod.id || index}
            className="border border-gray-200 rounded-xl overflow-hidden"
          >
            {/* Header */}
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white text-sm font-bold rounded-full flex items-center justify-center">
                  {index + 1}
                </span>
                <div>
                  <h4 className="font-semibold text-dark-800">{mod.title}</h4>
                  {mod.duration && (
                    <p className="text-xs text-gray-500 mt-0.5">{mod.duration}</p>
                  )}
                </div>
              </div>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaChevronDown className="text-gray-400" />
              </motion.span>
            </button>

            {/* Content */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <ul className="px-6 py-4 space-y-2 bg-white">
                    {(mod.topics || mod.lessons || []).map((topic, tIdx) => (
                      <li key={tIdx} className="flex items-start gap-3 text-sm text-gray-600">
                        <FaCheckCircle className="text-accent-green mt-0.5 flex-shrink-0" />
                        <span>{typeof topic === 'string' ? topic : topic.title || topic.name}</span>
                      </li>
                    ))}
                    {(!mod.topics?.length && !mod.lessons?.length) && (
                      <li className="text-sm text-gray-400 italic">No topics listed yet.</li>
                    )}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default CurriculumAccordion;
