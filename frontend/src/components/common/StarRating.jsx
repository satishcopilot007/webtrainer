import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating = 0, size = 'text-sm', showCount = false, count = 0 }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<FaStar key={i} className={`${size} text-yellow-400`} />);
    } else if (i === fullStars + 1 && hasHalf) {
      stars.push(<FaStarHalfAlt key={i} className={`${size} text-yellow-400`} />);
    } else {
      stars.push(<FaRegStar key={i} className={`${size} text-yellow-400`} />);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex">{stars}</div>
      {showCount && (
        <span className="text-xs text-gray-500 ml-1">
          ({count})
        </span>
      )}
    </div>
  );
};

export default StarRating;
