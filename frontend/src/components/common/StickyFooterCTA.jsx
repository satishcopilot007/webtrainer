import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPhone, FaTimes, FaClock, FaComment } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useUIStore from '../../store/useUIStore';
import { SOCIAL_LINKS } from '../../utils/constants';
import QuickChatModal from './QuickChatModal';

const StickyFooterCTA = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const navigate = useNavigate();
  const openDemoModal = useUIStore((s) => s.openDemoModal);
  const PHONE_NUMBER = '+91 98765 12345';

  useEffect(() => {
    // Show CTA after 3 seconds
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-6 right-6 z-50"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsVisible(false)}
              className="absolute -top-3 -left-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
            >
              <FaTimes size={14} />
            </button>

            <div className="flex flex-col gap-3">
              {/* Call Us Button - Shows Phone Number */}
              <motion.button
                onClick={() => setShowPhoneNumber(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 bg-blue-500 hover:bg-blue-600 text-white px-5 py-4 rounded-full shadow-lg transition-all duration-300"
                onMouseEnter={() => setShowTooltip('phone')}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <FaPhone size={24} />
                <span className="font-semibold hidden sm:inline">Call us</span>
                {showTooltip === 'phone' && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute right-full mr-3 bg-gray-800 text-white px-3 py-2 rounded-lg whitespace-nowrap text-sm"
                  >
                    View our number
                    <div className="absolute left-full top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-800 transform rotate-45" />
                  </motion.div>
                )}
              </motion.button>

              {/* Quick Connect Button - Opens Chat Modal */}
              <motion.button
                onClick={() => setIsChatModalOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 bg-purple-500 hover:bg-purple-600 text-white px-5 py-4 rounded-full shadow-lg transition-all duration-300"
                onMouseEnter={() => setShowTooltip('chat')}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <FaComment size={24} />
                <span className="font-semibold hidden sm:inline">Quick Chat</span>
                {showTooltip === 'chat' && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute right-full mr-3 bg-gray-800 text-white px-3 py-2 rounded-lg whitespace-nowrap text-sm"
                  >
                    Share your details
                    <div className="absolute left-full top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-800 transform rotate-45" />
                  </motion.div>
                )}
              </motion.button>
            </div>

            {/* Info Banner */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 bg-white rounded-lg p-3 shadow-lg text-center text-sm border border-purple-200"
            >
              <p className="font-semibold text-gray-800">Get Support</p>
              <p className="text-xs text-gray-600">Available 24/7</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Chat Modal */}
      <QuickChatModal isOpen={isChatModalOpen} onClose={() => setIsChatModalOpen(false)} />

      {/* Phone Number Modal */}
      <AnimatePresence>
        {showPhoneNumber && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPhoneNumber(false)}
              className="fixed inset-0 bg-black/50 z-[200]"
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-96"
            >
              <button
                onClick={() => setShowPhoneNumber(false)}
                className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
              >
                <FaTimes size={18} />
              </button>

              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FaPhone className="text-blue-500" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Call Us</h3>
                <p className="text-gray-600 mb-6 text-sm">Reach out to our support team</p>

                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 mb-6">
                  <p className="text-sm text-gray-600 mb-2">Our Phone Number</p>
                  <p className="text-3xl font-bold text-blue-600">{PHONE_NUMBER}</p>
                </div>

                <div className="flex gap-3">
                  <a
                    href={`tel:${PHONE_NUMBER.replace(/\s+/g, '')}`}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    Call Now
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(PHONE_NUMBER);
                      setShowPhoneNumber(false);
                    }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default StickyFooterCTA;
