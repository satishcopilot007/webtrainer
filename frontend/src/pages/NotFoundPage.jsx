import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaHome } from 'react-icons/fa';

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>404 — Page Not Found | TrainerMentors</title>
      </Helmet>

      <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="text-[10rem] md:text-[14rem] font-black leading-none bg-gradient-to-r from-[#461E96] to-[#00B4E6] bg-clip-text text-transparent select-none"
          >
            404
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl md:text-3xl font-bold text-gray-800 mb-3"
          >
            Page Not Found
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-gray-500 mb-8 max-w-md mx-auto"
          >
            The page you&#39;re looking for doesn&#39;t exist or has been moved. Let&#39;s get you back on track.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-500 text-white font-semibold rounded-full hover:bg-primary-600 transition-colors shadow-lg hover:shadow-xl"
            >
              <FaHome /> Go Home
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default NotFoundPage;
