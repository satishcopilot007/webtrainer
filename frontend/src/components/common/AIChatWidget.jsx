import { useState, useEffect, useRef } from 'react';

// ── TrainerMentors Hexagon Logo (flat-top, matches brand logo) ─────────────────
const HexLogo = ({ size = 44 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 46" width={size} height={size}>
    <defs>
      <filter id="hexGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#00B4E6" floodOpacity="0.6"/>
      </filter>
    </defs>
    {/* Flat-top hexagon: vertices at 0°,60°,120°,180°,240°,300° */}
    <polygon
      points="43,23 33,40 13,40 3,23 13,6 33,6"
      fill="#3B1A8F"
      stroke="#00B4E6"
      strokeWidth="2.5"
      filter="url(#hexGlow)"
    />
    {/* Inner hex highlight */}
    <polygon points="41,23 32,37.5 14,37.5 5,23 14,8.5 32,8.5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
    {/* T - large, white, top-left area */}
    <text x="17" y="27" textAnchor="middle" fill="#ffffff" fontSize="17" fontWeight="900" fontFamily="Arial Black,Arial,sans-serif" letterSpacing="-1">T</text>
    {/* M - cyan, bottom-right area */}
    <text x="29" y="35" textAnchor="middle" fill="#00D4FF" fontSize="11" fontWeight="700" fontFamily="Arial Black,Arial,sans-serif">M</text>
  </svg>
);

const MiniHexLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 46" width="22" height="22">
    <polygon points="43,23 33,40 13,40 3,23 13,6 33,6" fill="#3B1A8F" stroke="#00B4E6" strokeWidth="2.5"/>
    <text x="17" y="27" textAnchor="middle" fill="#ffffff" fontSize="17" fontWeight="900" fontFamily="Arial Black,Arial,sans-serif" letterSpacing="-1">T</text>
    <text x="29" y="35" textAnchor="middle" fill="#00D4FF" fontSize="11" fontWeight="700" fontFamily="Arial Black,Arial,sans-serif">M</text>
  </svg>
);

// ── Full Logo Wordmark (for header) ────────────────────────────────────────────
const HeaderLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 11, flex: 1 }}>
    {/* Hex icon with glass bg */}
    <div style={{
      width: 48, height: 48, borderRadius: 12,
      background: 'rgba(255,255,255,0.12)',
      border: '1px solid rgba(0,180,230,0.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      boxShadow: '0 2px 12px rgba(0,180,230,0.3)',
    }}>
      <HexLogo size={40} />
    </div>
    {/* Wordmark */}
    <div style={{ lineHeight: 1 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 0 }}>
          <span style={{ fontWeight: 800, fontSize: 15.5, color: '#ffffff', letterSpacing: 0.2 }}>Trainer</span>
          <span style={{ fontWeight: 800, fontSize: 15.5, color: '#00D4FF', letterSpacing: 0.2 }}>Mentors</span>
        </div>
        {/* Pink accent underline matching brand logo */}
        <div style={{ height: 2.5, background: 'linear-gradient(90deg, #FF1F8F, #FF6CB0)', borderRadius: 2, width: '100%', marginBottom: 4 }} />
      </div>
      <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{
          width: 6, height: 6, background: '#00DC8C', borderRadius: '50%',
          display: 'inline-block', animation: 'tmPulse 2s infinite', flexShrink: 0,
        }} />
        <span>Mentor · AI Assistant</span>
      </div>
    </div>
  </div>
);

// ── Footer Logo (mini hex + wordmark with tagline) ─────────────────────────────
const FooterLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 46" width="18" height="18">
      <polygon points="43,23 33,40 13,40 3,23 13,6 33,6" fill="#3B1A8F" stroke="#00B4E6" strokeWidth="2.5"/>
      <text x="17" y="27" textAnchor="middle" fill="#ffffff" fontSize="17" fontWeight="900" fontFamily="Arial Black,Arial,sans-serif" letterSpacing="-1">T</text>
      <text x="29" y="35" textAnchor="middle" fill="#00D4FF" fontSize="11" fontWeight="700" fontFamily="Arial Black,Arial,sans-serif">M</text>
    </svg>
    <span style={{ fontSize: 11, color: '#555' }}>
      <strong style={{ color: '#3B1A8F' }}>Trainer</strong><strong style={{ color: '#00B4E6' }}>Mentors</strong>
      <span style={{ color: '#FF1F8F', margin: '0 3px' }}>·</span>
      <span style={{ color: '#888', fontSize: 10 }}>Learn · Grow · Succeed</span>
    </span>
  </div>
);

