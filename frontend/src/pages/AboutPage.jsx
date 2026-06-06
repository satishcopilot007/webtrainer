import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  FaBullseye, FaEye, FaChalkboardTeacher, FaIndustry,
  FaProjectDiagram, FaBriefcase, FaLinkedin,
  FaRocket, FaGlobeAsia, FaBolt, FaHandshake,
  FaGraduationCap, FaUsers, FaStar, FaBuilding,
} from 'react-icons/fa';
import StatsCounter from '../components/home/StatsCounter';
import AvatarGenerator from '../components/common/AvatarGenerator';
import { getMentors } from '../api/courseApi';
import useUIStore from '../store/useUIStore';

const CORE_VALUES = [
  {
    icon: FaBullseye,
    title: 'Mentorship-First Approach',
    description: 'Every course is led by an experienced industry mentor who provides personalized guidance, feedback, and real-world insights — not just lectures.',
    color: '#461E96',
    gradient: 'from-[#461E96] to-[#735CCC]',
    bg: 'from-[#f8f5ff] to-[#ede8ff]',
    border: '#461E96',
  },
  {
    icon: FaRocket,
    title: 'Career-Driven Learning',
    description: 'Our programs are designed with one goal — your career success. From curriculum to placement support, everything is aligned to get you hired.',
    color: '#00B4E6',
    gradient: 'from-[#00B4E6] to-[#80DEFF]',
    bg: 'from-[#f0faff] to-[#e0f5ff]',
    border: '#00B4E6',
  },
  {
    icon: FaGlobeAsia,
    title: 'Accessible & Inclusive',
    description: "We believe quality education shouldn't have barriers. Our online platform makes expert mentorship accessible to learners across India.",
    color: '#E6008C',
    gradient: 'from-[#E6008C] to-[#FF6CB0]',
    bg: 'from-[#fff0f8] to-[#ffe0f0]',
    border: '#E6008C',
  },
  {
    icon: FaBolt,
    title: 'Industry-Relevant Skills',
    description: 'Our curriculum is continuously updated based on industry trends and hiring patterns, ensuring you learn skills that employers actually need.',
    color: '#00DC8C',
    gradient: 'from-[#00DC8C] to-[#8AF6BB]',
    bg: 'from-[#f0fff8] to-[#e0fff0]',
    border: '#00DC8C',
  },
];

const TIMELINE = [
  { year: '2022', title: 'TrainerMentors Founded', desc: 'Started with a vision to democratize quality tech education and make expert mentorship accessible to every aspiring professional in India.', color: '#461E96' },
  { year: '2023', title: 'First Course Launches', desc: 'Launched Python Full Stack, Web Development, and Data Science courses with hands-on, project-based curriculum.', color: '#00B4E6' },
  { year: '2023', title: 'Mentorship Program Live', desc: 'Connected our first 20+ industry mentors with learners, establishing the core of our mentor-led teaching approach.', color: '#E6008C' },
  { year: '2024', title: 'Placement Partnerships', desc: 'Established hiring partnerships with tech companies and startups, launching our dedicated placement assistance program.', color: '#735CCC' },
  { year: '2025', title: '500+ Students Milestone', desc: 'Proudly trained 500+ students with an 85% placement success rate. Alumni now work at leading companies across India.', color: '#00DC8C' },
  { year: '2026', title: 'AI-Powered Learning', desc: 'Launched AI-powered learning assistant and advanced career support services to enhance the student experience.', color: '#461E96' },
];

const PARTNERS = [
  'TCS', 'Infosys', 'Wipro', 'HCL Technologies', 'Cognizant',
  'Accenture', 'Amazon', 'Zoho', 'Freshworks', 'Capgemini',
  'Tech Mahindra', 'LTIMindtree', 'Mphasis', 'Google', 'Microsoft',
];

/* helper: ISO-3166 alpha-2 code → flag emoji (computed, no literal unicode) */
const flag = (c) => !c ? '' :
  String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65) +
  String.fromCodePoint(0x1F1E6 + c.charCodeAt(1) - 65);

