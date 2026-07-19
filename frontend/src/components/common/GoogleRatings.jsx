import { GOOGLE_RATINGS } from '../../utils/constants';
import { FaStar } from 'react-icons/fa';

const GoogleRatings = () => {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[#30363d] bg-[#161b22] px-4 py-3 shadow-lg shadow-black/20">
      {/* Google Logo */}
      <div className="text-2xl font-bold text-[#f0f6fc]">Google</div>
      
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
      <span className="text-lg font-bold text-[#f0f6fc]">{GOOGLE_RATINGS.rating}</span>
      
      {/* Review Count */}
      <span className="text-sm text-[#8b949e]">({GOOGLE_RATINGS.reviews.toLocaleString()} reviews)</span>
    </div>
  );
};

export default GoogleRatings;