// ── FAQ Knowledge Base ─────────────────────────────────────────────────────────
const FAQ_DB = {
  'what is trainermentors': 'TrainerMentors is a premier training and mentorship platform connecting learners with industry-expert mentors. 🚀<br><br>We offer 747+ courses in <strong>Technology, Corporate, and Non-Technical</strong> domains — with personalized learning paths, live mentorship, and real-world projects.<br><br>Ready to explore? Which area interests you?',

  'courses': 'We offer 747+ courses across 3 main categories: 📚<br><br>• <strong>Technical</strong> (525): Web Dev, Data Science, AI/ML, Cloud, Cybersecurity, DevOps<br>• <strong>Corporate</strong> (106): SAP, Project Mgmt, HR, Leadership, Finance<br>• <strong>Non-Technical</strong> (116): Digital Marketing, Graphic Design, UI/UX<br><br>All come with certification! Which area interests you most?',

  'certificate': 'Yes! 🎓 Every course at TrainerMentors includes:<br><br>• Industry-recognized completion certificate<br>• LinkedIn-shareable digital badge<br>• Recognized by 500+ hiring partners globally<br><br>Want to see which certifications are most in-demand in your field?',

  'certification': 'Yes! 🎓 Every course at TrainerMentors includes:<br><br>• Industry-recognized completion certificate<br>• LinkedIn-shareable digital badge<br>• Recognized by 500+ hiring partners globally<br><br>Want to see which certifications are most in-demand in your field?',

  'pricing': 'Our pricing is flexible for every budget: 💰<br><br>• Self-paced courses: Starting ₹999/month<br>• Live mentorship: Starting ₹2,999/month<br>• Corporate training: Custom packages<br>• ✅ 7-day free trial on all plans<br><br>Would you like details on a specific plan?',

  'how much': 'Our pricing is flexible for every budget: 💰<br><br>• Self-paced courses: Starting ₹999/month<br>• Live mentorship: Starting ₹2,999/month<br>• Corporate training: Custom packages<br>• ✅ 7-day free trial on all plans<br><br>Would you like details on a specific plan?',

  'mentorship': 'Our mentorship is personalized and flexible! 👨‍🏫<br><br>1. Choose your mentor by expertise & ratings<br>2. Book a 30 or 60-minute 1-on-1 session<br>3. Get guidance on projects, career & skills<br>4. Receive resources & action items after<br><br>🎁 <strong>Your first discovery call is FREE!</strong> Want to book one?',

  'mentor': 'Our mentors are industry experts with 5+ years of experience! 👨‍🏫<br><br>• Vetted through a rigorous 5-step process<br>• Experts in 40+ domains<br>• Avg. 4.8★ rating from learners<br>• Available weekdays, weekends & flexible slots<br><br>Want to find a mentor in your field?',

  'refund': 'Absolutely worry-free! 😊<br><br>We offer a <strong>7-day money-back guarantee</strong> on all courses. If you\'re not satisfied for any reason, just email <strong>support@trainermentors.com</strong> within 7 days for a full refund — no questions asked.',

  'placement': 'Our placement support is outstanding! 🚀<br><br>• Resume building & review sessions<br>• Mock interviews with industry experts<br>• Direct referrals to 500+ hiring partners<br>• LinkedIn profile optimization<br>• <strong>95% placement rate</strong> for premium plan learners<br><br>This is included in our premium mentorship plans. Interested?',

  'job': 'Our placement support is outstanding! 🚀<br><br>• Resume building & review sessions<br>• Mock interviews with industry experts<br>• Direct referrals to 500+ hiring partners<br>• LinkedIn profile optimization<br>• <strong>95% placement rate</strong> for premium plan learners<br><br>Want to know more about our placement program?',

  'contact': 'Here\'s how to reach us: 📬<br><br>• 📧 Email: support@trainermentors.com<br>• 💬 This chat (I\'m available 24/7!)<br>• 📞 Call: Available 9AM–7PM IST<br>• 🌐 Website: trainermentors.com<br><br>How would you prefer to connect?',

  'support': 'I\'m here to help! 🙏<br><br>For technical issues:<br>📧 support@trainermentors.com<br>📞 9AM–7PM IST<br><br>I can also help with common questions right here. What are you facing?',

  'mobile app': 'Our mobile app is coming soon! 📱<br><br>For now, our website is fully optimized for mobile browsers — you can access all courses, mentor sessions, and your dashboard from any device.<br><br>Want to get notified when the app launches?',

  'free': 'Great news! ✅ We offer:<br><br>• <strong>7-day free trial</strong> on all subscription plans<br>• <strong>Free first discovery call</strong> with any mentor<br>• <strong>Free sample lessons</strong> in select courses<br><br>Want to start your free trial today?',

  'data science': 'Great choice! Data Science is one of our most popular tracks. 📊<br><br>Our catalog includes:<br>• Python for Data Science<br>• Machine Learning & AI<br>• SQL & Analytics<br>• Tableau & Power BI<br>• Big Data with Hadoop & Spark<br><br>All levels available — Beginner to Advanced. Which fits your current level?',

  'web development': 'Web development is a top-rated track at TrainerMentors! 💻<br><br>We cover:<br>• HTML/CSS/JavaScript fundamentals<br>• React, Node.js, Full Stack<br>• MERN/MEAN Stack<br>• REST APIs & Databases<br><br>Want to see the full web dev catalog?',

  'cloud': 'Cloud computing is booming! ☁️ We offer:<br><br>• AWS Solutions Architect & Developer<br>• Microsoft Azure Fundamentals & Expert<br>• Google Cloud Platform (GCP)<br>• DevOps with Docker & Kubernetes<br><br>All come with industry-recognized certifications. Interested?',

  'why': 'Here\'s why 10,000+ learners choose TrainerMentors: 🌟<br><br>• ✅ 747+ industry-aligned courses<br>• 👨‍🏫 Expert mentors (5★ avg rating)<br>• 🎓 Globally recognized certificates<br>• 💼 95% placement success rate<br>• 🔄 1-Year free course repeat policy<br>• 📹 Lifetime access to recordings<br><br>Ready to join our community?',

  'sap': 'We offer comprehensive SAP training! 🏢<br><br>Modules available:<br>• SAP FICO, SAP MM, SAP SD<br>• SAP HR/HCM, SAP ABAP<br>• SAP S/4HANA, SAP Basis<br>• SAP Business One<br><br>Classroom, Online, and 1-on-1 modes available. Which SAP module interests you?',

  'digital marketing': 'Digital Marketing is a fast-growing field! 📱<br><br>Our courses cover:<br>• SEO & SEM fundamentals<br>• Social Media Marketing<br>• Google Ads & Analytics<br>• Email Marketing & Automation<br>• Content Strategy<br><br>All with hands-on projects and certification. Interested?',
};