const TEAM = [
  /* ── India ── */
  { name: 'Satish Kumar',   role: 'Founder & Lead Mentor',      spec: 'Full Stack Dev · Career Strategy',   exp: '12+ yrs', loc: 'Chennai, India',        country: 'IN', photo: 'https://randomuser.me/api/portraits/men/15.jpg',   linkedin: 'https://www.linkedin.com/', quote: 'Every student deserves a mentor who genuinely cares about their success.' },
  { name: 'Priya Sharma',   role: 'Senior Data Science Mentor', spec: 'ML · Python · SQL',                   exp: '9+ yrs',  loc: 'Bengaluru, India',       country: 'IN', photo: 'https://randomuser.me/api/portraits/women/22.jpg', linkedin: 'https://www.linkedin.com/', quote: 'Data science is about solving real problems, not just writing code.' },
  { name: 'Rahul Verma',    role: 'Digital Marketing Mentor',   spec: 'SEO · Google Ads · Social Media',     exp: '7+ yrs',  loc: 'Pune, India',            country: 'IN', photo: 'https://randomuser.me/api/portraits/men/41.jpg',   linkedin: 'https://www.linkedin.com/', quote: 'Marketing evolves fast — I help students stay well ahead of the curve.' },
  { name: 'Ankit Patel',    role: 'Cloud & DevOps Mentor',      spec: 'AWS · Azure · Docker · Kubernetes',   exp: '8+ yrs',  loc: 'Hyderabad, India',       country: 'IN', photo: 'https://randomuser.me/api/portraits/men/63.jpg',   linkedin: 'https://www.linkedin.com/', quote: 'Cloud skills are the future — and the future starts today.' },
  { name: 'Divya Nair',     role: 'UI/UX & Frontend Mentor',    spec: 'Figma · React · Design Systems',      exp: '6+ yrs',  loc: 'Mumbai, India',          country: 'IN', photo: 'https://randomuser.me/api/portraits/women/55.jpg', linkedin: 'https://www.linkedin.com/', quote: 'Great design earns trust — I help students build products people love.' },
  /* ── International ── */
  { name: 'James Mitchell',  role: 'ML Engineer (ex-Google)',    spec: 'AI/ML · TensorFlow · PyTorch',        exp: '11+ yrs', loc: 'San Francisco, USA',     country: 'US', photo: 'https://randomuser.me/api/portraits/men/32.jpg',   linkedin: 'https://www.linkedin.com/', quote: 'AI is the great equaliser — the right training opens doors everywhere.' },
  { name: 'Sarah Chen',     role: 'Product & Agile Coach',      spec: 'Product Mgmt · Scrum · OKRs',         exp: '10+ yrs', loc: 'Singapore',              country: 'SG', photo: 'https://randomuser.me/api/portraits/women/44.jpg', linkedin: 'https://www.linkedin.com/', quote: 'Great products are built by empowered teams. I teach students to lead.' },
  { name: "Liam O'Brien",   role: 'Cybersecurity Specialist',   spec: 'Ethical Hacking · SOC · CISSP',       exp: '9+ yrs',  loc: 'London, UK',             country: 'GB', photo: 'https://randomuser.me/api/portraits/men/28.jpg',   linkedin: 'https://www.linkedin.com/', quote: 'Cybersecurity is a mindset before it is a skillset.' },
  { name: 'Aisha Okonkwo',  role: 'Business Analytics Lead',    spec: 'Power BI · Tableau · Strategy',       exp: '8+ yrs',  loc: 'Lagos & London',         country: 'NG', photo: 'https://randomuser.me/api/portraits/women/67.jpg', linkedin: 'https://www.linkedin.com/', quote: 'Data storytelling bridges the gap between insight and business impact.' },
  { name: 'Michael Torres', role: 'Full Stack Architect',        spec: 'React · Node.js · TypeScript · GCP', exp: '10+ yrs', loc: 'Toronto, Canada',        country: 'CA', photo: 'https://randomuser.me/api/portraits/men/54.jpg',   linkedin: 'https://www.linkedin.com/', quote: 'Building scalable apps is an art — I help students truly master the craft.' },
];

