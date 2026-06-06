import { motion } from 'framer-motion';
import { FaStar, FaCheckCircle, FaClock, FaIndianRupee } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { generateSlug } from '../../utils/courseUtils';

const EnhancedCourseCard = ({ course, courseDetails }) => {
  const navigate = useNavigate();
  const details = courseDetails || {};

  const handleCourseClick = () => {
    const slug = generateSlug(course.name);
    navigate(`/courses/${slug}`, { state: { course } });
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      {/* Header with Icon */}
      <div className="h-28 bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center relative">
        <span className="text-6xl">{course.icon || '📚'}</span>
        
        {/* Placement Badge */}
        {details.placement && (
          <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full flex items-center gap-1">
            <FaCheckCircle className="text-green-500 text-sm" />
            <span className="text-xs font-bold text-green-600">{details.placement}% Placement</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Course Title */}
        <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 h-14">
          {course.name}
        </h3>

        {/* Rating & Reviews */}
        {details.rating && (
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={i < Math.round(details.rating) ? 'text-yellow-400' : 'text-gray-300'}
                  size={14}
                />
              ))}
            </div>
            <span className="font-bold text-gray-800 text-sm">{details.rating}</span>
            <span className="text-xs text-gray-600">({details.reviews} reviews)</span>
          </div>
        )}

        {/* Details Grid */}
        <div className="space-y-3 mb-5">
          {/* Duration */}
          {details.duration && (
            <div className="flex items-center gap-3">
              <FaClock className="text-orange-500 text-lg" />
              <div>
                <p className="text-xs text-gray-600">Duration</p>
                <p className="text-sm font-semibold text-gray-800">{details.duration} Months</p>
              </div>
            </div>
          )}

          {/* Price */}
          {details.price && (
            <div className="flex items-center gap-3">
              <FaIndianRupee className="text-orange-500 text-lg" />
              <div>
                <p className="text-xs text-gray-600">Course Fee</p>
                <p className="text-sm font-semibold text-gray-800">₹{details.price.toLocaleString()}</p>
              </div>
            </div>
          )}

          {/* Level */}
          {course.level && (
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                course.level === 'beginner' ? 'bg-green-100 text-green-700' :
                course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
              </span>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleCourseClick}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 rounded-lg transition-all duration-300 text-sm"
        >
          View Course Details
        </button>
      </div>
    </motion.div>
  );
};

export default EnhancedCourseCard;