// ── Intent Classifier ─────────────────────────────────────────────────────────
function classifyIntent(message) {
  const lower = message.toLowerCase();
  if (/\b(course|learn|training|bootcamp|class|program|skill|study|tutorial|catalog|subject)\b/.test(lower)) return 'course';
  if (/\b(mentor|coach|guide|1-on-1|one.on.one|session|1on1|expert)\b/.test(lower)) return 'mentor';
  if (/\b(price|cost|fee|payment|plan|subscription|how much|rupee|affordable|cheap|expensive|budget)\b/.test(lower)) return 'pricing';
  if (/\b(help|issue|problem|login|password|refund|cancel|error|stuck|not working)\b/.test(lower)) return 'support';
  if (/\b(certificate|certified|certification|credential|badge|recognized)\b/.test(lower)) return 'certificate';
  if (/\b(placement|job|hire|hiring|interview|resume|career|company|recruit)\b/.test(lower)) return 'placement';
  if (/\b(contact|reach|email|phone|call|whatsapp|address|location)\b/.test(lower)) return 'contact';
  if (/\b(free|trial|demo|sample|preview|try)\b/.test(lower)) return 'free';
  return 'general';
}

// ── Contextual Quick Actions ───────────────────────────────────────────────────
const QUICK_ACTIONS = {
  default: [
    { label: '📚 Browse Courses', msg: 'Show me your courses' },
    { label: '👨‍🏫 Find a Mentor', msg: 'How does mentorship work?' },
    { label: '💰 View Pricing', msg: 'What are your pricing plans?' },
    { label: '📅 Free Session', msg: 'I want to book a free demo session' },
  ],
  course: [
    { label: '💻 Tech Courses', msg: 'Show me technical courses' },
    { label: '📊 Data Science', msg: 'Tell me about data science courses' },
    { label: '☁️ Cloud/AWS', msg: 'What cloud computing courses do you offer?' },
    { label: '🏢 Corporate', msg: 'Show me corporate training courses' },
  ],
  mentor: [
    { label: '📅 Book 1-on-1', msg: 'How do I book a mentorship session?' },
    { label: '💰 Mentor Pricing', msg: 'What does mentorship cost?' },
    { label: '🌟 Why Choose Us?', msg: 'Why should I choose TrainerMentors?' },
    { label: '📚 Browse Courses', msg: 'Show me your courses' },
  ],
  pricing: [
    { label: '🎁 Free Trial', msg: 'Is there a free trial available?' },
    { label: '🏢 Corporate Plans', msg: 'Do you offer corporate training packages?' },
    { label: '📅 Book Demo', msg: 'Book a free demo session' },
    { label: '💬 Talk to Us', msg: 'I want to discuss pricing with your team' },
  ],
  support: [
    { label: '📧 Email Support', msg: 'How do I contact support?' },
    { label: '💰 Refund Policy', msg: 'What is your refund policy?' },
    { label: '💬 Talk to Human', msg: 'I need to speak with a person from your team' },
    { label: '📚 Browse Courses', msg: 'Show me your courses' },
  ],
  certificate: [
    { label: '🎓 View Certs', msg: 'Which certifications do you offer?' },
    { label: '💼 Placement Help', msg: 'Do you help with job placements?' },
    { label: '📚 Browse Courses', msg: 'Show me your courses' },
    { label: '📅 Book Demo', msg: 'Book a free demo session' },
  ],
  placement: [
    { label: '💼 Placement Details', msg: 'Tell me more about placement support' },
    { label: '🎓 Certifications', msg: 'What certifications do you offer?' },
    { label: '👨‍🏫 Find a Mentor', msg: 'Connect me with a career mentor' },
    { label: '📅 Book Demo', msg: 'Book a free consultation' },
  ],
  free: [
    { label: '🎁 Start Free Trial', msg: 'How do I start the free trial?' },
    { label: '📅 Book Free Demo', msg: 'I want to book a free session' },
    { label: '📚 Browse Courses', msg: 'Show me your courses' },
    { label: '💰 View Plans', msg: 'What are your pricing plans?' },
  ],
  contact: [
    { label: '📧 Email Us', msg: 'What is your email address?' },
    { label: '📅 Book Session', msg: 'I want to book a call with your team' },
    { label: '💬 Chat Now', msg: 'I have more questions' },
    { label: '📚 Browse Courses', msg: 'Show me your courses' },
  ],
};