const whyChooseUs = [
  {
    icon: FaChalkboardTeacher,
    title: 'Expert Mentors',
    description: 'Learn from industry professionals with 10+ years of real-world experience in top MNCs.',
  },
  {
    icon: FaIndustry,
    title: 'Industry-Aligned',
    description: 'Curriculum designed in collaboration with hiring managers to match current market demands.',
  },
  {
    icon: FaProjectDiagram,
    title: 'Hands-On Projects',
    description: 'Work on real-time projects and case studies that build your portfolio and confidence.',
  },
  {
    icon: FaBriefcase,
    title: 'Placement Support',
    description: 'Dedicated placement cell with resume building, mock interviews, and direct company referrals.',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

/* ── Partners marquee (duplicated for seamless loop) ── */
const partnerTrack = [...PARTNERS, ...PARTNERS];

const AboutPage = () => {
  const [mentors, setMentors] = useState([]);
  const openDemoModal = useUIStore((s) => s.openDemoModal);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const { data } = await getMentors();
        setMentors(data.results || data);
      } catch { /* silent */ }
    };
    fetchMentors();
  }, []);

  const teamList = mentors.length > 0 ? mentors : TEAM;

  return (
    <>
      <Helmet>
        <title>About TrainerMentors | Expert Mentorship &amp; Career Development Platform</title>
        <meta name="description" content="TrainerMentors is India's trusted career development platform — 500+ students trained, 50+ expert mentors, 85% placement rate. Mentor-led courses with real placement support." />
        <meta name="keywords" content="about TrainerMentors, online courses India, mentor-led training, placement support, career development platform" />
        <link rel="canonical" href="https://trainermentors.com/about" />
      </Helmet>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-28 text-center"
        style={{ background: 'linear-gradient(135deg, #2D1266 0%, #461E96 55%, #1a0a40 100%)' }}
      >
        {/* subtle dot grid */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-5 px-5 py-1.5 rounded-full text-sm font-medium"
            style={{ background: 'rgba(0,180,230,0.15)', border: '1px solid #00B4E6', color: '#80DEFF' }}
          >
            About TrainerMentors
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold leading-tight mb-5"
            style={{ background: 'linear-gradient(90deg,#ffffff,#80DEFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Empowering Careers Through<br />Expert Mentorship
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg leading-relaxed mb-8 max-w-2xl mx-auto"
            style={{ color: 'rgba(255,255,255,0.82)' }}
          >
            India&apos;s trusted platform connecting aspiring professionals with industry mentors
            for hands-on training, career guidance, and placement support.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <a href="/courses"
              className="px-7 py-3.5 rounded-lg font-semibold text-white text-base transition-opacity hover:opacity-90"
              style={{ background: '#00B4E6' }}>
              Explore Courses
            </a>
            <button onClick={openDemoModal}
              className="px-7 py-3.5 rounded-lg font-semibold text-base transition-colors hover:bg-white/10"
              style={{ border: '2px solid rgba(255,255,255,0.35)', color: '#fff' }}>
              Book Free Session
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Mission & Vision ─────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl p-10"
            style={{ background: 'linear-gradient(135deg,#f8f5ff,#ede8ff)', borderLeft: '5px solid #461E96' }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
              style={{ background: '#461E96' }}>
              <FaBullseye className="text-xl text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#461E96' }}>Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              At TrainerMentors, our mission is to bridge the gap between education and employment
              by providing accessible, mentor-led training programs that equip learners with
              real-world skills, industry-relevant knowledge, and the confidence to build
              successful careers.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl p-10"
            style={{ background: 'linear-gradient(135deg,#f0faff,#e0f5ff)', borderLeft: '5px solid #00B4E6' }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
              style={{ background: '#00B4E6' }}>
              <FaEye className="text-xl text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#00B4E6' }}>Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To become India&apos;s most trusted career development platform — where every learner,
              regardless of background, has access to world-class mentorship and the opportunity
              to achieve their professional dreams.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Animated Stats ──────────────────────────────────────── */}
      <StatsCounter />

      {/* ── Core Values ──────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">What We Stand For</h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">The values that drive everything we do</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CORE_VALUES.map((val, i) => (
              <motion.div
                key={val.title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 text-center hover:-translate-y-1 transition-transform duration-300"
                style={{ borderTop: `4px solid ${val.border}`, boxShadow: '0 4px 20px rgba(70,30,150,0.07)' }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${val.gradient} flex items-center justify-center mx-auto mb-5`}>
                  <val.icon className="text-2xl text-white" />
                </div>
                <h3 className="text-base font-bold text-gray-800 mb-3">{val.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{val.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Company Story ──────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Our Story</h2>
            <div className="h-1 w-16 mx-auto rounded-full" style={{ background: 'linear-gradient(90deg,#461E96,#00B4E6)' }} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 text-gray-600 text-lg leading-relaxed"
          >
            <p>
              <strong className="text-[#461E96]">TrainerMentors was born from a simple observation:</strong>{' '}
              traditional education wasn&apos;t preparing students for the real world. Founded by passionate
              educators and industry professionals, we set out to create a platform where learning meets
              real-world application — where every student gets the personalized guidance they deserve.
            </p>
            <p>
              What started as a small mentorship initiative has grown into a{' '}
              <strong className="text-[#00B4E6]">comprehensive career development platform</strong>{' '}
              offering courses in Full Stack Development, Data Science, Digital Marketing, Cloud Computing,
              and more. Our mentor-led approach ensures every learner receives hands-on training with
              projects that mirror real industry challenges.
            </p>
            <p>
              Today, TrainerMentors proudly serves{' '}
              <strong className="text-[#461E96]">hundreds of learners</strong>, partnering with
              industry professionals and hiring companies to create a seamless bridge from learning to
              employment. Our alumni work at leading tech companies, startups, and enterprises across India.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Why Choose Us</h2>
            <p className="text-gray-500 max-w-xl mx-auto">We go beyond traditional training to deliver measurable career outcomes.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, i) => (
              <motion.div
                key={item.title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow text-center"
              >
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="text-2xl text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ─────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#f8f5ff' }}>
        <div className="max-w-3xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-14"
          >
            Our Journey
          </motion.h2>

          <div className="relative pl-10">
            {/* vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 rounded-full"
              style={{ background: 'linear-gradient(180deg,#461E96,#00B4E6,#00DC8C)' }} />

            {TIMELINE.map((item, i) => (
              <motion.div
                key={`${item.year}-${i}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative mb-10 last:mb-0"
              >
                {/* dot */}
                <span
                  className="absolute -left-6 top-1 w-5 h-5 rounded-full border-4 border-[#f8f5ff]"
                  style={{ background: item.color }}
                />
                <span
                  className="inline-block px-3 py-0.5 rounded-full text-xs font-bold text-white mb-2"
                  style={{ background: item.color }}
                >
                  {item.year}
                </span>
                <h3 className="text-lg font-bold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Meet Our Mentors ──────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Our Global Mentor Network</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Industry veterans from <strong className="text-gray-700">India, USA, UK, Singapore, Canada &amp; Australia</strong> — dedicated to shaping the next generation of tech professionals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {teamList.map((mentor, i) => {
              /* support both API shape and static TEAM shape */
              const name = mentor.name || mentor.full_name;
              const role = mentor.designation || mentor.role_title || mentor.title || mentor.role;
              const spec = mentor.specialization || mentor.spec;
              const exp  = mentor.experience || mentor.experience_years || mentor.exp;
              const quote = mentor.quote_text || mentor.quote;
              return (
                <motion.div
                  key={mentor.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="relative mx-auto mb-4 w-24 h-24">
                    {(mentor.image || mentor.photo)
                      ? <img src={mentor.image || mentor.photo} alt={name} className="w-24 h-24 rounded-full mx-auto object-cover shadow-md" />
                      : <AvatarGenerator name={name} size={96} />
                    }
                    {(mentor.country) && (
                      <span className="absolute bottom-0 right-0 text-lg leading-none" title={mentor.loc || mentor.country}>
                        {flag(mentor.country)}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-gray-800">{name}</h3>
                  <p className="text-sm font-medium mb-1" style={{ color: '#461E96' }}>{role}</p>
                  {spec && <p className="text-gray-400 text-xs mb-2">{spec}</p>}
                  {(mentor.loc || exp) && (
                    <p className="text-gray-400 text-xs mb-2">
                      {mentor.loc ? mentor.loc : exp}
                      {mentor.loc && exp ? <span className="mx-1 text-gray-300">·</span> : null}
                      {mentor.loc && exp ? <span>{exp}</span> : null}
                    </p>
                  )}
                  {quote && (
                    <p className="text-gray-500 text-xs italic leading-relaxed border-t border-gray-100 pt-3">
                      &ldquo;{quote}&rdquo;
                    </p>
                  )}
                  {mentor.linkedin && (
                    <a href={mentor.linkedin} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 text-xs mt-3 hover:underline">
                      <FaLinkedin /> LinkedIn
                    </a>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Where Alumni Work (Partners Marquee) ─────────────────── */}
      <section className="py-16 bg-gray-50 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-gray-800 mb-2"
          >
            Where Our Alumni Work
          </motion.h2>
          <p className="text-gray-500 text-sm">Our graduates are hired at India&apos;s top companies</p>
        </div>

        <div className="relative overflow-hidden">
          <style>{`
            @keyframes marqueeScroll {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .tm-marquee { display:flex; width:max-content; animation: marqueeScroll 28s linear infinite; }
            .tm-marquee:hover { animation-play-state: paused; }
          `}</style>
          <div className="tm-marquee gap-5">
            {partnerTrack.map((name, i) => (
              <div key={i}
                className="flex-shrink-0 flex items-center justify-center px-7 py-3 rounded-xl font-bold text-gray-700 text-sm"
                style={{ background: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', minWidth: 130 }}>
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="py-24 text-center" style={{ background: 'linear-gradient(135deg,#461E96,#00B4E6)' }}>
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-5xl mb-4">&#x1F680;</div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Ready to Transform Your Career?
            </h2>
            <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              Book a free counseling session and discover how TrainerMentors can help you
              achieve your professional goals with expert mentorship.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={openDemoModal}
                className="px-8 py-4 rounded-lg font-bold text-base text-[#461E96] bg-white hover:bg-gray-100 transition-colors shadow-lg"
              >
                Book Free Session
              </button>
              <a
                href="/courses"
                className="px-8 py-4 rounded-lg font-bold text-base text-white transition-colors hover:bg-white/10"
                style={{ border: '2px solid rgba(255,255,255,0.4)' }}
              >
                View Courses
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
