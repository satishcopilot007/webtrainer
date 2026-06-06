import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaArrowRight, FaClock, FaUsers, FaStar, FaCheck } from 'react-icons/fa';

const CORPORATE_PROGRAMS = [
  {
    id: 101,
    name: 'Enterprise AI Implementation',
    duration: 'Custom',
    level: 'Executive',
    price: 'Quote',
    rating: 4.9,
    students: 45,
    description: 'Transform your enterprise with AI-driven solutions',
    topics: ['Strategy', 'Implementation', 'ROI', 'Change Management', 'Security'],
    image: 'https://via.placeholder.com/300x200?text=Enterprise+AI',
    benefits: ['On-site/Remote', 'Customized', 'Executive Training']
  },
  {
    id: 102,
    name: 'Team Upskilling - Gen AI',
    duration: '4 weeks',
    level: 'Intermediate',
    price: 'Custom Pricing',
    rating: 4.8,
    students: 78,
    description: 'Empower your team with latest Gen AI technologies',
    topics: ['LLMs', 'Prompt Engineering', 'API Integration', 'Best Practices'],
    image: 'https://via.placeholder.com/300x200?text=Team+GenAI',
    benefits: ['Flexible Schedule', 'Team Collaboration', 'Certification']
  },
  {
    id: 103,
    name: 'Data Analytics for Leadership',
    duration: '6 weeks',
    level: 'Executive',
    price: 'Custom Pricing',
    rating: 4.7,
    students: 120,
    description: 'Data-driven decision making for managers and leaders',
    topics: ['Data Strategy', 'Analytics', 'Dashboard', 'BI Tools', 'Insights'],
    image: 'https://via.placeholder.com/300x200?text=Data+Leadership',
    benefits: ['Executive Focus', 'Real Data', 'Actionable Insights']
  },
  {
    id: 104,
    name: 'Cloud Migration Training',
    duration: '8 weeks',
    level: 'Technical',
    price: 'Custom Pricing',
    rating: 4.8,
    students: 65,
    description: 'Expert-led cloud infrastructure and migration strategies',
    topics: ['AWS/Azure', 'Migration', 'Architecture', 'Security', 'Cost Optimization'],
    image: 'https://via.placeholder.com/300x200?text=Cloud+Migration',
    benefits: ['Hands-on Lab', 'Certification', 'Post-Training Support']
  },
  {
    id: 105,
    name: 'Cybersecurity & Compliance',
    duration: '10 weeks',
    level: 'Technical',
    price: 'Custom Pricing',
    rating: 4.9,
    students: 92,
    description: 'Secure your organization with advanced security practices',
    topics: ['Security Frameworks', 'Compliance', 'Threat Analysis', 'Incident Response'],
    image: 'https://via.placeholder.com/300x200?text=Cybersecurity',
    benefits: ['Industry Certified', 'Compliance Ready', 'Expert Mentors']
  },
  {
    id: 106,
    name: 'Digital Transformation',
    duration: 'Custom',
    level: 'Executive',
    price: 'Custom Pricing',
    rating: 4.8,
    students: 38,
    description: 'Complete digital transformation roadmap and execution',
    topics: ['Strategy', 'Technology', 'Change', 'Innovation', 'ROI Metrics'],
    image: 'https://via.placeholder.com/300x200?text=Digital+Transform',
    benefits: ['Executive Coaching', 'Custom Framework', 'Implementation Support']
  }
];

const CorporateTrainingPage = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <>
      <Helmet>
        <title>Corporate Training Programs | TrainerMentors</title>
        <meta name="description" content="Comprehensive corporate training solutions for your enterprise team." />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary-900 via-dark-800 to-dark-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-30" />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Corporate Training Solutions
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Tailored programs to upskill your team and drive business transformation
            </p>
          </motion.div>

          {/* Key Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          >
            {[
              { title: 'Customized', desc: 'Tailored to your specific needs' },
              { title: 'Flexible', desc: 'On-site, remote, or hybrid delivery' },
              { title: 'Measurable', desc: 'Track ROI and performance metrics' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-300">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-20 bg-dark-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {CORPORATE_PROGRAMS.map((program) => (
              <motion.div
                key={program.id}
                variants={itemVariants}
                className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-300 group cursor-pointer"
                onClick={() => navigate(`/training-detail/${program.id}`, { state: { type: 'corporate', program } })}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary-500 to-secondary-500">
                  <img 
                    src={program.image} 
                    alt={program.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute top-4 right-4 bg-secondary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {program.level}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">
                    {program.name}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-4">{program.description}</p>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-300">
                    <div className="flex items-center space-x-1">
                      <FaClock className="text-primary-400" />
                      <span>{program.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaUsers className="text-secondary-400" />
                      <span>{program.students} trained</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`text-sm ${i < Math.floor(program.rating) ? 'text-yellow-400' : 'text-gray-600'}`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-300">{program.rating}</span>
                  </div>

                  {/* Topics */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {program.topics.map((topic, idx) => (
                        <span key={idx} className="text-xs bg-secondary-500/20 text-secondary-300 px-2 py-1 rounded">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="mb-4 space-y-1">
                    {program.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm text-gray-300">
                        <FaCheck className="text-green-400 text-xs" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <span className="text-lg font-bold text-primary-400">{program.price}</span>
                    <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-2 rounded-full hover:shadow-lg transition-all group/btn">
                      <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-r from-secondary-600 to-primary-600">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-white mb-4">Interested in Custom Training?</h2>
          <p className="text-xl text-white/90 mb-8">Let's discuss how we can help your organization succeed</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all">
              Get a Quote
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-all">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default CorporateTrainingPage;
