import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaInstagram, FaFacebookF, FaTwitter, FaPlay } from 'react-icons/fa';
import { SOCIAL_LINKS, STATS } from '../../utils/constants';
import useUIStore from '../../store/useUIStore';

const floatingShapes = [
  { size: 'h-80 w-80', color: 'bg-violet-600/20', top: '5%', left: '-8%', delay: 0 },
  { size: 'h-72 w-72', color: 'bg-blue-500/15', top: '20%', right: '-6%', delay: 1 },
  { size: 'h-56 w-56', color: 'bg-fuchsia-500/15', bottom: '0%', left: '30%', delay: 2 },
  { size: 'h-64 w-64', color: 'bg-cyan-400/10', bottom: '5%', right: '15%', delay: 0.5 },
];

const heroStars = [
  ['8%', '18%', 2], ['14%', '74%', 1], ['22%', '42%', 1], ['31%', '88%', 2],
  ['42%', '14%', 1], ['51%', '64%', 2], ['62%', '28%', 1], ['69%', '91%', 1],
  ['77%', '48%', 2], ['84%', '20%', 1], ['89%', '70%', 1], ['95%', '37%', 2],
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const HeroSection = () => {
  const openDemoModal = useUIStore((s) => s.openDemoModal);

  return (
    <section className="relative isolate flex min-h-screen items-center overflow-hidden bg-[#050816]">
      {/* Deep navy base with layered violet/blue light, inspired by modern developer products. */}
      <div className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_70%_42%,rgba(47,112,255,0.36)_0%,rgba(38,71,194,0.2)_22%,transparent_48%),radial-gradient(circle_at_48%_88%,rgba(126,72,255,0.72)_0%,rgba(65,51,190,0.4)_27%,transparent_58%),radial-gradient(circle_at_5%_15%,rgba(38,93,225,0.36),transparent_35%),radial-gradient(circle_at_96%_8%,rgba(24,89,205,0.3),transparent_32%),linear-gradient(145deg,#03071b_0%,#07143b_46%,#0b0c32_76%,#060718_100%)]" />
      <div className="absolute inset-0 -z-20 opacity-20 [background-image:linear-gradient(rgba(148,163,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,255,0.12)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,transparent,black_35%,black_78%,transparent)]" />
      <div className="absolute inset-x-[18%] bottom-[-20%] -z-20 h-[70%] rounded-[50%] bg-violet-500/25 blur-[110px]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_28%,rgba(2,4,20,0.3)_72%,rgba(2,4,18,0.82)_100%)]" />

      {/* Small points of light give the background depth without distracting from the content. */}
      {heroStars.map(([left, top, size], index) => (
        <motion.span
          key={`${left}-${top}`}
          className="pointer-events-none absolute -z-10 rounded-full bg-white shadow-[0_0_10px_rgba(196,181,253,0.9)]"
          style={{ left, top, width: size, height: size }}
          animate={{ opacity: [0.25, 0.9, 0.25], scale: [1, 1.5, 1] }}
          transition={{ duration: 3.5 + (index % 3), repeat: Infinity, delay: index * 0.22 }}
        />
      ))}

      {/* Floating animated shapes */}
      {floatingShapes.map((shape, i) => (
        <motion.div
          key={i}
          className={`pointer-events-none absolute -z-10 rounded-full ${shape.size} ${shape.color} blur-[90px]`}
          style={{ top: shape.top, left: shape.left, right: shape.right, bottom: shape.bottom }}
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, delay: shape.delay, ease: 'easeInOut' }}
        />
      ))}

      {/* Social side bar */}
      <div className="hidden lg:flex flex-col items-center gap-6 absolute left-6 top-1/2 -translate-y-1/2 z-10">
        <div className="w-px h-16 bg-white/20" />
        <motion.a 
          href={SOCIAL_LINKS.whatsapp} 
          target="_blank" 
          rel="noopener noreferrer"
          whileHover={{ scale: 1.2, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="text-green-400 hover:text-green-300 transition-colors shadow-lg rounded-full p-3 bg-green-500/20 backdrop-blur-sm"
          title="Chat with us on WhatsApp">
          <FaWhatsapp size={28} />
        </motion.a>
        <motion.a 
          href={SOCIAL_LINKS.instagram} 
          target="_blank" 
          rel="noopener noreferrer"
          whileHover={{ scale: 1.2, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="text-pink-400 hover:text-pink-300 transition-colors shadow-lg rounded-full p-3 bg-pink-500/20 backdrop-blur-sm"
          title="Follow us on Instagram">
          <FaInstagram size={28} />
        </motion.a>
        <motion.a 
          href={SOCIAL_LINKS.facebook} 
          target="_blank" 
          rel="noopener noreferrer"
          whileHover={{ scale: 1.2, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="text-blue-400 hover:text-blue-300 transition-colors shadow-lg rounded-full p-3 bg-blue-500/20 backdrop-blur-sm"
          title="Like us on Facebook">
          <FaFacebookF size={28} />
        </motion.a>
        <motion.a 
          href={SOCIAL_LINKS.twitter} 
          target="_blank" 
          rel="noopener noreferrer"
          whileHover={{ scale: 1.2, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="text-sky-400 hover:text-sky-300 transition-colors shadow-lg rounded-full p-3 bg-sky-500/20 backdrop-blur-sm"
          title="Follow us on Twitter">
          <FaTwitter size={28} />
        </motion.a>
        <div className="w-px h-16 bg-white/20" />
      </div>

      <div className="container relative z-10 mx-auto px-6 py-36 lg:px-16 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text content */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.p variants={itemVariants}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-200 shadow-[0_0_30px_rgba(34,211,238,0.08)] backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_#67e8f9]" /> Unlock Your Potential
            </motion.p>

            <motion.h1 variants={itemVariants}
              className="mb-6 font-display text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.25)] md:text-5xl lg:text-5xl xl:text-6xl">
              Empowering Your Career Through{' '}
              <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400 bg-clip-text text-transparent">
                Expert-Led Training
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="mb-9 max-w-xl text-lg leading-relaxed text-slate-300/90">
              Join thousands of successful professionals who transformed their careers with our
              industry-relevant courses, expert mentors, and guaranteed placement support.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <Link to="/courses"
                className="rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 px-8 py-3.5 font-semibold text-white shadow-[0_12px_35px_rgba(79,70,229,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_45px_rgba(79,70,229,0.5)]">
                Explore Courses
              </Link>
              <button onClick={openDemoModal}
                className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-8 py-3.5 font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/10">
                <FaPlay size={12} /> Book Free Demo
              </button>
            </motion.div>
          </motion.div>

          {/* Right: Stats counters */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden grid-cols-2 gap-5 lg:grid"
          >
            <div className="pointer-events-none absolute inset-8 -z-10 rounded-full bg-indigo-500/25 blur-[75px]" />
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.15 }}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.14] bg-gradient-to-br from-white/[0.11] to-white/[0.035] p-7 text-center shadow-[0_20px_70px_rgba(2,4,22,0.35)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-300/30 hover:bg-white/[0.13]"
              >
                <div className="pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full bg-violet-400/10 blur-2xl transition group-hover:bg-violet-400/20" />
                <p className="bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
                  {stat.value.toLocaleString()}{stat.suffix}
                </p>
                <p className="mt-2 text-sm font-medium text-slate-300/70">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/25 to-transparent" />
    </section>
  );
};

export default HeroSection;
