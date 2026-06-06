import { useState } from 'react';

const FALLBACK_IMAGES = {
  course: '/images/fallback/course-default.webp',
  mentor: '/images/fallback/mentor-default.webp',
  blog: '/images/fallback/blog-default.webp',
  hero: '/images/fallback/hero-default.webp',
};

// Dynamic gradient generator based on course category
const CATEGORY_GRADIENTS = {
  'ai-ml': 'from-purple-600 to-indigo-800',
  'sap': 'from-blue-500 to-cyan-600',
  'programming': 'from-pink-500 to-rose-600',
  'cloud': 'from-green-500 to-teal-600',
  'cybersecurity': 'from-red-500 to-orange-600',
  'data-engineering': 'from-blue-600 to-purple-600',
  'devops-qa': 'from-emerald-500 to-green-700',
  'digital-marketing': 'from-yellow-500 to-orange-500',
};

const DynamicImage = ({
  src, alt, type = 'course', category = '', className = '',
  width, height, lazy = true,
}) => {
  const [imgError, setImgError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleError = () => setImgError(true);
  const handleLoad = () => setLoaded(true);

  // If image fails, show gradient placeholder with text
  if (imgError || !src) {
    const gradient = CATEGORY_GRADIENTS[category] || 'from-primary-500 to-secondary-500';
    return (
      <div className={`bg-gradient-to-br ${gradient} flex items-center
                       justify-center text-white ${className}`}>
        <div className="text-center p-4">
          <span className="text-4xl block mb-2">
            {type === 'course' ? '📚' : type === 'mentor' ? '👨‍🏫' : '📝'}
          </span>
          <span className="text-sm font-medium opacity-80">{alt}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Skeleton loader */}
      {!loaded && (
        <div className={`absolute inset-0 bg-gray-200 animate-pulse ${className}`} />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        onError={handleError}
        onLoad={handleLoad}
        loading={lazy ? 'lazy' : 'eager'}
        width={width}
        height={height}
      />
    </div>
  );
};

export default DynamicImage;
