import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaArrowRight, FaClock, FaUsers, FaStar } from 'react-icons/fa';
import { TRAINING_PROGRAMS } from '../../utils/constants';

const ONLINE_PROGRAMS = [
  {
    id: 1,
    name: 'AI & Machine Learning',
    duration: '8 weeks',
    level: 'Intermediate',
    price: '₹15,999',
    rating: 4.8,
    students: 2340,
    description: 'Master AI and Machine Learning with hands-on projects',
    topics: ['Python', 'TensorFlow', 'Neural Networks', 'NLP', 'Computer Vision'],
    image: 'https://via.placeholder.com/300x200?text=AI+ML'
  },
  {
    id: 2,
    name: 'Generative AI & LLMs',
    duration: '6 weeks',
    level: 'Advanced',
    price: '₹18,999',
    rating: 4.9,
    students: 1890,
    description: 'Build applications with OpenAI, GPT, and Large Language Models',
    topics: ['LLMs', 'Prompt Engineering', 'OpenAI API', 'Fine-tuning', 'RAG'],
    image: 'https://via.placeholder.com/300x200?text=Gen+AI'
  },
  {
    id: 3,
    name: 'Deep Learning Masterclass',
    duration: '10 weeks',
    level: 'Advanced',
    price: '₹19,999',
    rating: 4.7,
    students: 1560,
    description: 'Advanced deep learning techniques and applications',
    topics: ['CNNs', 'RNNs', 'GANs', 'Transformers', 'PyTorch'],
    image: 'https://via.placeholder.com/300x200?text=Deep+Learning'
  },
  {
    id: 4,
    name: 'Data Science with Python',
    duration: '8 weeks',
    level: 'Beginner',
    price: '₹12,999',
    rating: 4.6,
    students: 3210,
    description: 'Complete data science bootcamp from basics to advanced',
    topics: ['Pandas', 'NumPy', 'Matplotlib', 'Scikit-learn', 'Statistics'],
    image: 'https://via.placeholder.com/300x200?text=Data+Science'
  },
  {
    id: 5,
    name: 'Cloud Computing (AWS)',
    duration: '6 weeks',
    level: 'Intermediate',
    price: '₹14,999',
    rating: 4.7,
    students: 1980,
    description: 'AWS certification and cloud architecture mastery',
    topics: ['EC2', 'S3', 'Lambda', 'RDS', 'CloudFormation'],
    image: 'https://via.placeholder.com/300x200?text=AWS+Cloud'
  },
  {
    id: 6,
    name: 'Web Development Full Stack',
    duration: '12 weeks',
    level: 'Beginner',
    price: '₹11,999',
    rating: 4.5,
    students: 4120,
    description: 'Complete full-stack web development with React & Node.js',
    topics: ['React', 'Node.js', 'MongoDB', 'Express', 'REST APIs'],
    image: 'https://via.placeholder.com/300x200?text=Full+Stack'
  }
];

const OnlineTrainingPage = () => {
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
        <title>Online Training Programs | TrainerMentors</title>
        <meta name="description" content="Explore our comprehensive online training programs in AI, ML, Gen AI, and more." />
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
              Online Training Programs
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Learn industry-leading skills at your own pace with expert instructors
            </p>
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
            {ONLINE_PROGRAMS.map((program) => (
              <motion.div
                key={program.id}
                variants={itemVariants}
                className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-300 group cursor-pointer"
                onClick={() => navigate(`/training-detail/${program.id}`, { state: { type: 'online', program } })}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary-500 to-secondary-500">
                  <img 
                    src={program.image} 
                    alt={program.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute top-4 right-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
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
                      <span>{program.students.toLocaleString()}</span>
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
                        <span key={idx} className="text-xs bg-primary-500/20 text-primary-300 px-2 py-1 rounded">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">{program.price}</span>
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

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Learning?</h2>
          <p className="text-xl text-white/90 mb-8">Choose your program and transform your career today</p>
          <button className="bg-white text-primary-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all">
            Browse All Programs
          </button>
        </div>
      </section>
    </>
  );
};

export default OnlineTrainingPage;
