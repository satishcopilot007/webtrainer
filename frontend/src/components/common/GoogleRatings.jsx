import { GOOGLE_RATINGS } from '../../utils/constants';
import { FaStar } from 'react-icons/fa';

const GoogleRatings = () => {
  return (
    <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg shadow-md border border-orange-200">
      {/* Google Logo */}
      <div className="text-2xl font-bold text-gray-800">Google</div>
      
      {/* Rating Stars */}
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={i < Math.round(GOOGLE_RATINGS.rating) ? 'text-yellow-400' : 'text-gray-300'}
            size={18}
          />
        ))}
      </div>
      
      {/* Rating Number */}
      <span className="font-bold text-lg text-gray-800">{GOOGLE_RATINGS.rating}</span>
      
      {/* Review Count */}
      <span className="text-sm text-gray-600">({GOOGLE_RATINGS.reviews.toLocaleString()} reviews)</span>
    </div>
  );
};

export default GoogleRatings;
