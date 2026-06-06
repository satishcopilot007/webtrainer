/**
 * Generates avatar from name initials when photo is not available.
 * Uses DiceBear API as fallback.
 */
const AvatarGenerator = ({ name, photo, size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getColorFromName = (name) => {
    const colors = [
      'bg-primary-500', 'bg-secondary-500', 'bg-accent-pink',
      'bg-accent-green', 'bg-primary-400', 'bg-secondary-400',
    ];
    const hash = name?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
    return colors[hash % colors.length];
  };

  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        className={`${sizeMap[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div className={`${sizeMap[size]} ${getColorFromName(name)} rounded-full
                     flex items-center justify-center text-white font-bold ${className}`}>
      {getInitials(name)}
    </div>
  );
};

export default AvatarGenerator;
