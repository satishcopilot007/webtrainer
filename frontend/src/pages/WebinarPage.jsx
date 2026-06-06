import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaVideo, FaClock, FaUsers, FaCalendar, FaUser } from 'react-icons/fa';
import WebinarRegistrationModal from '../components/modals/WebinarRegistrationModal';

const WebinarPage = () => {
  const [selectedWebinar, setSelectedWebinar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const webinars = [
    {
      id: 1,
      title: 'AI in 2025: Latest Trends & Career Opportunities',
      description: 'Explore how Artificial Intelligence is transforming industries and learn the most in-demand AI skills for 2025.',
      date: '2025-05-20',
      time: '3:00 PM IST',
      capacity: 500,
      registered: 287,
      speaker: 'Rajesh Kumar',
      speakerRole: 'AI Research Lead at Google',
      duration: '90 minutes',
      topics: ['GenAI Trends', 'LLMs & Transformers', 'Career Paths', 'Q&A Session'],
    },
    {
      id: 2,
      title: 'Cloud Migration Best Practices for Enterprises',
      description: 'Learn how to successfully migrate your applications to the cloud with zero downtime and minimum risk.',
      date: '2025-05-25',
      time: '2:00 PM IST',
      capacity: 300,
      registered: 156,
      speaker: 'Priya Sharma',
      speakerRole: 'Cloud Architect at AWS',
      duration: '75 minutes',
      topics: ['Migration Strategy', 'AWS Services', 'Cost Optimization', 'Security Considerations'],
    },
    {
      id: 3,
      title: 'Future of Web Development: Full Stack 2025',
      description: 'Discover the latest frameworks, tools, and technologies shaping the future of web development.',
      date: '2025-06-01',
      time: '4:00 PM IST',
      capacity: 400,
      registered: 198,
      speaker: 'Amit Patel',
      speakerRole: 'Lead Developer at Microsoft',
      duration: '90 minutes',
      topics: ['React 19+', 'AI Integration', 'Performance', 'Web3 Basics'],
    },
    {
      id: 4,
      title: 'DevOps & Kubernetes: Scaling Applications',
      description: 'Master DevOps practices and Kubernetes to deploy and scale applications efficiently in production.',
      date: '2025-06-08',
      time: '3:30 PM IST',
      capacity: 350,
      registered: 142,
      speaker: 'Vikram Desai',
      speakerRole: 'DevOps Engineer at Netflix',
      duration: '90 minutes',
      topics: ['CI/CD Pipelines', 'Kubernetes', 'Monitoring', 'Best Practices'],
    },
    {
      id: 5,
      title: 'Data Science: From Data to Insights',
      description: 'Learn how to extract meaningful insights from large datasets using Python, SQL, and modern ML techniques.',
      date: '2025-06-15',
      time: '2:30 PM IST',
      capacity: 450,
      registered: 267,
      speaker: 'Neha Verma',
      speakerRole: 'Data Science Lead at Google',
      duration: '90 minutes',
      topics: ['EDA', 'ML Models', 'Business Analytics', 'Real-World Case Study'],
    },
    {
      id: 6,
      title: 'Cybersecurity: Protecting Your Digital Assets',
      description: 'Understand modern cybersecurity threats, best practices, and how to build secure applications.',
      date: '2025-06-22',
      time: '3:00 PM IST',
      capacity: 300,
      registered: 89,
      speaker: 'Anjali Nair',
      speakerRole: 'Security Lead at Deloitte',
      duration: '75 minutes',
      topics: ['OWASP Top 10', 'Encryption', 'Incident Response', 'Compliance'],
    },
  ];

  const handleRegister = (webinar) => {
    setSelectedWebinar(webinar);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedWebinar(null), 300);
  };

  return (
    <>
      <Helmet>
        <title>Live Webinars | TrainerMentors</title>
        <meta name="description" content="Attend live webinars from industry experts and learn the latest tech trends" />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-secondary-900 via-dark-800 to-dark-900">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="text-6xl mb-4">📹</div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Live Webinars</h1>
            <p className="text-xl text-gray-300">Learn from industry experts in real-time. Free registration, unlimited learning.</p>
          </motion.div>
        </div>
      </section>

      {/* Webinars Grid */}
      <section className="py-20 bg-dark-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {webinars.map((webinar) => (
              <motion.div
                key={webinar.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl overflow-hidden hover:shadow-2xl transition-all border border-dark-600 hover:border-secondary-500"
              >
                {/* Header with Icon */}
                <div className="bg-gradient-to-r from-secondary-600 to-secondary-500 p-6 flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="bg-white/20 rounded-full p-4 flex-shrink-0">
                      <FaVideo className="text-3xl text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{webinar.title}</h3>
                      <p className="text-sm text-secondary-100">{webinar.description}</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Speaker Info */}
                  <div className="flex items-center gap-2 text-gray-300 bg-dark-700/50 p-3 rounded-lg">
                    <FaUser className="text-secondary-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold">{webinar.speaker}</p>
                      <p className="text-xs text-gray-400">{webinar.speakerRole}</p>
                    </div>
                  </div>

                  {/* Key Details */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <FaCalendar className="text-secondary-400" />
                      <span>{new Date(webinar.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <FaClock className="text-secondary-400" />
                      <span>{webinar.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <FaVideo className="text-secondary-400" />
                      <span>{webinar.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <FaUsers className="text-secondary-400" />
                      <span>{webinar.registered} / {webinar.capacity} Registered</span>
                    </div>
                  </div>

                  {/* Topics */}
                  <div>
                    <p className="text-xs font-semibold text-gray-300 mb-2">Topics Covered:</p>
                    <div className="flex flex-wrap gap-2">
                      {webinar.topics.map((topic, i) => (
                        <span key={i} className="bg-secondary-500/20 text-secondary-300 text-xs px-2 py-1 rounded">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="w-full bg-dark-600 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-secondary-500 to-secondary-400 h-2 rounded-full"
                        style={{ width: `${(webinar.registered / webinar.capacity) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {webinar.capacity - webinar.registered} seats left
                    </p>
                  </div>

                  {/* Register Button */}
                  <button
                    onClick={() => handleRegister(webinar)}
                    className="w-full bg-gradient-to-r from-secondary-500 to-secondary-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:scale-105 transition-all"
                  >
                    Register Now →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Info Banner */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="bg-gradient-to-r from-secondary-900/50 to-secondary-900/30 border border-secondary-500/30 rounded-2xl p-6 text-center"
          >
            <p className="text-gray-300">
              💡 <span className="font-semibold">All webinars are FREE to attend!</span> Register above to receive the Zoom link.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Registration Modal */}
      <WebinarRegistrationModal
        webinar={selectedWebinar}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default WebinarPage;