// ── Response Generator ─────────────────────────────────────────────────────────
function generateResponse(message, intent) {
  const lower = message.toLowerCase();

  // Check FAQ database first (keyword match)
  for (const [key, answer] of Object.entries(FAQ_DB)) {
    if (lower.includes(key)) return answer;
  }

  // Intent-based fallback responses
  const responses = {
    course: `Great choice! 🎓 We offer <strong>747+ courses</strong> across 3 categories:<br><br>• <strong>Technical</strong> (525): Web Dev, Data Science, AI/ML, Cloud, DevOps<br>• <strong>Corporate</strong> (106): SAP, Project Mgmt, HR, Leadership<br>• <strong>Non-Technical</strong> (116): Digital Marketing, Design, UI/UX<br><br>Which area interests you most? I can suggest the perfect course!`,
    mentor: `Our mentors are industry experts with 5+ years experience! 👨‍🏫<br><br>Sessions cover: 1-on-1 coaching, project guidance, career counseling & mock interviews.<br><br>🎁 <strong>Your first discovery call is FREE!</strong><br><br>Would you like to book one?`,
    pricing: `Our plans are designed to fit every budget: 💰<br><br>• Self-paced courses: Starting ₹999/month<br>• Live mentorship: Starting ₹2,999/month<br>• Corporate packages: Custom pricing<br>• ✅ 7-day free trial available!<br><br>Which plan sounds right for you?`,
    support: `I want to make sure you get the best help! 🙏<br><br>📧 Email: <strong>support@trainermentors.com</strong><br>📞 Phone: 9AM–7PM IST<br>💬 Or keep chatting — I can solve most issues!<br><br>What's the issue you're facing?`,
    certificate: `Yes! 🎓 All our 747+ courses include industry-recognized certificates.<br><br>• Globally accepted by 500+ companies<br>• LinkedIn-shareable digital badges<br>• Verifiable credentials<br><br>Want to see which certifications are most in-demand?`,
    placement: `Our placement support is exceptional! 🚀<br><br>• Resume building workshops<br>• Mock interviews with industry experts<br>• Direct referrals to 500+ hiring partners<br>• LinkedIn optimization<br>• <strong>95% placement rate</strong> for premium learners<br><br>Interested in our placement program?`,
    free: `Great timing! 🎁 Here's what's free at TrainerMentors:<br><br>• 7-day free trial on all plans<br>• First mentor discovery call — FREE<br>• Sample lessons in select courses<br><br>Want to start your free trial right now?`,
    contact: `Here's how to reach us! 📬<br><br>• 📧 <strong>support@trainermentors.com</strong><br>• 💬 This chat (available 24/7)<br>• 🌐 trainermentors.com<br><br>How can I help you today?`,
    general: `Thanks for reaching out to TrainerMentors! 😊<br><br>I'm <strong>Mentor</strong>, your AI learning guide. I can help you with:<br>• 📚 Finding the perfect course<br>• 👨‍🏫 Connecting with expert mentors<br>• 💰 Understanding our plans<br>• 💼 Placement & career support<br><br>What would you like to explore?`,
  };

  return responses[intent] || responses.general;
}

