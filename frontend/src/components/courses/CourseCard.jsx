import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaClock, FaUserGraduate, FaShoppingCart } from 'react-icons/fa';
import DynamicImage from '../common/DynamicImage';
import StarRating from '../common/StarRating';
import { formatPrice, truncateText } from '../../utils/helpers';
import { LEVEL_COLORS } from '../../utils/constants';
import useCartStore from '../../store/useCartStore';

const CourseCard = ({ course }) => {
  const {
    id, slug, title, short_description, thumbnail, category, level,
    price, discounted_price, discount_percentage, rating, rating_count,
    duration, enrollment_count, tools_covered,
  } = course;

  const { addToCart } = useCartStore();

  const basePrice = Number(price || 0);
  const discountedPrice = Number(discounted_price || course.discount_price || course.effective_price || 0);
  const hasDiscount = discountedPrice > 0 && basePrice > 0 && discountedPrice < basePrice;
  const effectivePrice = hasDiscount ? discountedPrice : basePrice;
  const hasValidPrice = effectivePrice > 0;
  const pricingNote = course.pricing_note || 'Contact for price or drop email to contact@trainermentors.com';
  const levelClass = LEVEL_COLORS[level] || LEVEL_COLORS.beginner;
  const categorySlug = typeof category === 'object' ? category?.slug : category;
  const categoryName = typeof category === 'object' ? category?.name : category;
  const durationLabel = course.duration || (course.duration_weeks ? `${course.duration_weeks} weeks` : 'Flexible');

  const syllabusPreview = (() => {
    if (Array.isArray(course.syllabus_outline) && course.syllabus_outline.length > 0) {
      return course.syllabus_outline.slice(0, 2);
    }

    if (Array.isArray(course.modules) && course.modules.length > 0) {
      return course.modules.slice(0, 2).map((module) => {
        const moduleTitle = module?.title || module?.module || 'Module';
        const topicCount = Number(module?.topics);
        if (Number.isFinite(topicCount) && topicCount > 0) {
          return `${moduleTitle} (${topicCount} topics)`;
        }
        return moduleTitle;
      });
    }

    return [];
  })();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart({
      id,
      title,
      price: hasValidPrice ? effectivePrice : 0,
      thumbnail,
      category: categoryName,
      slug,
    });
    alert(`${title} added to cart!`);
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
    >
      {/* Thumbnail */}
      <div className="relative">
        <DynamicImage
          src={thumbnail}
          alt={title}
          type="course"
          category={categorySlug}
          className="w-full h-48 object-cover"
        />
        {categoryName && (
          <span className="absolute top-3 left-3 bg-primary-500/90 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
            {categoryName}
          </span>
        )}
        {level && (
          <span className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full ${levelClass}`}>
            {level.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <Link to={`/course/${slug}`}>
          <h3 className="font-display font-semibold text-dark-800 text-lg mb-2 line-clamp-2 hover:text-primary-500 transition-colors">
            {title}
          </h3>
        </Link>

        <p className="text-gray-500 text-sm mb-3 flex-1">
          {truncateText(short_description, 90)}
        </p>

        {syllabusPreview.length > 0 && (
          <div className="mb-3 rounded-lg bg-gray-50 p-2.5 border border-gray-100">
            <p className="text-[11px] font-semibold text-gray-600 mb-1">Syllabus Highlights</p>
            <ul className="space-y-1">
              {syllabusPreview.map((item, idx) => (
                <li key={`${slug}-syllabus-${idx}`} className="text-xs text-gray-600 line-clamp-1">• {item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Tools tags */}
        {tools_covered?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tools_covered.slice(0, 3).map((tool) => (
              <span
                key={tool}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
              >
                {tool}
              </span>
            ))}
            {tools_covered.length > 3 && (
              <span className="text-xs text-gray-400">+{tools_covered.length - 3}</span>
            )}
          </div>
        )}

        {/* Rating & meta */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <StarRating rating={rating || 0} showCount count={rating_count || 0} />
          <div className="flex items-center gap-3">
            {durationLabel && (
              <span className="flex items-center gap-1">
                <FaClock className="text-xs" /> {durationLabel}
              </span>
            )}
            {enrollment_count > 0 && (
              <span className="flex items-center gap-1">
                <FaUserGraduate className="text-xs" /> {enrollment_count}
              </span>
            )}
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary-600">
                {hasValidPrice ? formatPrice(effectivePrice) : pricingNote}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-sm text-gray-400 line-through">{formatPrice(basePrice)}</span>
                  <span className="text-xs font-semibold bg-accent-green/10 text-accent-green px-2 py-0.5 rounded">
                    {discount_percentage || Math.round((1 - discountedPrice / basePrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors"
            >
              <FaShoppingCart className="text-sm" />
              Add to Cart
            </button>
            <Link
              to={`/course/${slug}`}
              className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
