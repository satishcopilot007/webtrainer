import { Link } from 'react-router-dom';

const Logo = ({ className = '' }) => {
  return (
    <Link
      to="/"
      className={`flex items-center gap-2.5 group hover:opacity-90 transition-opacity ${className}`}
      title="TrainerMentors — Learn · Grow · Succeed"
    >
      {/* Flat-top hexagon matching the brand logo */}
      <svg
        width="48"
        height="48"
        viewBox="0 0 46 46"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
        style={{ filter: 'drop-shadow(0 2px 8px rgba(0,180,230,0.45))' }}
      >
        <defs>
          <filter id="navHexGlow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#00B4E6" floodOpacity="0.5" />
          </filter>
        </defs>
        {/* Flat-top hexagon: 0°,60°,120°,180°,240°,300° */}
        <polygon
          points="43,23 33,40 13,40 3,23 13,6 33,6"
          fill="#3B1A8F"
          stroke="#00B4E6"
          strokeWidth="2.5"
          filter="url(#navHexGlow)"
        />
        {/* Inner highlight ring */}
        <polygon
          points="41,23 32,37.5 14,37.5 5,23 14,8.5 32,8.5"
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
        />
        {/* T — white, large, top-left area */}
        <text
          x="17" y="27"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="17"
          fontWeight="900"
          fontFamily="Arial Black, Arial, sans-serif"
          letterSpacing="-1"
        >T</text>
        {/* M — cyan, bottom-right area */}
        <text
          x="29" y="35"
          textAnchor="middle"
          fill="#00D4FF"
          fontSize="11"
          fontWeight="700"
          fontFamily="Arial Black, Arial, sans-serif"
        >M</text>
      </svg>

      {/* Wordmark */}
      <div className="flex-shrink-0">
        {/* Brand name with pink underline */}
        <div className="flex items-baseline leading-none">
          <span className="font-black text-[17px] tracking-tight" style={{ color: '#3B1A8F' }}>Trainer</span>
          <span className="font-black text-[17px] tracking-tight" style={{ color: '#00B4E6' }}>Mentors</span>
        </div>
        {/* Pink accent underline — matches real logo */}
        <div
          className="rounded-full my-[2px]"
          style={{
            height: 2.5,
            background: 'linear-gradient(90deg, #FF1F8F, #FF6CB0)',
            width: '100%',
          }}
        />
        {/* Tagline */}
        <p className="text-[9px] font-medium tracking-widest" style={{ color: '#888' }}>
          Learn&nbsp;·&nbsp;Grow&nbsp;·&nbsp;Succeed
        </p>
      </div>
    </Link>
  );
};

export default Logo;