// ── Time-based Welcome Message ─────────────────────────────────────────────────
function getWelcomeMessage() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return `Good morning! ☀️ I'm <strong>Mentor</strong>, your AI guide at TrainerMentors.<br><br>Ready to kickstart your learning journey today? I can help you find the perfect course, connect you with an expert mentor, or answer any questions!<br><br>What skill are you looking to build?`;
  } else if (hour >= 12 && hour < 17) {
    return `Hi there! 👋 I'm <strong>Mentor</strong> — your AI assistant at TrainerMentors.<br><br>I can help you with:<br>• 📚 Finding the right course for your goals<br>• 👨‍🏫 Connecting with expert mentors<br>• 💰 Understanding pricing & plans<br>• 📅 Booking a free consultation<br><br>What would you like to explore?`;
  } else if (hour >= 17 && hour < 21) {
    return `Good evening! 🌆 Welcome to TrainerMentors.<br><br>I'm <strong>Mentor</strong>, your AI learning guide. Whether you're exploring a career change or leveling up your skills — I'm here to help.<br><br>What's your learning goal?`;
  }
  return `Hey, night owl! 🦉 Welcome to TrainerMentors.<br><br>I'm <strong>Mentor</strong>, your AI learning guide. Late-night learning is a great habit!<br><br>Tell me — what skill are you looking to build?`;
}

