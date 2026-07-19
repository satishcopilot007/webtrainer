const Loader = ({ darkTheme = false }) => {
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm ${darkTheme ? 'bg-[#0d1117]/90' : 'bg-white/80'}`}>
      <div className="relative">
        <div className={`h-16 w-16 rounded-full border-4 ${darkTheme ? 'border-[#30363d]' : 'border-gray-200'}`} />
        <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-t-primary-500 border-r-secondary-500 border-b-transparent border-l-transparent animate-spin" />
        <div className="absolute inset-2 w-12 h-12 rounded-full border-4 border-t-transparent border-r-transparent border-b-primary-400 border-l-secondary-400 animate-spin animate-reverse" style={{ animationDirection: 'reverse' }} />
      </div>
    </div>
  );
};

export default Loader;
