import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaChevronDown, FaShoppingCart } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import useUIStore from '../../store/useUIStore';
import useAuthStore from '../../store/useAuthStore';
import useCartStore from '../../store/useCartStore';
import { PRIMARY_NAV_LINKS, SECONDARY_NAV_LINKS } from '../../utils/constants';
import { getFreeTutorialCourses } from '../../api/courseApi';
import Logo from './Logo';
import CourseDropdown from './CourseDropdown';

const EnhancedNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [adminFreeCourses, setAdminFreeCourses] = useState([]);
  const { toggleMobileMenu, closeMobileMenu } = useUIStore();
  const { isAuthenticated, user } = useAuthStore();
  const { cartItems } = useCartStore();
  const location = useLocation();

  const isPrimaryLinkActive = (path) => {
    const [pathname, query = ''] = path.split('?');
    return location.pathname === pathname
      && new URLSearchParams(location.search).toString() === new URLSearchParams(query).toString();
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let active = true;
    getFreeTutorialCourses()
      .then((response) => {
        if (active) setAdminFreeCourses(Array.isArray(response.data?.data) ? response.data.data : []);
      })
      .catch(() => active && setAdminFreeCourses([]));
    return () => { active = false; };
  }, []);

  const contactLink = PRIMARY_NAV_LINKS.find((link) => link.path === '/contact');
  const fixedPrimaryLinks = PRIMARY_NAV_LINKS.filter((link) => link.path !== '/contact');
  const fixedPaths = new Set(fixedPrimaryLinks.map((link) => link.path));
  const dynamicPrimaryLinks = adminFreeCourses
    .filter((course) => course.slug && !fixedPaths.has(`/free-courses/${course.slug}`))
    .map((course) => ({ label: course.title, path: `/free-courses/${course.slug}` }));
  const primaryNavLinks = [...fixedPrimaryLinks, ...dynamicPrimaryLinks, ...(contactLink ? [contactLink] : [])];

  const toggleCategoryExpand = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const topNavBg = scrolled ? 'bg-white shadow-md' : 'bg-black';
  const topNavText = scrolled ? 'text-gray-700' : 'text-white';
  const topNavHover = scrolled ? 'hover:text-primary-600' : 'hover:text-orange-400';

  const bottomNavBg = scrolled ? 'bg-gray-50 border-b border-gray-200' : 'bg-gray-900 border-b border-gray-800';
  const bottomNavText = scrolled ? 'text-gray-800' : 'text-white';
  const bottomNavHover = scrolled ? 'hover:text-primary-600' : 'hover:text-orange-400';
  const bottomNavActive = scrolled ? 'text-primary-600 border-b-2 border-primary-600' : 'text-orange-400 border-b-2 border-orange-400';

  return (
    <>
      {/* TOP NAVIGATION BAR */}
      <nav className={`${topNavBg} transition-all duration-300 sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-4">
          {/* Desktop Top Navigation */}
          <div className="hidden lg:flex items-center justify-center py-2 px-6 overflow-x-auto">
            <div className="flex items-center space-x-6 whitespace-nowrap">
              {primaryNavLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={() =>
                    `text-xs font-medium transition-colors ${link.highlighted
                      ? 'rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-4 py-1.5 font-bold text-white shadow-md hover:from-orange-600 hover:to-amber-500'
                      : `${topNavText} ${topNavHover}`} ${
                      isPrimaryLinkActive(link.path)
                        ? link.highlighted ? 'ring-2 ring-orange-200' : 'text-orange-400 underline'
                        : ''
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Mobile Top Navigation */}
          <div className="lg:hidden flex items-center justify-between py-3">
            <Logo />
            <button
              className={`p-2 rounded-lg transition-colors ${topNavText}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="text-xl" />
              ) : (
                <FaBars className="text-xl" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* BOTTOM NAVIGATION BAR - Main Course Categories */}
      <nav className={`${bottomNavBg} transition-all duration-300 sticky top-12 lg:top-10 z-30`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between lg:justify-center py-3 lg:space-x-8 relative">
            {/* Desktop Logo - Hidden on mobile */}
            <div className="hidden lg:block">
              <Logo />
            </div>

            {/* Desktop Bottom Navigation */}
            <div className="hidden lg:flex items-center space-x-8 relative">
              {SECONDARY_NAV_LINKS.map((link) => (
                <div
                  key={link.path}
                  className="relative group"
                  onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.path)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `text-sm font-semibold transition-all pb-2 border-b-2 flex items-center gap-1 whitespace-nowrap ${bottomNavText} ${bottomNavHover} ${
                        isActive ? bottomNavActive : 'border-b-2 border-transparent'
                      }`
                    }
                  >
                    {link.label}
                    {link.hasDropdown && (
                      <FaChevronDown className="text-xs opacity-60 group-hover:opacity-100 transition-opacity" />
                    )}
                  </NavLink>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {link.hasDropdown && activeDropdown === link.path && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-full pt-2 z-50 w-max"
                      >
                        <CourseDropdown
                          categorySlug={link.path.split('/').pop()}
                          dropdownType={link.dropdownType}
                          scrolled={scrolled}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Auth Section - Desktop */}
            <div className="hidden lg:flex items-center space-x-3 ml-auto">
                {/* Cart Icon */}
              <Link
                to="/cart"
                className={`relative p-2 rounded-lg transition-colors ${
                  scrolled
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-white hover:bg-white/10'
                }`}
                title="Shopping Cart"
              >
                <FaShoppingCart className="text-xl" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.length > 9 ? '9+' : cartItems.length}
                  </span>
                )}
              </Link>

                {/* Auth Links */}
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    scrolled
                      ? 'bg-primary-100 text-primary-600'
                      : 'bg-primary-600 text-white'
                  }`}
                >
                  <FaUser />
                  <span className="text-sm font-medium">{user?.first_name || 'Dashboard'}</span>
                </Link>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className={`text-sm font-medium transition-colors ${bottomNavText} ${bottomNavHover}`}
                  >
                    Login
                  </NavLink>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm font-medium hover:shadow-lg transition-all"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white shadow-xl z-30"
          >
            <div className="px-4 py-6 max-w-7xl space-y-1">
              {/* Primary Navigation */}
              <div className="mb-4">
                <div className="text-xs font-bold text-gray-500 uppercase mb-2">Quick Links</div>
                {primaryNavLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={() =>
                      `block px-4 py-2 rounded-lg text-xs font-medium transition-colors ${link.highlighted
                        ? 'bg-gradient-to-r from-orange-500 to-amber-400 font-bold text-white shadow-sm'
                        :
                        isPrimaryLinkActive(link.path)
                          ? 'bg-orange-50 text-orange-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>

              <div className="border-t my-2" />

              {/* Secondary Navigation - Course Categories */}
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase mb-2">Courses</div>
                {SECONDARY_NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>

              <div className="border-t my-4" />

              {/* Cart Link */}
              <Link
                to="/cart"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <FaShoppingCart />
                <span>
                  Shopping Cart
                  {cartItems.length > 0 && (
                    <span className="ml-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                      {cartItems.length}
                    </span>
                  )}
                </span>
              </Link>

              <div className="border-t my-4" />

              {/* Auth Section */}
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-4 py-2.5 text-sm font-medium text-gray-700"
                >
                  <FaUser className="text-primary-500" />
                  <span>{user?.first_name || 'Dashboard'}</span>
                </Link>
              ) : (
                <div className="space-y-2 pt-2">
                  <NavLink
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`
                    }
                  >
                    Login
                  </NavLink>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2.5 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm font-medium text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EnhancedNavbar;
