import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaUser } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import useUIStore from '../../store/useUIStore';
import useAuthStore from '../../store/useAuthStore';
import { NAV_LINKS, SITE_NAME } from '../../utils/constants';
import Logo from './Logo';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname, closeMobileMenu]);

  const navbarClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    scrolled
      ? 'bg-white shadow-lg backdrop-blur-sm'
      : 'bg-transparent'
  }`;

  const linkClasses = (isActive) =>
    `text-sm font-medium transition-colors duration-200 ${
      scrolled
        ? isActive
          ? 'text-primary-600'
          : 'text-gray-700 hover:text-primary-600'
        : isActive
          ? 'text-white font-semibold'
          : 'text-gray-200 hover:text-white'
    }`;

  return (
    <nav className={navbarClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Logo className="flex-shrink-0" />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => linkClasses(isActive)}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop Auth & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                <FaUser className="text-primary-500" />
                <span>{user?.first_name || 'Dashboard'}</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`text-sm font-medium transition-colors ${
                    scrolled ? 'text-gray-700 hover:text-primary-600' : 'text-gray-200 hover:text-white'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`text-sm font-medium transition-colors ${
                    scrolled ? 'text-gray-700 hover:text-primary-600' : 'text-gray-200 hover:text-white'
                  }`}
                >
                  Register
                </Link>
              </>
            )}
            <Link
              to="/courses"
              className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm font-semibold rounded-full hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <FaTimes className={`text-xl ${scrolled ? 'text-gray-700' : 'text-white'}`} />
            ) : (
              <FaBars className={`text-xl ${scrolled ? 'text-gray-700' : 'text-white'}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white shadow-xl border-t"
          >
            <div className="px-4 py-6 space-y-3">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              <div className="border-t pt-4 mt-4 space-y-3">
                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-2 px-4 py-2.5 text-sm font-medium text-gray-700"
                  >
                    <FaUser className="text-primary-500" />
                    <span>{user?.first_name || 'Dashboard'}</span>
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={closeMobileMenu}
                      className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      Register
                    </Link>
                  </>
                )}
                <Link
                  to="/courses"
                  onClick={closeMobileMenu}
                  className="block text-center px-5 py-2.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm font-semibold rounded-full"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
