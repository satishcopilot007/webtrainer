const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-gray-200" />
        <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-t-primary-500 border-r-secondary-500 border-b-transparent border-l-transparent animate-spin" />
        <div className="absolute inset-2 w-12 h-12 rounded-full border-4 border-t-transparent border-r-transparent border-b-primary-400 border-l-secondary-400 animate-spin animate-reverse" style={{ animationDirection: 'reverse' }} />
      </div>
    </div>
  );
};

export default Loader;