// ── Inline Styles ──────────────────────────────────────────────────────────────
const S = {
  toggle: {
    position: 'fixed', bottom: 24, right: 24, width: 64, height: 64,
    borderRadius: '50%', border: '2.5px solid rgba(0,180,230,0.6)', cursor: 'pointer',
    background: 'linear-gradient(145deg, #2D1070 0%, #461E96 55%, #6A35CC 100%)',
    boxShadow: '0 4px 20px rgba(70,30,150,0.55), 0 0 0 4px rgba(0,180,230,0.18)',
    zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'transform 0.25s, box-shadow 0.25s',
  },
  window: (open) => ({
    position: 'fixed', bottom: 100, right: 24, width: 380,
    maxHeight: 570, background: '#fff', borderRadius: 18,
    boxShadow: '0 10px 50px rgba(0,0,0,0.18)',
    zIndex: 10001, display: open ? 'flex' : 'none',
    flexDirection: 'column', overflow: 'hidden',
    animation: open ? 'tmSlideUp 0.28s ease-out' : 'none',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  }),
  header: {
    background: 'linear-gradient(135deg, #2D1070 0%, #461E96 50%, #6A35CC 100%)',
    padding: '13px 16px',
    display: 'flex', alignItems: 'center', gap: 10,
    boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
  },
  closeBtn: {
    marginLeft: 'auto', background: 'none', border: 'none',
    color: 'rgba(255,255,255,0.8)', fontSize: 22, cursor: 'pointer',
    lineHeight: 1, padding: '0 4px',
  },
  messages: {
    flex: 1, overflowY: 'auto', padding: 14,
    background: '#F7F7FA', maxHeight: 300,
    scrollbarWidth: 'thin',
  },
  msgRow: (type) => ({
    display: 'flex', gap: 8, marginBottom: 12, alignItems: 'flex-end',
    flexDirection: type === 'user' ? 'row-reverse' : 'row',
    animation: 'tmFadeIn 0.3s ease',
  }),
  msgAvatar: (type) => ({
    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
    background: type === 'user' ? '#00B4E6' : '#461E96',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 11, fontWeight: 700, color: '#fff',
  }),
  bubble: (type) => ({
    maxWidth: '76%', padding: '10px 14px', borderRadius: 16,
    fontSize: 13.5, lineHeight: 1.55, color: '#333',
    background: type === 'user' ? '#461E96' : '#ffffff',
    color: type === 'user' ? '#ffffff' : '#333333',
    borderBottomRightRadius: type === 'user' ? 4 : 16,
    borderBottomLeftRadius: type === 'bot' ? 4 : 16,
    boxShadow: type === 'bot' ? '0 1px 4px rgba(0,0,0,0.07)' : 'none',
  }),
  quickActions: {
    display: 'flex', flexWrap: 'wrap', gap: 7, padding: '8px 14px',
    background: '#F7F7FA', borderTop: '1px solid #eee',
  },
  quickBtn: {
    padding: '5px 12px', border: '1.5px solid #461E96',
    borderRadius: 20, background: '#fff', color: '#461E96',
    fontSize: 12, fontWeight: 500, cursor: 'pointer',
    transition: 'all 0.18s',
  },
  inputRow: {
    display: 'flex', alignItems: 'center', padding: '10px 14px',
    background: '#fff', borderTop: '1px solid #eee', gap: 8,
  },
  input: {
    flex: 1, border: '1px solid #ddd', borderRadius: 24,
    padding: '9px 15px', fontSize: 13.5, outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  sendBtn: {
    width: 38, height: 38, borderRadius: '50%',
    background: '#461E96', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background 0.2s', flexShrink: 0,
  },
  footer: {
    textAlign: 'center', padding: '6px 0 8px',
    fontSize: 10, color: '#999', background: '#fff',
    borderTop: '1px solid #f0f0f0',
  },
  typingDot: (delay) => ({
    width: 8, height: 8, borderRadius: '50%',
    background: '#aaa', display: 'inline-block', margin: '0 2px',
    animation: `tmDot 1.4s ease-in-out ${delay}s infinite`,
  }),
};

// ── AIChatWidget Component ─────────────────────────────────────────────────────
const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [quickActions, setQuickActions] = useState(QUICK_ACTIONS.default);
  const [hoverToggle, setHoverToggle] = useState(false);
  const messagesEndRef = useRef(null);
  const initialized = useRef(false);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const openChat = () => {
    setIsOpen(true);
    if (!initialized.current) {
      initialized.current = true;
      setTimeout(() => {
        setMessages([{ id: 1, type: 'bot', text: getWelcomeMessage() }]);
      }, 250);
    }
    setTimeout(() => inputRef.current?.focus(), 350);
  };

  const toggleChat = () => {
    if (isOpen) setIsOpen(false);
    else openChat();
  };

  const addMessage = (type, text) => {
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), type, text }]);
  };

  const handleSend = (overrideText) => {
    const msg = (overrideText !== undefined ? overrideText : inputText).trim();
    if (!msg) return;

    addMessage('user', msg);
    setInputText('');
    setIsTyping(true);

    const intent = classifyIntent(msg);
    setQuickActions(QUICK_ACTIONS[intent] || QUICK_ACTIONS.default);

    const delay = 900 + Math.random() * 600;
    setTimeout(() => {
      setIsTyping(false);

      // Escalation: if user wants human
      if (/\b(human|person|agent|representative|staff|team member|speak to someone|talk to someone)\b/i.test(msg)) {
        addMessage('bot', `I completely understand — let me connect you with our team! 🙏<br><br>📧 Email: <strong>support@trainermentors.com</strong><br>📞 Phone: 9AM–7PM IST<br><br>Or leave your email here and we'll reach out to you within 2 hours. Would you like to do that?`);
        return;
      }

      addMessage('bot', generateResponse(msg, intent));
    }, delay);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-open after 30s for first-time visitors
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!localStorage.getItem('tm_chat_visited') && !isOpen) {
        openChat();
        localStorage.setItem('tm_chat_visited', 'true');
      }
    }, 30000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Keyframes injected once */}
      <style>{`
        @keyframes tmBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes tmSlideUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes tmFadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes tmPulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes tmDot { 0%,100%{transform:translateY(0);opacity:0.4} 50%{transform:translateY(-6px);opacity:1} }
        .tm-quick-btn:hover { background:#461E96!important; color:#fff!important; }
        .tm-send-btn:hover { background:#00B4E6!important; }
        .tm-chat-input:focus { border-color:#461E96!important; }
        .tm-msg-link a { color:#00B4E6; text-decoration:underline; }
        @media(max-width:480px){
          .tm-chat-window-wrap { width:calc(100% - 16px)!important; right:8px!important; bottom:80px!important; max-height:72vh!important; }
        }
      `}</style>

      {/* Toggle Button */}
      <button
        onClick={toggleChat}
        onMouseEnter={() => setHoverToggle(true)}
        onMouseLeave={() => setHoverToggle(false)}
        style={{
          ...S.toggle,
          animation: isOpen ? 'none' : 'tmBounce 2.5s ease-in-out infinite',
          transform: hoverToggle ? 'scale(1.12)' : 'scale(1)',
          boxShadow: hoverToggle
            ? '0 6px 32px rgba(70,30,150,0.75), 0 0 0 6px rgba(0,180,230,0.3)'
            : S.toggle.boxShadow,
        }}
        title="Chat with Mentor — TrainerMentors AI"
        aria-label="Open AI chat assistant"
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" width={26} height={26} fill="white">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        ) : (
          <HexLogo size={34} />
        )}
      </button>

      {/* Chat Window */}
      <div className="tm-chat-window-wrap" style={S.window(isOpen)} role="dialog" aria-label="TrainerMentors AI Chat">

        {/* Header */}
        <div style={S.header}>
          <HeaderLogo />
          <button onClick={() => setIsOpen(false)} style={S.closeBtn} aria-label="Close chat" title="Close">×</button>
        </div>

        {/* Messages */}
        <div style={S.messages}>
          {messages.map((msg) => (
            <div key={msg.id} style={S.msgRow(msg.type)}>
              <div style={S.msgAvatar(msg.type)}>
                {msg.type === 'bot' ? <MiniHexLogo /> : 'You'}
              </div>
              <div
                className="tm-msg-link"
                style={S.bubble(msg.type)}
                dangerouslySetInnerHTML={{ __html: msg.text }}
              />
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div style={S.msgRow('bot')}>
              <div style={S.msgAvatar('bot')}><MiniHexLogo /></div>
              <div style={{ ...S.bubble('bot'), padding: '12px 16px' }}>
                <span style={S.typingDot(0)} />
                <span style={S.typingDot(0.2)} />
                <span style={S.typingDot(0.4)} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Action Buttons */}
        <div style={S.quickActions}>
          {quickActions.map((action) => (
            <button
              key={action.label}
              className="tm-quick-btn"
              style={S.quickBtn}
              onClick={() => handleSend(action.msg)}
            >
              {action.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={S.inputRow}>
          <input
            ref={inputRef}
            className="tm-chat-input"
            style={S.input}
            type="text"
            placeholder="Ask a question..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKey}
            maxLength={500}
            aria-label="Type your message"
          />
          <button
            className="tm-send-btn"
            style={S.sendBtn}
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            aria-label="Send message"
          >
            <svg viewBox="0 0 24 24" width={18} height={18} fill="white">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>

        {/* Footer */}
        <div style={S.footer}>
          <FooterLogo />
        </div>
      </div>
    </>
  );
};

export default AIChatWidget;
