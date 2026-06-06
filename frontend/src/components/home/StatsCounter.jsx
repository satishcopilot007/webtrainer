import { useState, useEffect, useRef } from 'react';
import { FaUsers, FaChalkboardTeacher, FaBook, FaBriefcase } from 'react-icons/fa';
import { STATS } from '../../utils/constants';

const ICONS = [FaUsers, FaChalkboardTeacher, FaBook, FaBriefcase];

const useCountUp = (target, isVisible, duration = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, target, duration]);

  return count;
};

const StatItem = ({ stat, icon: Icon, isVisible }) => {
  const count = useCountUp(stat.value, isVisible);

  return (
    <div className="text-center p-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
        <Icon className="text-secondary-400 text-2xl" />
      </div>
      <p className="text-4xl md:text-5xl font-bold text-white mb-2">
        {count.toLocaleString()}{stat.suffix}
      </p>
      <p className="text-gray-300 text-sm uppercase tracking-wider">{stat.label}</p>
    </div>
  );
};

const StatsCounter = () => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.3 }
    );
    const el = ref.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);

  return (
    <section
      ref={ref}
      className="py-16 bg-gradient-to-r from-primary-800 via-primary-900 to-dark-900"
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} icon={ICONS[i]} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
