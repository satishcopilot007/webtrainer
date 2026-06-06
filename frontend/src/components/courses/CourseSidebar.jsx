import { Link } from 'react-router-dom';
import {
  FaClock, FaSignal, FaLaptop, FaLanguage, FaCertificate,
  FaShareAlt, FaWhatsapp, FaLinkedin, FaTwitter,
} from 'react-icons/fa';
import AvatarGenerator from '../common/AvatarGenerator';
import { formatPrice } from '../../utils/helpers';
import { SOCIAL_LINKS } from '../../utils/constants';
import useUIStore from '../../store/useUIStore';

const CourseSidebar = ({ course }) => {
  const openDemoModal = useUIStore((s) => s.openDemoModal);

  const {
    price, discounted_price, discount_percentage,
    duration, level, mode, language, certificate,
    mentor,
  } = course;

  const hasDiscount = discounted_price && discounted_price < price;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const highlights = [
    { icon: FaClock, label: 'Duration', value: duration },
    { icon: FaSignal, label: 'Level', value: level },
    { icon: FaLaptop, label: 'Mode', value: mode },
    { icon: FaLanguage, label: 'Language', value: language || 'English' },
    { icon: FaCertificate, label: 'Certificate', value: certificate !== false ? 'Yes' : 'No' },
  ];

  return (
    <div className="sticky top-24 space-y-6">
      {/* Price card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="mb-6">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary-600">
              {formatPrice(hasDiscount ? discounted_price : price)}
            </span>
            {hasDiscount && (
              <span className="text-lg text-gray-400 line-through">{formatPrice(price)}</span>
            )}
          </div>
          {hasDiscount && (
            <span className="inline-block mt-2 text-sm font-semibold bg-accent-green/10 text-accent-green px-3 py-1 rounded-full">
              {discount_percentage || Math.round((1 - discounted_price / price) * 100)}% OFF
            </span>
          )}
        </div>

        <div className="space-y-3">
          <Link
            to={`/courses/${course.slug}/enroll`}
            className="block w-full text-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-primary-500/30 transition-all"
          >
            Enroll Now
          </Link>
          <button
            onClick={openDemoModal}
            className="block w-full text-center px-6 py-3 border-2 border-primary-500 text-primary-500 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
          >
            Book Free Demo
          </button>
        </div>
      </div>

      {/* Course highlights */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="font-display font-semibold text-dark-800 mb-4">Course Highlights</h3>
        <ul className="space-y-3">
          {highlights.map(({ icon: Icon, label, value }) =>
            value ? (
              <li key={label} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-gray-500">
                  <Icon className="text-primary-400" /> {label}
                </span>
                <span className="font-medium text-dark-800 capitalize">{value}</span>
              </li>
            ) : null
          )}
        </ul>
      </div>

      {/* Mentor card */}
      {mentor && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="font-display font-semibold text-dark-800 mb-4">Your Mentor</h3>
          <div className="flex items-center gap-4">
            <AvatarGenerator name={mentor.name} photo={mentor.photo} size="lg" />
            <div>
              <p className="font-semibold text-dark-800">{mentor.name}</p>
              <p className="text-sm text-gray-500">{mentor.title || mentor.designation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Share */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="font-display font-semibold text-dark-800 mb-4 flex items-center gap-2">
          <FaShareAlt className="text-primary-400" /> Share this Course
        </h3>
        <div className="flex gap-3">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(course.title + ' ' + shareUrl)}`}
            target="_blank" rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <FaWhatsapp />
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank" rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <FaLinkedin />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(course.title)}`}
            target="_blank" rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <FaTwitter />
          </a>
        </div>
      </div>
    </div>
  );
};

export default CourseSidebar;
