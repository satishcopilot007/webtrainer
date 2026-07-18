import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { SOCIAL_LINKS, SITE_NAME } from '../../utils/constants';

const FOOTER_QUICK_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Certificate', path: '/certificate' },
  { label: 'Webinar', path: '/webinar' },
  { label: 'Corporate', path: '/corporate' },
  { label: 'CSR', path: '/csr' },
  { label: 'Blogs', path: '/blog' },
  { label: 'Students Reviews', path: '/testimonials' },
  { label: 'Referral', path: '/referral' },
  { label: 'Feedback', path: '/feedback' },
  { label: 'Careers', path: '/careers' },
];

const COURSE_CATEGORIES = [
  { label: 'Corporate Courses', path: '/courses/corporate' },
  { label: 'Technical Courses', path: '/courses/technical' },
  { label: 'Non-Technical Courses', path: '/courses/non-technical' },
  { label: 'Software Development', path: '/courses/technical?sub_category=Software+Development' },
  { label: 'Data Science & AI', path: '/courses/technical?sub_category=Data+Science+%26+AI' },
  { label: 'Digital Marketing', path: '/courses/non-technical?sub_category=Digital+Marketing' },
];

const socialIcons = [
  { icon: FaFacebook, href: SOCIAL_LINKS.facebook, label: 'Facebook' },
  { icon: FaInstagram, href: SOCIAL_LINKS.instagram, label: 'Instagram' },
  { icon: FaLinkedin, href: SOCIAL_LINKS.linkedin, label: 'LinkedIn' },
  { icon: FaTwitter, href: SOCIAL_LINKS.twitter, label: 'Twitter' },
  { icon: FaWhatsapp, href: SOCIAL_LINKS.whatsapp, label: 'WhatsApp' },
  { icon: FaYoutube, href: SOCIAL_LINKS.youtube, label: 'YouTube' },
];

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // TODO: integrate newsletter API
    setEmail('');
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-extrabold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                {SITE_NAME}
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Empowering careers through expert-led, industry-relevant training programs
              with guaranteed placement assistance.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-3 pt-2">
              {socialIcons.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary-500 hover:text-white transition-all duration-300"
                >
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {FOOTER_QUICK_LINKS.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Course Categories */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Course Categories</h3>
            <ul className="space-y-2.5">
              {COURSE_CATEGORIES.map((cat) => (
                <li key={cat.path}>
                  <Link
                    to={cat.path}
                    className="text-sm text-gray-400 hover:text-primary-400 transition-colors duration-200"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3 text-sm text-gray-400">
                  <FaMapMarkerAlt className="text-primary-400 mt-0.5 flex-shrink-0" />
                  <span>Hyderabad, Telangana, India</span>
                </li>
                <li className="flex items-center space-x-3 text-sm text-gray-400">
                  <FaPhone className="text-primary-400 flex-shrink-0" />
                  <a href="tel:+919999999999" className="hover:text-primary-400 transition-colors">
                    +91 99999 99999
                  </a>
                </li>
                <li className="flex items-center space-x-3 text-sm text-gray-400">
                  <FaEnvelope className="text-primary-400 flex-shrink-0" />
                  <a href="mailto:info@trainermentors.com" className="hover:text-primary-400 transition-colors">
                    info@trainermentors.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-3">Newsletter</h3>
              <p className="text-xs text-gray-400 mb-3">
                Subscribe for the latest courses and career tips.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm font-medium rounded-r-lg hover:opacity-90 transition-opacity"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
