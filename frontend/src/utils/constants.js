export const SITE_NAME = 'TrainerMentors';
export const SITE_TAGLINE = 'Expert-Led Online Training';
export const SITE_DESCRIPTION = 'Empowering Your Career Through Expert-Led Training';
export const SITE_URL = 'https://trainermentors.com';

// Primary Navigation (Top Row)
export const PRIMARY_NAV_LINKS = [
  { label: 'Certificate', path: '/certificate' },
  { label: 'Webinar', path: '/webinar' },
  { label: 'Corporate', path: '/corporate' },
  { label: 'CSR', path: '/csr' },
  { label: 'Blogs', path: '/blog' },
  { label: 'Students Reviews', path: '/testimonials' },
  { label: 'Referral', path: '/referral' },
  { label: 'Free Courses', path: '/free-courses' },
  { label: 'Feedback', path: '/feedback' },
  { label: 'Careers', path: '/careers' },
  { label: 'Contact Us', path: '/contact' },
];

// Secondary Navigation (Bottom Row) - Course Categories with Dropdown
export const SECONDARY_NAV_LINKS = [
  { 
    label: 'About Us', 
    path: '/about',
    hasDropdown: false
  },
  { 
    label: 'Corporate Courses', 
    path: '/courses/corporate',
    hasDropdown: false
  },
  { 
    label: 'Technical Courses', 
    path: '/courses/technical',
    hasDropdown: false
  },
  { 
    label: 'Non-Technical Courses', 
    path: '/courses/non-technical',
    hasDropdown: false
  },
  { 
    label: 'Placements', 
    path: '/placements',
    hasDropdown: false
  },
];

// Legacy NAV_LINKS for backward compatibility
export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Courses', path: '/courses' },
  { label: 'About Us', path: '/about' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
];

// Course Categories - Main Categories
export const COURSE_CATEGORIES = [
  {
    id: 'corporate',
    name: 'Corporate Courses',
    slug: 'corporate',
    description: 'HR & Management, SAP, CRM & ERP, Language & Soft Skills, Project Management, Finance & Accounting - Corporate training programs for professionals',
    icon: '🏢',
    color: 'from-green-500 to-emerald-600',
    courseCount: 106,
    subcategories: [
      'HR & Management (8)',
      'SAP (11)',
      'CRM & ERP (5)',
      'Language & Soft Skills (17)',
      'Project Management & Certifications (15)',
      'HR & Finance (3)',
      'Career Development (2)',
    ]
  },
  {
    id: 'technical',
    name: 'Technical Courses',
    slug: 'technical',
    description: 'Software Development, Data Science & AI, Cloud Computing, Cyber Security, Full Stack, Mobile Development, Big Data & Hadoop, RPA & Automation',
    icon: '💻',
    color: 'from-blue-500 to-purple-600',
    courseCount: 525,
    subcategories: [
      'Software Development (38)',
      'Data Science & AI (29)',
      'Cloud & Networking (17)',
      'Full Stack & Web Development (12)',
      'Software Testing & QA (10)',
      'Analytics & Tools (16)',
      'Cyber Security (7)',
      'Big Data & Hadoop (6)',
      'Mobile App Development (3)',
      'RPA & Automation (4)',
      'Master Programs (9)',
      'Emerging Technologies (1)',
      'Software Testing & Others (3)',
    ]
  },
  {
    id: 'non-technical',
    name: 'Non-Technical Courses',
    slug: 'non-technical',
    description: 'Digital Marketing, Graphic Design, UI/UX Design, Job-Oriented Programs - Creative and marketing courses for career growth',
    icon: '🎨',
    color: 'from-pink-500 to-rose-600',
    courseCount: 116,
    subcategories: [
      'Digital Marketing (13)',
      'Design (11)',
      'Job-Oriented Programs (3)',
    ]
  },
  {
    id: 'certificate',
    name: 'Certificate Courses',
    slug: 'certificate',
    description: 'Industry-Recognized Certification Programs - Globally accepted certificates across Technical, Corporate, and Non-Technical domains',
    icon: '🎓',
    color: 'from-purple-500 to-indigo-600',
    courseCount: 747,
    subcategories: [
      'Technical Certifications (525)',
      'Corporate Certifications (106)',
      'Non-Technical Certifications (116)',
    ]
  },
];

// DEPRECATED: Old course categories structure (kept for reference)
const DEPRECATED_COURSE_CATEGORIES_OLD = [
  {
    id: 'ai',
    name: 'AI & Artificial Intelligence',
    slug: 'artificial-intelligence',
    description: 'Comprehensive AI and Machine Learning courses',
    icon: '🤖',
    color: 'from-pink-500 to-rose-600',
    domains: [
      { 
        name: 'AI Fundamentals', 
        icon: '📖',
        courses: [
          { id: 4, name: 'AI Fundamentals - Complete Certification', level: 'beginner', price: 5999 },
          { id: 13, name: 'AI Ethics, Bias & Responsible AI', level: 'beginner', price: 2499 },
          { id: 10, name: 'Prompt Engineering & ChatGPT Mastery', level: 'beginner', price: 2999 },
        ]
      },
      { 
        name: 'Generative AI', 
        icon: '✨',
        courses: [
          { id: 5, name: 'Generative AI: Zero to Hero', level: 'intermediate', price: 7999 },
          { id: 20, name: 'Advanced Generative Models - GANs & Diffusion', level: 'advanced', price: 7499 },
          { id: 17, name: 'AI Powered Chatbots & Virtual Assistants', level: 'intermediate', price: 4299 },
        ]
      },
      { 
        name: 'Machine Learning', 
        icon: '🧠',
        courses: [
          { id: 6, name: 'Machine Learning Mastery', level: 'intermediate', price: 5499 },
          { id: 7, name: 'Deep Learning & Neural Networks', level: 'advanced', price: 6999 },
          { id: 12, name: 'Reinforcement Learning & Game AI', level: 'advanced', price: 5999 },
        ]
      },
      { 
        name: 'NLP & Vision', 
        icon: '👁️',
        courses: [
          { id: 8, name: 'NLP & Large Language Models', level: 'advanced', price: 6499 },
          { id: 9, name: 'Computer Vision & Image Processing', level: 'advanced', price: 6799 },
          { id: 15, name: 'Computer Vision with TensorFlow & PyTorch', level: 'advanced', price: 6399 },
        ]
      },
      { 
        name: 'Advanced Topics', 
        icon: '🔬',
        courses: [
          { id: 11, name: 'AI for Data Analysis & Automation', level: 'intermediate', price: 4999 },
          { id: 14, name: 'MLOps & AI Model Deployment', level: 'advanced', price: 5299 },
          { id: 16, name: 'Time Series Forecasting & ARIMA', level: 'intermediate', price: 4799 },
        ]
      },
      { 
        name: 'Specialized Applications', 
        icon: '🎯',
        courses: [
          { id: 18, name: 'Recommendation Systems & Collaborative Filtering', level: 'advanced', price: 5199 },
          { id: 19, name: 'Anomaly Detection & Fraud Prevention', level: 'intermediate', price: 4699 },
        ]
      },
    ]
  },
  {
    id: 'job-oriented',
    name: 'Job Oriented Courses',
    slug: 'job-oriented',
    description: 'Industry-focused courses designed for immediate job placement',
    icon: '💼',
    color: 'from-blue-500 to-blue-600',
    courses: [
      { id: 1, name: 'Job Oriented Business Analyst Course', level: 'intermediate', icon: '📊' },
      { id: 2, name: 'Job Oriented Web Full Stack Course', level: 'intermediate', icon: '🌐' },
      { id: 3, name: 'Job Oriented Java Fullstack Course', level: 'intermediate', icon: '☕' },
      { id: 4, name: 'Job Oriented Data Engineering', level: 'advanced', icon: '🔧' },
      { id: 5, name: 'Job Oriented Data Analytics', level: 'intermediate', icon: '📈' },
      { id: 6, name: 'Job Oriented Data Science AI with Data Analytics', level: 'advanced', icon: '🤖' },
    ]
  },
  {
    id: 'it',
    name: 'IT Courses',
    slug: 'it',
    description: 'Information Technology & Software Development courses',
    icon: '🖥️',
    color: 'from-purple-500 to-purple-600',
    domains: [
      { 
        name: 'Data Science', 
        icon: '📊',
        courses: [
          { id: 1, name: 'Data Science', level: 'intermediate' },
          { id: 2, name: 'Data Analytics', level: 'intermediate' },
          { id: 3, name: 'Advanced Generative AI', level: 'advanced' },
        ]
      },
      { 
        name: 'Software Development', 
        icon: '💻',
        courses: [
          { id: 4, name: 'Agentic AI', level: 'advanced' },
          { id: 5, name: 'Financial Analyst', level: 'intermediate' },
          { id: 6, name: 'PySpark', level: 'advanced' },
        ]
      },
      { 
        name: 'Cyber Security', 
        icon: '🔒',
        courses: [
          { id: 7, name: 'Cloud Computing', level: 'intermediate' },
          { id: 8, name: 'DevOps Engineering', level: 'advanced' },
          { id: 9, name: 'System Administration', level: 'intermediate' },
        ]
      },
      { 
        name: 'Cloud Computing', 
        icon: '☁️',
        courses: [
          { id: 10, name: 'AWS Solutions Architect', level: 'advanced' },
          { id: 11, name: 'Azure Cloud Engineer', level: 'advanced' },
          { id: 12, name: 'Google Cloud Fundamentals', level: 'beginner' },
        ]
      },
      { 
        name: 'SAP Courses', 
        icon: '📱',
        courses: [
          { id: 13, name: 'SAP HANA Administration', level: 'advanced' },
          { id: 14, name: 'SAP S/4HANA Implementation', level: 'advanced' },
          { id: 15, name: 'SAP Basis', level: 'intermediate' },
        ]
      },
      { 
        name: 'Digital Marketing Training', 
        icon: '📢',
        courses: [
          { id: 16, name: 'SEO Mastery', level: 'intermediate' },
          { id: 17, name: 'Digital Marketing Strategy', level: 'intermediate' },
          { id: 18, name: 'Social Media Marketing', level: 'beginner' },
        ]
      },
    ]
  },
  {
    id: 'non-it',
    name: 'Non IT Courses',
    slug: 'non-it',
    description: 'Business, Management & Soft Skills training',
    icon: '📚',
    color: 'from-green-500 to-green-600',
    domains: [
      { 
        name: 'HR', 
        icon: '👥',
        courses: [
          { id: 1, name: 'HRBP', level: 'intermediate' },
          { id: 2, name: 'SAP HR', level: 'intermediate' },
          { id: 3, name: 'HR Training', level: 'beginner' },
        ]
      },
      { 
        name: 'Language', 
        icon: '🗣️',
        courses: [
          { id: 4, name: 'English Communication', level: 'beginner' },
          { id: 5, name: 'Business English', level: 'intermediate' },
          { id: 6, name: 'Technical Writing', level: 'intermediate' },
        ]
      },
      { 
        name: 'Fashion Design', 
        icon: '👗',
        courses: [
          { id: 7, name: 'Fashion Design Basics', level: 'beginner' },
          { id: 8, name: 'Garment Construction', level: 'intermediate' },
          { id: 9, name: 'Fashion Illustration', level: 'intermediate' },
        ]
      },
      { 
        name: 'Interior Design', 
        icon: '🏠',
        courses: [
          { id: 10, name: 'Interior Design Fundamentals', level: 'beginner' },
          { id: 11, name: 'Space Planning', level: 'intermediate' },
          { id: 12, name: 'Design Software Mastery', level: 'intermediate' },
        ]
      },
      { 
        name: 'AutoCAD', 
        icon: '📐',
        courses: [
          { id: 13, name: 'AutoCAD Basics', level: 'beginner' },
          { id: 14, name: 'Advanced AutoCAD', level: 'advanced' },
          { id: 15, name: 'CAD for Architecture', level: 'intermediate' },
        ]
      },
      { 
        name: 'BIM', 
        icon: '🏗️',
        courses: [
          { id: 16, name: 'Revit Fundamentals', level: 'beginner' },
          { id: 17, name: 'BIM Coordination', level: 'advanced' },
          { id: 18, name: 'Navisworks Mastery', level: 'advanced' },
        ]
      },
      { 
        name: '3DS MAX', 
        icon: '🎬',
        courses: [
          { id: 19, name: '3DS MAX for Modeling', level: 'intermediate' },
          { id: 20, name: 'VRay Rendering', level: 'advanced' },
          { id: 21, name: 'Animation & Visual Effects', level: 'advanced' },
        ]
      },
    ]
  },
  {
    id: 'corporate',
    name: 'Corporate Courses',
    slug: 'corporate',
    description: 'Customized training for enterprise teams',
    icon: '🏢',
    color: 'from-orange-500 to-orange-600',
    courses: [
      { id: 1, name: 'PMP Certification Training', level: 'advanced', icon: '📋' },
      { id: 2, name: 'CSM Certification Training', level: 'intermediate', icon: '🎯' },
      { id: 3, name: 'JIRA Certification Training', level: 'intermediate', icon: '⚙️' },
      { id: 4, name: 'PRINCE2 Certification Training', level: 'advanced', icon: '👑' },
      { id: 5, name: 'ITIL 4 Certification Training', level: 'intermediate', icon: '🔧' },
      { id: 6, name: 'PSM Certification Training', level: 'advanced', icon: '🏆' },
    ]
  },
];

export const STATS = [
  { label: 'Students Trained', value: 15000, suffix: '+' },
  { label: 'Expert Mentors', value: 50, suffix: '+' },
  { label: 'Courses Available', value: 139, suffix: '' },
  { label: 'Placement Rate', value: 95, suffix: '%' },
];

// Detailed Category Mapping - Maps all 13 categories to 3 main categories
export const DETAILED_CATEGORIES = {
  IT_COURSES: {
    id: 'it',
    name: 'IT Courses',
    slug: 'it',
    subcategories: [
      { id: 2, name: 'Data Science & AI', slug: 'data-science-ai', count: 25 },
      { id: 9, name: 'Software Development', slug: 'software-development', count: 24 },
      { id: 8, name: 'Analytics & Tools', slug: 'analytics-tools', count: 11 },
      { id: 12, name: 'Cloud & Networking', slug: 'cloud-networking', count: 8 },
      { id: 13, name: 'Cyber Security', slug: 'cyber-security', count: 6 },
      { id: 11, name: 'Software Testing', slug: 'software-testing', count: 3 },
    ],
    total: 77,
  },
  NON_IT_COURSES: {
    id: 'non-it',
    name: 'Non-IT Courses',
    slug: 'non-it',
    subcategories: [
      { id: 6, name: 'Project Management & Certifications', slug: 'project-management', count: 13 },
      { id: 5, name: 'SAP', slug: 'sap', count: 11 },
      { id: 10, name: 'Digital Marketing', slug: 'digital-marketing', count: 10 },
      { id: 3, name: 'Language & Soft Skills', slug: 'language-soft-skills', count: 9 },
      { id: 1, name: 'Design', slug: 'design', count: 8 },
    ],
    total: 61,
  },
  CORPORATE_COURSES: {
    id: 'corporate',
    name: 'Corporate Courses',
    slug: 'corporate',
    subcategories: [
      { id: 4, name: 'HR & Management', slug: 'hr-management', count: 8 },
      { id: 7, name: 'Job-Oriented Programs', slug: 'job-oriented', count: 3 },
    ],
    total: 11,
  },
};

export const LEVEL_COLORS = {
  'all-levels': 'bg-blue-100 text-blue-700',
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
};

// Social Media Links - Update these with your actual accounts
export const SOCIAL_LINKS = {
  whatsapp: 'https://wa.me/919999999999', // Update with your WhatsApp number
  instagram: 'https://instagram.com/trainermentors', // Update with your Instagram
  facebook: 'https://facebook.com/trainermentors', // Update with your Facebook
  linkedin: 'https://linkedin.com/company/trainermentors', // Update with your LinkedIn
  twitter: 'https://twitter.com/trainermentors', // Update with your Twitter
  youtube: 'https://youtube.com/@trainermentors', // Update with your YouTube
  telegram: 'https://t.me/trainermentors', // Update with your Telegram
  github: 'https://github.com/trainermentors', // Update with your GitHub
};

// Razorpay Configuration
export const RAZORPAY_CONFIG = {
  keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1Aa00000000001',
  currency: 'INR',
  timeout: 900, // 15 minutes
  retries: 3,
};

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const API_ENDPOINTS = {
  courses: '/api/courses',
  courseDetail: '/api/courses/:id',
  categories: '/api/categories',
  enrollments: '/api/enrollments',
  payments: '/api/payments',
  auth: '/api/auth',
};

// Pagination Configuration
export const PAGINATION = {
  defaultPageSize: 12,
  coursePageSize: 12,
  searchPageSize: 10,
};

// Live Chat Configuration (Tawk.to)
export const LIVE_CHAT_CONFIG = {
  // Get your Tawk.to Property ID from https://www.tawk.to
  propertyId: import.meta.env.VITE_TAWK_PROPERTY_ID || 'YOUR_TAWK_PROPERTY_ID',
  enabled: true,
};

// Alternative: Crisp Chat Configuration
export const CRISP_CHAT_CONFIG = {
  // Get your Crisp Website ID from https://crisp.chat
  websiteId: import.meta.env.VITE_CRISP_WEBSITE_ID || 'YOUR_CRISP_ID',
  enabled: false, // Set to true to use Crisp instead of Tawk.to
};

// Google Ratings & Platform Stats
export const GOOGLE_RATINGS = {
  rating: 4.9,
  reviews: 2847,
  platform: 'Google',
};

// Course Pricing & Duration Data
export const COURSE_DETAILS = {
  // AI Courses
  'AI Fundamentals - Complete Certification': {
    price: 5999,
    duration: 12,
    placement: 85,
    rating: 4.9,
    reviews: 156,
    curriculum: [
      { 
        module: 1, 
        title: 'Introduction to AI & Machine Learning', 
        duration: '1-2 Weeks',
        focus: 'AI history, ML fundamentals, types of learning, real-world applications',
        tools: 'Python, Jupyter'
      },
      { 
        module: 2, 
        title: 'Python for AI/ML', 
        duration: '2-3 Weeks',
        focus: 'NumPy, Pandas, Scikit-learn basics, data preprocessing',
        tools: 'Python 3.9+, Anaconda, Jupyter'
      },
      { 
        module: 3, 
        title: 'Supervised Learning Algorithms', 
        duration: '2-3 Weeks',
        focus: 'Linear/Logistic Regression, Decision Trees, SVM, Random Forest',
        tools: 'Scikit-learn, TensorFlow'
      },
      { 
        module: 4, 
        title: 'Unsupervised Learning & Clustering', 
        duration: '2 Weeks',
        focus: 'K-means, Hierarchical clustering, PCA, dimensionality reduction',
        tools: 'Scikit-learn, Visualization libraries'
      },
      { 
        module: 5, 
        title: 'Deep Learning Basics', 
        duration: '2-3 Weeks',
        focus: 'Neural networks, backpropagation, activation functions, deep architectures',
        tools: 'TensorFlow, Keras, PyTorch'
      },
      { 
        module: 6, 
        title: 'AI Certification Capstone Project', 
        duration: '1-2 Weeks',
        focus: 'End-to-end ML project, model evaluation, deployment',
        tools: 'Complete ML Stack'
      },
    ]
  },
  'Generative AI: Zero to Hero': {
    price: 7999,
    duration: 10,
    placement: 90,
    rating: 4.8,
    reviews: 203,
    curriculum: [
      { 
        module: 1, 
        title: 'Generative AI Fundamentals', 
        duration: '1-2 Weeks',
        focus: 'Introduction to Gen AI, LLMs, GPT architecture, transformers',
        tools: 'OpenAI API, ChatGPT'
      },
      { 
        module: 2, 
        title: 'Prompt Engineering Mastery', 
        duration: '1-2 Weeks',
        focus: 'Prompt techniques, few-shot learning, chain-of-thought, advanced prompting',
        tools: 'ChatGPT, Claude, OpenAI Playground'
      },
      { 
        module: 3, 
        title: 'Working with LLM APIs', 
        duration: '2-3 Weeks',
        focus: 'OpenAI API, HuggingFace, LangChain, building applications',
        tools: 'Python, LangChain, FastAPI'
      },
      { 
        module: 4, 
        title: 'Fine-tuning and Custom Models', 
        duration: '2 Weeks',
        focus: 'Fine-tuning LLMs, adapters, LoRA, custom training',
        tools: 'HuggingFace, PyTorch, OpenAI Fine-tuning'
      },
      { 
        module: 5, 
        title: 'Building GenAI Applications', 
        duration: '2 Weeks',
        focus: 'RAG systems, vector databases, multi-modal models, production deployment',
        tools: 'Pinecone, Weaviate, Streamlit, Docker'
      },
      { 
        module: 6, 
        title: 'GenAI Capstone Project', 
        duration: '1-2 Weeks',
        focus: 'Build real GenAI application, deployment, optimization',
        tools: 'Complete GenAI Stack'
      },
    ]
  },
  'Machine Learning Mastery': {
    price: 5499,
    duration: 12,
    placement: 88,
    rating: 4.7,
    reviews: 128,
    curriculum: [
      { 
        module: 1, 
        title: 'ML Fundamentals & Math', 
        duration: '2-3 Weeks',
        focus: 'Linear algebra, statistics, probability for ML',
        tools: 'Python, NumPy, SciPy'
      },
      { 
        module: 2, 
        title: 'Data Preprocessing & EDA', 
        duration: '2-3 Weeks',
        focus: 'Data cleaning, feature engineering, exploratory data analysis',
        tools: 'Pandas, Matplotlib, Seaborn'
      },
      { 
        module: 3, 
        title: 'Supervised Learning in Depth', 
        duration: '3-4 Weeks',
        focus: 'All classification and regression algorithms',
        tools: 'Scikit-learn, XGBoost, LightGBM'
      },
      { 
        module: 4, 
        title: 'Ensemble Methods & Boosting', 
        duration: '2-3 Weeks',
        focus: 'Random Forests, Gradient Boosting, AdaBoost, Stacking',
        tools: 'XGBoost, CatBoost, LightGBM'
      },
      { 
        module: 5, 
        title: 'Model Evaluation & Hyperparameter Tuning', 
        duration: '2-3 Weeks',
        focus: 'Cross-validation, metrics, Grid/Random search, Bayesian optimization',
        tools: 'Scikit-learn, Optuna'
      },
      { 
        module: 6, 
        title: 'ML Capstone & Real-World Projects', 
        duration: '1-2 Weeks',
        focus: 'Kaggle-style competition, production ML pipeline',
        tools: 'Complete ML Stack'
      },
    ]
  },
  'Deep Learning & Neural Networks': {
    price: 6999,
    duration: 14,
    placement: 87,
    rating: 4.8,
    reviews: 97,
    curriculum: [
      { 
        module: 1, 
        title: 'Neural Network Fundamentals', 
        duration: '2-3 Weeks',
        focus: 'Perceptrons, neurons, activation functions, backpropagation',
        tools: 'TensorFlow, Keras'
      },
      { 
        module: 2, 
        title: 'Convolutional Neural Networks (CNN)', 
        duration: '3-4 Weeks',
        focus: 'CNN architecture, filters, pooling, image classification, transfer learning',
        tools: 'TensorFlow, PyTorch, ImageNet'
      },
      { 
        module: 3, 
        title: 'Recurrent Neural Networks (RNN/LSTM)', 
        duration: '3-4 Weeks',
        focus: 'RNN, LSTM, GRU, sequence-to-sequence models',
        tools: 'PyTorch, TensorFlow'
      },
      { 
        module: 4, 
        title: 'Attention & Transformers', 
        duration: '3-4 Weeks',
        focus: 'Self-attention, multi-head attention, Transformer architecture',
        tools: 'Hugging Face Transformers, PyTorch'
      },
      { 
        module: 5, 
        title: 'Advanced Deep Learning Topics', 
        duration: '2 Weeks',
        focus: 'Batch normalization, dropout, regularization, optimization techniques',
        tools: 'PyTorch, TensorFlow'
      },
      { 
        module: 6, 
        title: 'Deep Learning Capstone Project', 
        duration: '1-2 Weeks',
        focus: 'Build and deploy deep learning model',
        tools: 'Complete DL Stack'
      },
    ]
  },
  'NLP & Large Language Models': {
    price: 6499,
    duration: 10,
    placement: 89,
    rating: 4.9,
    reviews: 142,
    curriculum: [
      { 
        module: 1, 
        title: 'NLP Fundamentals', 
        duration: '2-3 Weeks',
        focus: 'Tokenization, embeddings, word2vec, GloVe, fastText',
        tools: 'NLTK, spaCy, Gensim'
      },
      { 
        module: 2, 
        title: 'Text Classification & Sentiment Analysis', 
        duration: '2-3 Weeks',
        focus: 'Naive Bayes, SVM, text preprocessing, sentiment analysis',
        tools: 'Scikit-learn, TextBlob'
      },
      { 
        module: 3, 
        title: 'Transformer Models & BERT', 
        duration: '2-3 Weeks',
        focus: 'BERT, RoBERTa, fine-tuning, transfer learning for NLP',
        tools: 'Hugging Face, PyTorch'
      },
      { 
        module: 4, 
        title: 'Large Language Models (GPT, LLaMA)', 
        duration: '2-3 Weeks',
        focus: 'How LLMs work, prompt engineering, fine-tuning LLMs',
        tools: 'OpenAI API, LLaMA, HuggingFace'
      },
      { 
        module: 5, 
        title: 'Advanced NLP Tasks', 
        duration: '1-2 Weeks',
        focus: 'Machine translation, question answering, named entity recognition',
        tools: 'Transformers, spaCy'
      },
      { 
        module: 6, 
        title: 'NLP Capstone Project', 
        duration: '1-2 Weeks',
        focus: 'Build advanced NLP application',
        tools: 'Complete NLP Stack'
      },
    ]
  },
  'Computer Vision & Image Processing': {
    price: 6799,
    duration: 11,
    placement: 88,
    rating: 4.8,
    reviews: 115,
    curriculum: [
      { 
        module: 1, 
        title: 'Image Processing Fundamentals', 
        duration: '2-3 Weeks',
        focus: 'Image basics, filtering, edge detection, morphological operations',
        tools: 'OpenCV, Pillow, SciPy'
      },
      { 
        module: 2, 
        title: 'Feature Detection & Extraction', 
        duration: '2-3 Weeks',
        focus: 'SIFT, SURF, BRIEF, feature matching, object detection',
        tools: 'OpenCV'
      },
      { 
        module: 3, 
        title: 'CNNs for Computer Vision', 
        duration: '3-4 Weeks',
        focus: 'ResNet, VGG, Inception, MobileNet, image classification',
        tools: 'TensorFlow, PyTorch, Torchvision'
      },
      { 
        module: 4, 
        title: 'Object Detection & Segmentation', 
        duration: '3-4 Weeks',
        focus: 'YOLO, Faster R-CNN, Mask R-CNN, semantic/instance segmentation',
        tools: 'PyTorch, TensorFlow'
      },
      { 
        module: 5, 
        title: 'Advanced CV Applications', 
        duration: '1-2 Weeks',
        focus: 'Face detection, facial recognition, pose estimation, video analysis',
        tools: 'OpenCV, MediaPipe, dlib'
      },
      { 
        module: 6, 
        title: 'CV Capstone Project', 
        duration: '1-2 Weeks',
        focus: 'Real-world CV application deployment',
        tools: 'Complete CV Stack'
      },
    ]
  },
  'Prompt Engineering & ChatGPT Mastery': {
    price: 2999,
    duration: 6,
    placement: 92,
    rating: 4.9,
    reviews: 287,
    curriculum: [
      { 
        module: 1, 
        title: 'ChatGPT & OpenAI Basics', 
        duration: '1 Week',
        focus: 'ChatGPT interface, API basics, models overview',
        tools: 'ChatGPT, OpenAI API'
      },
      { 
        module: 2, 
        title: 'Prompt Engineering Techniques', 
        duration: '1-2 Weeks',
        focus: 'Zero-shot, few-shot, chain-of-thought prompting',
        tools: 'ChatGPT, GPT-4'
      },
      { 
        module: 3, 
        title: 'Advanced Prompting Strategies', 
        duration: '1-2 Weeks',
        focus: 'Role playing, system messages, context injection, output formatting',
        tools: 'OpenAI API, Python'
      },
      { 
        module: 4, 
        title: 'Building Applications with GPT', 
        duration: '1-2 Weeks',
        focus: 'Integrating GPT in applications, handling API responses',
        tools: 'Python, Flask/FastAPI'
      },
      { 
        module: 5, 
        title: 'Optimization & Best Practices', 
        duration: '1 Week',
        focus: 'Cost optimization, rate limiting, error handling',
        tools: 'OpenAI API'
      },
      { 
        module: 6, 
        title: 'Capstone: Build a GPT App', 
        duration: '1 Week',
        focus: 'Build production-ready GPT application',
        tools: 'Complete Stack'
      },
    ]
  },
  'AI for Data Analysis & Automation': {
    price: 4999,
    duration: 8,
    placement: 84,
    rating: 4.7,
    reviews: 103,
    curriculum: [
      { 
        module: 1, 
        title: 'Data Analysis with Python', 
        duration: '2 Weeks',
        focus: 'Pandas, NumPy, data exploration, statistical analysis',
        tools: 'Python, Pandas, NumPy'
      },
      { 
        module: 2, 
        title: 'Predictive Analytics & Forecasting', 
        duration: '2 Weeks',
        focus: 'Time series, regression, prediction models',
        tools: 'Scikit-learn, Statsmodels'
      },
      { 
        module: 3, 
        title: 'Automation with Python & AI', 
        duration: '2 Weeks',
        focus: 'Task automation, RPA concepts, workflow automation',
        tools: 'Python, Selenium, scheduling libraries'
      },
      { 
        module: 4, 
        title: 'Business Intelligence & Dashboards', 
        duration: '1-2 Weeks',
        focus: 'Data visualization, BI tools, reporting dashboards',
        tools: 'Tableau, Power BI, Plotly'
      },
    ]
  },
  'Reinforcement Learning & Game AI': {
    price: 5999,
    duration: 10,
    placement: 82,
    rating: 4.8,
    reviews: 76,
    curriculum: [
      { 
        module: 1, 
        title: 'RL Fundamentals', 
        duration: '2-3 Weeks',
        focus: 'Markov processes, Q-learning, policy gradient',
        tools: 'Python, OpenAI Gym'
      },
      { 
        module: 2, 
        title: 'Deep Reinforcement Learning', 
        duration: '3-4 Weeks',
        focus: 'DQN, A3C, PPO, policy networks',
        tools: 'PyTorch, TensorFlow, Gym'
      },
      { 
        module: 3, 
        title: 'Game AI Development', 
        duration: '2-3 Weeks',
        focus: 'Game AI algorithms, Unity ML-Agents, game bot development',
        tools: 'Unity, ML-Agents'
      },
      { 
        module: 4, 
        title: 'RL Capstone Project', 
        duration: '1-2 Weeks',
        focus: 'Build AI agent for game',
        tools: 'Complete RL Stack'
      },
    ]
  },
  'AI Ethics, Bias & Responsible AI': {
    price: 2499,
    duration: 5,
    placement: 80,
    rating: 4.8,
    reviews: 89,
    curriculum: [
      { 
        module: 1, 
        title: 'AI Ethics Fundamentals', 
        duration: '1-2 Weeks',
        focus: 'Ethics in AI, responsible AI principles',
        tools: 'Literature, case studies'
      },
      { 
        module: 2, 
        title: 'Bias Detection & Fairness', 
        duration: '1-2 Weeks',
        focus: 'Detecting bias, fairness metrics, bias mitigation',
        tools: 'Fairlearn, AI Fairness 360'
      },
      { 
        module: 3, 
        title: 'Model Interpretability & Explainability', 
        duration: '1-2 Weeks',
        focus: 'LIME, SHAP, feature importance, model transparency',
        tools: 'LIME, SHAP, Interpret'
      },
      { 
        module: 4, 
        title: 'Governance & Compliance', 
        duration: '1 Week',
        focus: 'GDPR, responsible AI frameworks, organizational policies',
        tools: 'Documentation, frameworks'
      },
    ]
  },
  'MLOps & AI Model Deployment': {
    price: 5299,
    duration: 9,
    placement: 86,
    rating: 4.8,
    reviews: 68,
    curriculum: [
      { 
        module: 1, 
        title: 'MLOps Fundamentals', 
        duration: '2 Weeks',
        focus: 'ML lifecycle, CI/CD for ML, model versioning',
        tools: 'Git, DVC, MLflow'
      },
      { 
        module: 2, 
        title: 'Model Serving & Deployment', 
        duration: '2-3 Weeks',
        focus: 'FastAPI, Flask, Docker, Kubernetes basics',
        tools: 'FastAPI, Docker, Kubernetes'
      },
      { 
        module: 3, 
        title: 'Cloud Deployment (AWS/GCP/Azure)', 
        duration: '2-3 Weeks',
        focus: 'Deploying models on cloud platforms',
        tools: 'AWS SageMaker, GCP Vertex, Azure ML'
      },
      { 
        module: 4, 
        title: 'Model Monitoring & Maintenance', 
        duration: '1-2 Weeks',
        focus: 'Performance monitoring, data drift detection, retraining pipelines',
        tools: 'Prometheus, ELK Stack'
      },
      { 
        module: 5, 
        title: 'MLOps Capstone Project', 
        duration: '1 Week',
        focus: 'Deploy ML model to production',
        tools: 'Complete MLOps Stack'
      },
    ]
  },
  'Computer Vision with TensorFlow & PyTorch': {
    price: 6399,
    duration: 12,
    placement: 89,
    rating: 4.9,
    reviews: 112,
    curriculum: [
      { 
        module: 1, 
        title: 'TensorFlow & Keras Essentials', 
        duration: '2-3 Weeks',
        focus: 'TensorFlow basics, Keras API, sequential and functional models',
        tools: 'TensorFlow 2.x, Keras'
      },
      { 
        module: 2, 
        title: 'PyTorch Fundamentals', 
        duration: '2-3 Weeks',
        focus: 'PyTorch tensors, autograd, nn module, data loading',
        tools: 'PyTorch, Torchvision'
      },
      { 
        module: 3, 
        title: 'Building CNN Architectures', 
        duration: '2-3 Weeks',
        focus: 'ResNet, VGG, Inception, EfficientNet implementations',
        tools: 'TensorFlow, PyTorch'
      },
      { 
        module: 4, 
        title: 'Object Detection Models (YOLO, Faster R-CNN)', 
        duration: '2-3 Weeks',
        focus: 'Building and training detection models',
        tools: 'PyTorch, TensorFlow'
      },
      { 
        module: 5, 
        title: 'Image Segmentation', 
        duration: '1-2 Weeks',
        focus: 'U-Net, semantic and instance segmentation',
        tools: 'PyTorch, TensorFlow'
      },
      { 
        module: 6, 
        title: 'CV Capstone with TF & Torch', 
        duration: '1-2 Weeks',
        focus: 'Compare and deploy models with both frameworks',
        tools: 'Complete CV Stack'
      },
    ]
  },
  'Time Series Forecasting & ARIMA': {
    price: 4799,
    duration: 8,
    placement: 83,
    rating: 4.7,
    reviews: 84,
    curriculum: [
      { 
        module: 1, 
        title: 'Time Series Analysis Fundamentals', 
        duration: '1-2 Weeks',
        focus: 'Stationarity, autocorrelation, seasonal decomposition',
        tools: 'Statsmodels, Pandas'
      },
      { 
        module: 2, 
        title: 'ARIMA & SARIMA Models', 
        duration: '2-3 Weeks',
        focus: 'ARIMA theory, parameter selection, SARIMA for seasonality',
        tools: 'Statsmodels, pmdarima'
      },
      { 
        module: 3, 
        title: 'Advanced Time Series Methods', 
        duration: '1-2 Weeks',
        focus: 'ARIMAX, Exponential smoothing, Prophet',
        tools: 'Statsmodels, Prophet'
      },
      { 
        module: 4, 
        title: 'Deep Learning for Time Series', 
        duration: '2 Weeks',
        focus: 'LSTM, GRU, Transformer for sequence prediction',
        tools: 'TensorFlow, PyTorch'
      },
    ]
  },
  'AI Powered Chatbots & Virtual Assistants': {
    price: 4299,
    duration: 7,
    placement: 85,
    rating: 4.8,
    reviews: 126,
    curriculum: [
      { 
        module: 1, 
        title: 'Chatbot Fundamentals & NLP', 
        duration: '1-2 Weeks',
        focus: 'Intent recognition, entity extraction, NLP pipelines',
        tools: 'spaCy, NLTK, Rasa'
      },
      { 
        module: 2, 
        title: 'Building Conversational AI with Rasa', 
        duration: '2-3 Weeks',
        focus: 'Rasa framework, dialogue management, story-driven bots',
        tools: 'Rasa, Python'
      },
      { 
        module: 3, 
        title: 'LLM-Powered Chatbots', 
        duration: '1-2 Weeks',
        focus: 'Using GPT for chatbots, context management',
        tools: 'OpenAI API, LangChain'
      },
      { 
        module: 4, 
        title: 'Deployment & Integration', 
        duration: '1-2 Weeks',
        focus: 'Deploying on platforms, integration with messaging apps',
        tools: 'Slack, Telegram, Discord APIs'
      },
    ]
  },
  'Recommendation Systems & Collaborative Filtering': {
    price: 5199,
    duration: 8,
    placement: 86,
    rating: 4.8,
    reviews: 91,
    curriculum: [
      { 
        module: 1, 
        title: 'Recommendation Systems Basics', 
        duration: '1-2 Weeks',
        focus: 'Collaborative filtering, content-based filtering',
        tools: 'Scikit-learn, Surprise'
      },
      { 
        module: 2, 
        title: 'Matrix Factorization Techniques', 
        duration: '2-3 Weeks',
        focus: 'SVD, ALS, NMF for recommendations',
        tools: 'Surprise, Implicit'
      },
      { 
        module: 3, 
        title: 'Deep Learning for Recommendations', 
        duration: '2-3 Weeks',
        focus: 'Neural collaborative filtering, autoencoders',
        tools: 'TensorFlow, PyTorch'
      },
      { 
        module: 4, 
        title: 'Evaluation & Deployment', 
        duration: '1-2 Weeks',
        focus: 'Metrics, A/B testing, production recommenders',
        tools: 'MLflow, Monitoring tools'
      },
    ]
  },
  'Anomaly Detection & Fraud Prevention': {
    price: 4699,
    duration: 7,
    placement: 84,
    rating: 4.8,
    reviews: 103,
    curriculum: [
      { 
        module: 1, 
        title: 'Anomaly Detection Fundamentals', 
        duration: '1-2 Weeks',
        focus: 'Statistical methods, distance-based methods',
        tools: 'Scikit-learn, SciPy'
      },
      { 
        module: 2, 
        title: 'Machine Learning Anomaly Detection', 
        duration: '2-3 Weeks',
        focus: 'Isolation Forest, LOF, One-class SVM',
        tools: 'Scikit-learn, PyOD'
      },
      { 
        module: 3, 
        title: 'Deep Learning for Anomalies', 
        duration: '1-2 Weeks',
        focus: 'Autoencoders, VAE for anomaly detection',
        tools: 'TensorFlow, PyTorch'
      },
      { 
        module: 4, 
        title: 'Fraud Detection Applications', 
        duration: '1-2 Weeks',
        focus: 'Credit card fraud, cybersecurity anomalies',
        tools: 'Complete Stack'
      },
    ]
  },
  'Advanced Generative Models - GANs & Diffusion': {
    price: 7499,
    duration: 11,
    placement: 81,
    rating: 4.9,
    reviews: 72,
    curriculum: [
      { 
        module: 1, 
        title: 'GAN Fundamentals', 
        duration: '2-3 Weeks',
        focus: 'Generator & Discriminator, loss functions, training stability',
        tools: 'PyTorch, TensorFlow'
      },
      { 
        module: 2, 
        title: 'Advanced GAN Architectures', 
        duration: '2-3 Weeks',
        focus: 'DCGAN, StyleGAN, CycleGAN, conditional GANs',
        tools: 'PyTorch'
      },
      { 
        module: 3, 
        title: 'Variational Autoencoders (VAE)', 
        duration: '2-3 Weeks',
        focus: 'VAE theory, probabilistic models, image generation',
        tools: 'PyTorch, TensorFlow'
      },
      { 
        module: 4, 
        title: 'Diffusion Models', 
        duration: '2-3 Weeks',
        focus: 'Diffusion theory, DDPM, Stable Diffusion, text-to-image',
        tools: 'Diffusers, PyTorch'
      },
      { 
        module: 5, 
        title: 'Capstone: Build Generative Model', 
        duration: '1-2 Weeks',
        focus: 'Train and deploy generative models',
        tools: 'Complete Generative Stack'
      },
    ]
  },
  'Job Oriented Business Analyst Course': {
    price: 35000,
    duration: 5,
    placement: 100,
    rating: 4.9,
    reviews: 156,
    curriculum: [
      { 
        module: 1, 
        title: 'Business Analysis Fundamentals', 
        duration: '2-3 Weeks',
        focus: 'Introduction to BA roles, Requirements Gathering techniques, Stakeholder Analysis & Management',
        tools: 'Excel, Visio, JIRA'
      },
      { 
        module: 2, 
        title: 'Advanced Excel & Data Analysis', 
        duration: '2-3 Weeks',
        focus: 'Pivot Tables, VLOOKUP, Data modeling, Financial Analysis, Dashboard creation',
        tools: 'Microsoft Excel, Google Sheets'
      },
      { 
        module: 3, 
        title: 'SQL & Database Fundamentals', 
        duration: '2-3 Weeks',
        focus: 'SQL queries, JOINs, Aggregate functions, Subqueries, Database concepts',
        tools: 'MySQL, PostgreSQL, SQL Server'
      },
      { 
        module: 4, 
        title: 'Process Modeling & Documentation', 
        duration: '1-2 Weeks',
        focus: 'BPMN notation, Use case diagrams, Data flow diagrams, Requirements documentation',
        tools: 'Microsoft Visio, Lucidchart, Miro'
      },
      { 
        module: 5, 
        title: 'Real-World BA Projects & Interview Prep', 
        duration: '2 Weeks',
        focus: 'Banking domain project, Retail analytics case study, BA interview preparation',
        tools: 'Azure DevOps, Confluence, Slack'
      },
    ]
  },
  'Job Oriented Web Full Stack Course': {
    price: 40000,
    duration: 6,
    placement: 100,
    rating: 4.9,
    reviews: 189,
    curriculum: [
      { 
        module: 1, 
        title: 'Web Development Fundamentals', 
        duration: '2-3 Weeks',
        focus: 'HTML5 structure, CSS3 styling, Responsive design, Mobile-first approach',
        tools: 'HTML5, CSS3, VS Code, Chrome DevTools'
      },
      { 
        module: 2, 
        title: 'JavaScript & DOM Manipulation', 
        duration: '3-4 Weeks',
        focus: 'ES6+ syntax, Async/Await, DOM APIs, Event handling, Fetch API',
        tools: 'JavaScript, Node.js, npm'
      },
      { 
        module: 3, 
        title: 'React.js Advanced Patterns', 
        duration: '3-4 Weeks',
        focus: 'Functional components, Hooks, State management (Redux/Zustand), React Router, Performance optimization',
        tools: 'React 18, Redux, React Query, Vite'
      },
      { 
        module: 4, 
        title: 'Node.js & Backend Development', 
        duration: '3-4 Weeks',
        focus: 'Express.js, RESTful APIs, Authentication (JWT), Middleware, Error handling',
        tools: 'Node.js, Express, Postman, JWT'
      },
      { 
        module: 5, 
        title: 'Database Design & Integration', 
        duration: '2-3 Weeks',
        focus: 'MongoDB fundamentals, SQL basics, Schema design, Data relationships, ORMs',
        tools: 'MongoDB, MySQL, Mongoose, Sequelize'
      },
      { 
        module: 6, 
        title: 'Full Stack Capstone Project & Deployment', 
        duration: '2-3 Weeks',
        focus: 'Building complete MERN application, Security best practices, Performance optimization, Deployment to production',
        tools: 'Docker, GitHub, Vercel, AWS, Git'
      },
    ]
  },
  'Job Oriented Java Fullstack Course': {
    price: 42000,
    duration: 6,
    placement: 100,
    rating: 4.9,
    reviews: 201,
    curriculum: [
      { 
        module: 1, 
        title: 'Java Core Programming Concepts', 
        duration: '2-3 Weeks',
        focus: 'OOP fundamentals, Exception handling, Collections framework, Multithreading, Memory management',
        tools: 'Java 17+, IntelliJ IDEA, Maven'
      },
      { 
        module: 2, 
        title: 'Advanced Java & Design Patterns', 
        duration: '2-3 Weeks',
        focus: 'Streams & Lambda expressions, Design patterns, Generics, Reflection, Annotations',
        tools: 'Java, JUnit, Git'
      },
      { 
        module: 3, 
        title: 'Spring Boot Framework Mastery', 
        duration: '3-4 Weeks',
        focus: 'Spring Boot setup, Dependency Injection, Spring Data JPA, Spring Security, RESTful API development',
        tools: 'Spring Boot, Hibernate, Spring Data JPA'
      },
      { 
        module: 4, 
        title: 'Database & SQL Optimization', 
        duration: '2-3 Weeks',
        focus: 'Advanced SQL, Joins, Subqueries, Stored procedures, Transaction management, Query optimization',
        tools: 'MySQL, PostgreSQL, DBeaver'
      },
      { 
        module: 5, 
        title: 'Frontend Integration with Thymeleaf/React', 
        duration: '2 Weeks',
        focus: 'Thymeleaf templating, Bootstrap styling, Form handling, Integration with backend',
        tools: 'Thymeleaf, Bootstrap, HTML/CSS/JavaScript'
      },
      { 
        module: 6, 
        title: 'Real-World Projects & Deployment', 
        duration: '2-3 Weeks',
        focus: 'E-commerce application, Banking system, API security, Performance tuning, Docker deployment',
        tools: 'Docker, Kubernetes, GitHub Actions, AWS'
      },
    ]
  },
  'Job Oriented Data Engineering': {
    price: 45000,
    duration: 7,
    placement: 100,
    rating: 4.9,
    reviews: 143,
    curriculum: [
      { 
        module: 1, 
        title: 'Data Engineering Foundations', 
        duration: '2 Weeks',
        focus: 'Big Data concepts, ETL vs ELT processes, Data warehouse architecture, Data lakes, Data quality',
        tools: 'Talend, Informatica, Apache NiFi'
      },
      { 
        module: 2, 
        title: 'Advanced SQL & Database Design', 
        duration: '2-3 Weeks',
        focus: 'Complex SQL queries, Window functions, CTEs, Query optimization, Indexing strategies',
        tools: 'PostgreSQL, MySQL, SQL Server, DBeaver'
      },
      { 
        module: 3, 
        title: 'Apache Spark for Big Data Processing', 
        duration: '3-4 Weeks',
        focus: 'Spark architecture, RDD & DataFrames, Spark SQL, Performance tuning, Distributed computing',
        tools: 'Apache Spark, PySpark, Scala, Databricks'
      },
      { 
        module: 4, 
        title: 'Hadoop Ecosystem & Hive', 
        duration: '2-3 Weeks',
        focus: 'HDFS, MapReduce, Hive queries, HBase, Cluster management',
        tools: 'Hadoop, Hive, HBase, Pig'
      },
      { 
        module: 5, 
        title: 'Cloud Data Platforms', 
        duration: '2-3 Weeks',
        focus: 'AWS S3 & Redshift, Azure Data Factory, Google BigQuery, Data migration',
        tools: 'AWS, Azure, Google Cloud, Snowflake'
      },
      { 
        module: 6, 
        title: 'Real-Time Data Processing & Pipelines', 
        duration: '2-3 Weeks',
        focus: 'Apache Kafka, Stream processing, Real-time analytics, Data pipeline orchestration',
        tools: 'Apache Kafka, Apache Flink, Airflow, dbt'
      },
      { 
        module: 7, 
        title: 'Capstone Project: End-to-End Data Pipeline', 
        duration: '1-2 Weeks',
        focus: 'Building complete data pipeline with monitoring, data quality checks, production deployment',
        tools: 'All tools covered in course'
      },
    ]
  },
  'Job Oriented Data Analytics': {
    price: 38000,
    duration: 5,
    placement: 100,
    rating: 4.9,
    reviews: 167,
    curriculum: [
      { 
        module: 1, 
        title: 'Foundations of Data Analytics', 
        duration: '2-3 Weeks',
        focus: 'Statistics fundamentals, Math basics, Data types, Analytics lifecycle, Data collection methods',
        tools: 'Excel, Google Sheets, Python'
      },
      { 
        module: 2, 
        title: 'Data Manipulation & SQL', 
        duration: '3-4 Weeks',
        focus: 'Advanced Excel functions, SQL JOINs, CTEs, Window functions, Database tools',
        tools: 'Microsoft Excel, MySQL, PostgreSQL, DBeaver'
      },
      { 
        module: 3, 
        title: 'Python for Data Analytics', 
        duration: '3-4 Weeks',
        focus: 'Python programming, Pandas data manipulation, NumPy arrays, Data cleaning & preprocessing',
        tools: 'Python, Pandas, NumPy, Jupyter Notebook, VS Code'
      },
      { 
        module: 4, 
        title: 'Data Visualization & BI Tools', 
        duration: '3-4 Weeks',
        focus: 'Matplotlib & Seaborn visualization, Power BI dashboards, Tableau reports, Storytelling with data',
        tools: 'Power BI, Tableau, Matplotlib, Seaborn, Plotly'
      },
      { 
        module: 5, 
        title: 'Advanced Analytics & Career Readiness', 
        duration: '2-3 Weeks',
        focus: 'Intro to ML, Time series analysis, A/B testing, Capstone projects, Interview preparation',
        tools: 'Scikit-Learn, Excel, Tableau, Git/GitHub'
      },
    ]
  },
  'Job Oriented Data Science AI with Data Analytics': {
    price: 50000,
    duration: 8,
    placement: 100,
    rating: 4.9,
    reviews: 178,
    curriculum: [
      { 
        module: 1, 
        title: 'Python Programming & Data Wrangling', 
        duration: '2-3 Weeks',
        focus: 'Python syntax, Data structures, NumPy arrays, Pandas DataFrames, Data cleaning & preprocessing',
        tools: 'Python 3.10+, NumPy, Pandas, Jupyter Notebook'
      },
      { 
        module: 2, 
        title: 'Statistical Analysis & Probability', 
        duration: '2-3 Weeks',
        focus: 'Descriptive statistics, Probability distributions, Hypothesis testing, Correlation & regression',
        tools: 'SciPy, Statsmodels, Matplotlib, Seaborn'
      },
      { 
        module: 3, 
        title: 'Machine Learning Fundamentals', 
        duration: '3-4 Weeks',
        focus: 'Supervised learning, Unsupervised learning, Regression, Classification, Model evaluation metrics',
        tools: 'Scikit-Learn, XGBoost, LightGBM'
      },
      { 
        module: 4, 
        title: 'Deep Learning & Neural Networks', 
        duration: '3-4 Weeks',
        focus: 'Neural networks, CNNs for computer vision, RNNs for sequences, Transfer learning',
        tools: 'TensorFlow, Keras, PyTorch'
      },
      { 
        module: 5, 
        title: 'Advanced Generative AI & LLMs', 
        duration: '2-3 Weeks',
        focus: 'Transformer architecture, LLMs (GPT, BERT), Prompt engineering, Fine-tuning, RAG systems',
        tools: 'Hugging Face, LangChain, OpenAI APIs, LLaMA'
      },
      { 
        module: 6, 
        title: 'NLP & Text Analytics', 
        duration: '2 Weeks',
        focus: 'NLP fundamentals, Tokenization, Word embeddings, Sentiment analysis, Text classification',
        tools: 'NLTK, spaCy, TextBlob, Transformers'
      },
      { 
        module: 7, 
        title: 'Data Analytics & Business Intelligence', 
        duration: '2 Weeks',
        focus: 'SQL for analytics, Data visualization, Dashboard creation, Business metrics, Storytelling',
        tools: 'SQL, Power BI, Tableau, Plotly'
      },
      { 
        module: 8, 
        title: 'Capstone Project & Model Deployment', 
        duration: '1-2 Weeks',
        focus: 'End-to-end ML project, Model optimization, API deployment, Production monitoring',
        tools: 'Docker, Flask/FastAPI, AWS, Git'
      },
    ]
  },
  'Data Science': {
    price: 48000,
    duration: 8,
    placement: 100,
    rating: 4.9,
    reviews: 167,
    curriculum: [
      { 
        module: 1, 
        title: 'Python for Data Science', 
        duration: '2-3 Weeks',
        focus: 'Python fundamentals, NumPy arrays, Pandas DataFrames, Matplotlib visualization, Basic statistics',
        tools: 'Python 3.10+, Anaconda, Jupyter Notebook, VS Code'
      },
      { 
        module: 2, 
        title: 'Statistical Methods & Probability', 
        duration: '2-3 Weeks',
        focus: 'Descriptive statistics, Probability theory, Hypothesis testing, Distribution analysis, Statistical inference',
        tools: 'SciPy, Statsmodels, Matplotlib, Seaborn'
      },
      { 
        module: 3, 
        title: 'Machine Learning Algorithms', 
        duration: '3-4 Weeks',
        focus: 'Linear & Logistic Regression, Decision Trees, Random Forests, SVM, Ensemble methods, Model evaluation',
        tools: 'Scikit-Learn, XGBoost, Pandas, GridSearchCV'
      },
      { 
        module: 4, 
        title: 'Deep Learning & Neural Networks', 
        duration: '3-4 Weeks',
        focus: 'Neural network architecture, Backpropagation, Convolutional Neural Networks (CNNs), Recurrent Neural Networks (RNNs), GANs basics',
        tools: 'TensorFlow, Keras, PyTorch, Matplotlib'
      },
      { 
        module: 5, 
        title: 'Natural Language Processing', 
        duration: '2-3 Weeks',
        focus: 'Text preprocessing, Word embeddings (Word2Vec, GloVe), Sentiment analysis, Topic modeling, Named Entity Recognition',
        tools: 'NLTK, spaCy, Gensim, Transformers'
      },
      { 
        module: 6, 
        title: 'Computer Vision Applications', 
        duration: '2 Weeks',
        focus: 'Image processing, CNN architectures, Object detection, Image segmentation, Pose estimation',
        tools: 'OpenCV, TensorFlow, PyTorch, YOLO'
      },
      { 
        module: 7, 
        title: 'Big Data & Distributed Computing', 
        duration: '2 Weeks',
        focus: 'Apache Spark fundamentals, Distributed ML, Scalability concepts, Big data tools',
        tools: 'Apache Spark, PySpark, Hadoop'
      },
      { 
        module: 8, 
        title: 'Capstone Project & Model Deployment', 
        duration: '1-2 Weeks',
        focus: 'End-to-end data science project, Model optimization, Production deployment, API development, Monitoring',
        tools: 'Flask/FastAPI, Docker, AWS/GCP, Git, Jenkins'
      },
    ]
  },
  'Data Analytics': {
    price: 42000,
    duration: 5,
    placement: 100,
    rating: 4.9,
    reviews: 152,
    curriculum: [
      { 
        module: 1, 
        title: 'Foundations of Data Analytics', 
        duration: '2-3 Weeks',
        focus: 'Statistics, Math, Data types, Analytics lifecycle, Data collection & quality',
        tools: 'Excel, Google Sheets'
      },
      { 
        module: 2, 
        title: 'Data Manipulation & SQL', 
        duration: '3-4 Weeks',
        focus: 'Advanced Excel, SQL JOINs, CTEs, Window Functions, Database fundamentals',
        tools: 'Microsoft Excel, MySQL, PostgreSQL, SQL Server'
      },
      { 
        module: 3, 
        title: 'Python for Data Analytics', 
        duration: '3-4 Weeks',
        focus: 'Python programming, Pandas, NumPy, Data cleaning, Preprocessing',
        tools: 'Python, Pandas, NumPy, Jupyter Notebook, VS Code'
      },
      { 
        module: 4, 
        title: 'Data Visualization & BI Tools', 
        duration: '3-4 Weeks',
        focus: 'Matplotlib, Seaborn, Power BI, Tableau, Dashboard design, Data storytelling',
        tools: 'Matplotlib, Seaborn, Power BI, Tableau, Plotly'
      },
      { 
        module: 5, 
        title: 'Advanced Analytics & Career Readiness', 
        duration: '2-3 Weeks',
        focus: 'Intro to ML, Time series analysis, A/B testing, Capstone projects, Interview preparation',
        tools: 'Scikit-Learn, Excel, Tableau, Git/GitHub'
      },
    ]
  },
  'Advanced Generative AI': {
    price: 55000,
    duration: 6,
    placement: 100,
    rating: 4.9,
    reviews: 98,
    curriculum: [
      { 
        module: 1, 
        title: 'AI & Generative AI Fundamentals', 
        duration: '2 Weeks',
        focus: 'AI history & evolution, Neural networks basics, Transformer architecture, Attention mechanisms, Foundation models',
        tools: 'Python, PyTorch, TensorFlow'
      },
      { 
        module: 2, 
        title: 'Large Language Models Deep Dive', 
        duration: '2-3 Weeks',
        focus: 'GPT architecture, BERT, T5, Model training, Fine-tuning, Transfer learning, Model evaluation',
        tools: 'Hugging Face, Transformers library, GPT models'
      },
      { 
        module: 3, 
        title: 'Prompt Engineering & Advanced Techniques', 
        duration: '2 Weeks',
        focus: 'Prompt design patterns, Few-shot learning, Chain-of-Thought, In-context learning, Zero-shot learning',
        tools: 'OpenAI API, Azure OpenAI, Langchain'
      },
      { 
        module: 4, 
        title: 'Retrieval Augmented Generation (RAG)', 
        duration: '2 Weeks',
        focus: 'Vector databases, Semantic search, Document chunking, RAG architecture, Knowledge graph integration',
        tools: 'Pinecone, Weaviate, LangChain, FAISS'
      },
      { 
        module: 5, 
        title: 'Multimodal & Specialized AI Models', 
        duration: '1-2 Weeks',
        focus: 'Vision-language models (CLIP, GPT-4V), Audio models, Multimodal fusion, Domain-specific models',
        tools: 'CLIP, Stable Diffusion, Whisper, DALL-E'
      },
      { 
        module: 6, 
        title: 'Production Deployment & Ethics', 
        duration: '1-2 Weeks',
        focus: 'Model optimization, API deployment, Cost optimization, AI ethics, Safety & alignment, Legal compliance',
        tools: 'Docker, FastAPI, AWS/Azure, MLflow, Model monitoring'
      },
    ]
  },
  'Cloud Computing': {
    price: 45000,
    duration: 6,
    placement: 100,
    rating: 4.9,
    reviews: 134,
    curriculum: [
      { 
        module: 1, 
        title: 'Cloud Computing Fundamentals', 
        duration: '1-2 Weeks',
        focus: 'Cloud models (IaaS, PaaS, SaaS), Infrastructure as Code, Cloud security, Cost optimization',
        tools: 'Terraform, CloudFormation'
      },
      { 
        module: 2, 
        title: 'AWS Core Services', 
        duration: '2-3 Weeks',
        focus: 'EC2 instances, S3 storage, RDS databases, VPC networking, ELB, Auto Scaling',
        tools: 'AWS Console, AWS CLI, AWS SDKs'
      },
      { 
        module: 3, 
        title: 'AWS Advanced Services', 
        duration: '2-3 Weeks',
        focus: 'Lambda functions, DynamoDB, CloudFront CDN, SQS/SNS messaging, Serverless architecture',
        tools: 'AWS SAM, Serverless Framework'
      },
      { 
        module: 4, 
        title: 'Multi-Cloud & Alternative Platforms', 
        duration: '2 Weeks',
        focus: 'Azure fundamentals, Google Cloud Platform, Hybrid cloud, Multi-cloud architecture, Cloud migration',
        tools: 'Azure Portal, Google Cloud Console'
      },
      { 
        module: 5, 
        title: 'Containerization & Orchestration', 
        duration: '2-3 Weeks',
        focus: 'Docker containerization, Kubernetes orchestration, Container registries, Microservices patterns',
        tools: 'Docker, Kubernetes, Docker Compose, Helm'
      },
      { 
        module: 6, 
        title: 'Cloud Projects & Best Practices', 
        duration: '1-2 Weeks',
        focus: 'Scalable web application, Disaster recovery, Performance tuning, Security best practices, Cost optimization',
        tools: 'All cloud tools covered'
      },
    ]
  },
  'DevOps Engineering': {
    price: 42000,
    duration: 6,
    placement: 100,
    rating: 4.9,
    reviews: 121,
    curriculum: [
      { 
        module: 1, 
        title: 'DevOps Fundamentals & Culture', 
        duration: '1-2 Weeks',
        focus: 'DevOps principles, CI/CD concepts, Agile & DevOps alignment, Infrastructure management, Team structure',
        tools: 'JIRA, Slack, Git'
      },
      { 
        module: 2, 
        title: 'Version Control & Git Workflows', 
        duration: '1-2 Weeks',
        focus: 'Git fundamentals, Branching strategies, Merge conflicts, Git workflows (GitFlow), GitHub collaboration',
        tools: 'Git, GitHub, GitLab'
      },
      { 
        module: 3, 
        title: 'CI/CD with Jenkins & GitLab', 
        duration: '2-3 Weeks',
        focus: 'Jenkins setup, Pipeline creation, Build automation, Test automation, Deployment scripts',
        tools: 'Jenkins, GitLab CI, GitHub Actions'
      },
      { 
        module: 4, 
        title: 'Docker & Container Management', 
        duration: '2-3 Weeks',
        focus: 'Docker fundamentals, Dockerfile creation, Container networking, Docker Compose, Registry management',
        tools: 'Docker, Docker Compose, Docker Swarm'
      },
      { 
        module: 5, 
        title: 'Kubernetes & Orchestration', 
        duration: '2-3 Weeks',
        focus: 'Kubernetes architecture, Pods & Services, Deployments, ConfigMaps & Secrets, Ingress, Helm charts',
        tools: 'Kubernetes, Helm, kubectl'
      },
      { 
        module: 6, 
        title: 'Monitoring, Logging & Infrastructure', 
        duration: '1-2 Weeks',
        focus: 'Prometheus monitoring, ELK Stack logging, Grafana dashboards, Infrastructure as Code, Best practices',
        tools: 'Prometheus, ELK Stack, Grafana, Terraform, Ansible'
      },
    ]
  },
  'AWS Solutions Architect': {
    price: 48000,
    duration: 6,
    placement: 100,
    rating: 4.9,
    reviews: 145,
    curriculum: [
      { 
        module: 1, 
        title: 'AWS Core Services & Architecture', 
        duration: '2-3 Weeks',
        focus: 'EC2 advanced features, Storage solutions (S3, EBS, EFS), Database services (RDS, DynamoDB), VPC networking',
        tools: 'AWS Console, AWS CLI, CloudFormation'
      },
      { 
        module: 2, 
        title: 'High Availability & Scalability', 
        duration: '2-3 Weeks',
        focus: 'Elastic Load Balancing, Auto Scaling groups, Multi-AZ deployments, Disaster recovery strategies, RTO/RPO',
        tools: 'ELB, ASG, CloudWatch'
      },
      { 
        module: 3, 
        title: 'Security & Compliance', 
        duration: '2 Weeks',
        focus: 'IAM policies & roles, Encryption (at rest & in transit), VPC security groups, WAF, Compliance frameworks (HIPAA, PCI)',
        tools: 'IAM, KMS, SecurityHub, Config'
      },
      { 
        module: 4, 
        title: 'Performance Optimization', 
        duration: '1-2 Weeks',
        focus: 'Caching strategies, CloudFront CDN, Database optimization, Cost optimization, Right-sizing instances',
        tools: 'ElastiCache, CloudFront, RDS Performance Insights, AWS Trusted Advisor'
      },
      { 
        module: 5, 
        title: 'Solutions & Design Patterns', 
        duration: '1-2 Weeks',
        focus: 'Web application architecture, Big data solutions, Serverless architecture, Hybrid/multi-cloud',
        tools: 'Lambda, Redshift, EMR'
      },
      { 
        module: 6, 
        title: 'AWS Solutions Architect Exam Prep', 
        duration: '1-2 Weeks',
        focus: 'SAA exam format & strategy, Case study analysis, Practice tests, Time management, Real-world scenarios',
        tools: 'AWS SAA practice exams, Whizlabs, A Cloud Guru'
      },
    ]
  },
  'PMP Certification Training': {
    price: 40000,
    duration: 4,
    placement: 95,
    rating: 4.9,
    reviews: 89,
    curriculum: [
      { 
        module: 1, 
        title: 'Project Management Fundamentals', 
        duration: '1 Week',
        focus: 'PMBOK Introduction, Project vs Operations, Process groups, Knowledge areas, PMP requirements',
        tools: 'PMBOK Guide, PMP Study notes'
      },
      { 
        module: 2, 
        title: 'Initiating & Planning Processes', 
        duration: '1-2 Weeks',
        focus: 'Project Charter, Scope management, Schedule planning, Cost estimation, Risk planning, Quality planning',
        tools: 'Microsoft Project, SmartSheet'
      },
      { 
        module: 3, 
        title: 'Executing & Monitoring Processes', 
        duration: '1-2 Weeks',
        focus: 'Quality assurance, Risk monitoring, Communication management, Stakeholder management, Issue resolution',
        tools: 'JIRA, Confluence'
      },
      { 
        module: 4, 
        title: 'Closing & Professional Responsibility', 
        duration: '1 Week',
        focus: 'Project closure, Lessons learned, Professional ethics, Integration management, Compliance',
        tools: 'PMBOK Guide'
      },
      { 
        module: 5, 
        title: 'PMP Exam Strategy & Preparation', 
        duration: '1-2 Weeks',
        focus: 'Exam format, 200 practice questions, Time management strategies, Mock exams, Test-taking techniques',
        tools: 'PMP practice tests, TIA (Teach It Again Sam)'
      },
    ]
  },
  'CSM Certification Training': {
    price: 25000,
    duration: 2,
    placement: 90,
    rating: 4.9,
    reviews: 76,
    curriculum: [
      { 
        module: 1, 
        title: 'Scrum Framework Fundamentals', 
        duration: '3-4 Days',
        focus: 'Scrum roles (Product Owner, Scrum Master, Development Team), Scrum events, Artifacts, Scrum values & principles',
        tools: 'Scrum Guide, Miro, Jira'
      },
      { 
        module: 2, 
        title: 'Scrum Master Responsibilities', 
        duration: '3-4 Days',
        focus: 'Servant leadership, Removing impediments, Team dynamics, Coaching skills, Conflict resolution',
        tools: 'Miro, Jira, Slack'
      },
      { 
        module: 3, 
        title: 'Agile Ceremonies & Best Practices', 
        duration: '2-3 Days',
        focus: 'Sprint planning, Daily standups, Sprint reviews, Sprint retrospectives, Refinement sessions',
        tools: 'Azure DevOps, Monday.com'
      },
      { 
        module: 4, 
        title: 'CSM Exam Preparation', 
        duration: '3-4 Days',
        focus: 'CSM exam format, 80 practice questions, Review sessions, Final mock exam, Test strategies',
        tools: 'Scrum Study, CSM practice exams'
      },
    ]
  },
};

// Employer Partners (Logo Carousel)
export const EMPLOYER_PARTNERS = [
  { name: 'Infosys', logo: '🏢', sector: 'IT Services' },
  { name: 'Wipro', logo: '🏭', sector: 'IT Services' },
  { name: 'TCS', logo: '💼', sector: 'IT Services' },
  { name: 'Accenture', logo: '🌐', sector: 'Consulting' },
  { name: 'Capgemini', logo: '📱', sector: 'IT Services' },
  { name: 'Microsoft', logo: '💻', sector: 'Technology' },
  { name: 'Google', logo: '🔍', sector: 'Technology' },
  { name: 'Amazon', logo: '🛒', sector: 'Technology' },
  { name: 'Deloitte', logo: '📊', sector: 'Consulting' },
  { name: 'IBM', logo: '🖥️', sector: 'IT Services' },
  { name: 'Adobe', logo: '🎨', sector: 'Software' },
  { name: 'Apple', logo: '🍎', sector: 'Technology' },
  { name: 'Goldman Sachs', logo: '💰', sector: 'Finance' },
  { name: 'JP Morgan', logo: '🏦', sector: 'Finance' },
  { name: 'Uber', logo: '🚗', sector: 'Tech Startup' },
  { name: 'Flipkart', logo: '📦', sector: 'E-commerce' },
  { name: 'HDFC Bank', logo: '🏪', sector: 'Finance' },
  { name: 'ICICI Bank', logo: '💳', sector: 'Finance' },
  { name: 'HCL Technologies', logo: '⚙️', sector: 'IT Services' },
  { name: 'Tech Mahindra', logo: '🔧', sector: 'IT Services' },
];

// Student Testimonials with Photos
export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Raj Kumar Singh',
    photo: '👨‍💼',
    role: 'Senior Software Engineer',
    company: 'Microsoft India',
    course: 'Full Stack Development',
    salary: '₹16 LPA',
    testimonial: 'TrainerMentors helped me transition from a basic developer to a full-stack engineer. The hands-on projects and mentor guidance were invaluable.',
    rating: 5,
    verified: true,
  },
  {
    id: 2,
    name: 'Priya Sharma',
    photo: '👩‍💼',
    role: 'Data Scientist',
    company: 'Google',
    course: 'Data Science with AI',
    salary: '₹18 LPA',
    testimonial: 'The Data Science course was incredibly comprehensive. I got placed within 2 weeks of completing the course!',
    rating: 5,
    verified: true,
  },
  {
    id: 3,
    name: 'Amit Patel',
    photo: '👨‍💼',
    role: 'Cloud Architect',
    company: 'Amazon Web Services',
    course: 'AWS Solutions Architect',
    salary: '₹20 LPA',
    testimonial: 'Best investment in my career. The AWS course gave me real-world knowledge that I use daily.',
    rating: 5,
    verified: true,
  },
  {
    id: 4,
    name: 'Neha Verma',
    photo: '👩‍💼',
    role: 'DevOps Engineer',
    company: 'Goldman Sachs',
    course: 'DevOps Engineering',
    salary: '₹17 LPA',
    testimonial: 'Fantastic mentors who actually work in the industry. The placement support was top-notch.',
    rating: 5,
    verified: true,
  },
  {
    id: 5,
    name: 'Vikram Desai',
    photo: '👨‍💼',
    role: 'Project Manager',
    company: 'Deloitte',
    course: 'PMP Certification',
    salary: '₹15 LPA',
    testimonial: 'Clear curriculum and excellent study materials. Passed my PMP exam on the first attempt!',
    rating: 5,
    verified: true,
  },
  {
    id: 6,
    name: 'Anjali Nair',
    photo: '👩‍💼',
    role: 'Business Analyst',
    company: 'Accenture',
    course: 'Business Analyst Course',
    salary: '₹14 LPA',
    testimonial: 'The course structure is perfect for beginners. Transition into IT was smooth thanks to this course.',
    rating: 5,
    verified: true,
  },
];

// Success Stories
export const SUCCESS_STORIES = [
  {
    id: 1,
    title: 'From Zero to Full Stack Developer',
    studentName: 'Rajesh Kumar',
    studentPhoto: '👨‍💼',
    previousRole: 'Support Technician',
    previousSalary: '₹4 LPA',
    currentRole: 'Senior Full Stack Developer',
    currentSalary: '₹16 LPA',
    company: 'Microsoft India',
    course: 'Full Stack Development',
    duration: '6 months',
    description: 'Rajesh had basic knowledge but wanted to become a professional developer. After completing the Full Stack course, he got placed in Microsoft with a 4x salary increase!',
    improvement: '300%',
    metric: 'Salary Growth',
  },
  {
    id: 2,
    title: 'Data Analyst to Data Scientist',
    studentName: 'Priya Deshmukh',
    studentPhoto: '👩‍💼',
    previousRole: 'Excel Analyst',
    previousSalary: '₹6 LPA',
    currentRole: 'Senior Data Scientist',
    currentSalary: '₹20 LPA',
    company: 'Google India',
    course: 'Data Science with AI',
    duration: '8 months',
    description: 'Priya learned advanced analytics and machine learning through our comprehensive curriculum. Now leading data initiatives at Google.',
    improvement: '233%',
    metric: 'Salary Growth',
  },
  {
    id: 3,
    title: 'Career Switch to Cloud Engineering',
    studentName: 'Arjun Singh',
    studentPhoto: '👨‍💼',
    previousRole: 'Network Admin',
    previousSalary: '₹8 LPA',
    currentRole: 'Cloud Solutions Architect',
    currentSalary: '₹18 LPA',
    company: 'Amazon Web Services',
    course: 'AWS Solutions Architect',
    duration: '6 months',
    description: 'Arjun transitioned from network administration to cloud architecture. The hands-on AWS labs gave him the confidence to handle complex cloud infrastructure.',
    improvement: '125%',
    metric: 'Salary Growth',
  },
  {
    id: 4,
    title: 'Career Gap to Career Growth',
    studentName: 'Meera Sharma',
    studentPhoto: '👩‍💼',
    previousRole: 'Homemaker (Career Gap)',
    previousSalary: '₹0',
    currentRole: 'DevOps Engineer',
    currentSalary: '₹14 LPA',
    company: 'Flipkart',
    course: 'DevOps Engineering',
    duration: '3 months',
    description: 'After a 5-year gap, Meera re-entered the workforce through our DevOps course. Placed within 1 month of completing the program.',
    improvement: 'Career Re-entry',
    metric: 'Success',
  },
];

// Blog Posts (SEO-Optimized)
export const BLOG_POSTS = [
  {
    id: 1,
    title: 'Top 10 Skills Every Software Developer Must Have in 2025',
    slug: 'top-10-skills-software-developer-2025',
    excerpt: 'Discover the most in-demand programming skills and technologies that will boost your tech career in 2025.',
    content: `In 2025, the tech industry continues to evolve at a rapid pace. As a software developer, staying ahead of the curve is essential for career growth. Here are the 10 most important skills you need:

1. **Full-Stack Development**: Understanding both frontend and backend technologies is crucial. Master React, Node.js, and database design.

2. **Cloud Computing**: AWS, Azure, and Google Cloud are industry standards. Learn containerization with Docker and Kubernetes.

3. **AI & Machine Learning**: Basic AI knowledge is becoming essential. Understand how to integrate AI models into applications.

4. **API Development & Design**: RESTful and GraphQL APIs are fundamental. Master API security and best practices.

5. **DevOps & CI/CD**: Automate your deployment pipelines. Learn Jenkins, GitHub Actions, and deployment strategies.

6. **Database Design**: SQL and NoSQL databases are both important. Understand when to use which.

7. **System Design**: Design scalable, maintainable systems. Learn about microservices and distributed systems.

8. **Security Best Practices**: Secure coding is non-negotiable. Understand OWASP top 10 and encryption.

9. **Version Control**: Git is essential. Master branching strategies and collaboration techniques.

10. **Soft Skills & Communication**: Technical skills alone aren't enough. Clear communication and teamwork are vital.

The tech industry values continuous learners. Invest time in these skills, and your career will flourish.`,
    author: 'Rajesh Kumar',
    date: '2025-01-15',
    category: 'Career',
    readTime: '8 min read',
    image: '📚',
  },
  {
    id: 2,
    title: 'Complete Guide to AWS Certification Path',
    slug: 'aws-certification-path-guide',
    excerpt: 'Learn the best AWS certifications for your career goals and how to prepare for them effectively.',
    content: `Amazon Web Services (AWS) certifications are among the most valuable credentials in the cloud industry. Whether you're a developer, architect, or administrator, AWS has a certification path for you.

**Understanding AWS Certification Levels**

AWS offers three main certification levels:

**1. Associate Level**
- AWS Certified Cloud Practitioner (CLF)
- AWS Certified Solutions Architect - Associate
- AWS Certified Developer - Associate

**2. Professional Level**
- AWS Certified Solutions Architect - Professional
- AWS Certified DevOps Engineer - Professional

**3. Specialty Certifications**
- AWS Certified Database Specialty
- AWS Certified Machine Learning - Specialty
- AWS Certified Security - Specialty

**Recommended Path for Different Roles**

**For Developers:**
Start with Cloud Practitioner → Developer Associate → DevOps Engineer Professional

**For Architects:**
Start with Cloud Practitioner → Solutions Architect Associate → Solutions Architect Professional

**For System Administrators:**
Start with Cloud Practitioner → Solutions Architect Associate → Operations Professional

**Preparation Tips**

1. **Use Official AWS Training**: Leverage A Cloud Guru and Linux Academy courses.
2. **Practice with Hands-on Labs**: Create an AWS free tier account and practice.
3. **Take Practice Exams**: Use ExamTopics and Whizlabs for mock exams.
4. **Study Continuously**: Dedicate 1-2 hours daily for 4-6 weeks.
5. **Join Study Groups**: Connect with other candidates for support.

AWS certifications open doors to lucrative opportunities. Start your cloud journey today!`,
    author: 'Priya Sharma',
    date: '2025-01-10',
    category: 'Cloud',
    readTime: '10 min read',
    image: '☁️',
  },
  {
    id: 3,
    title: 'Data Science vs Data Analytics: Which Career Path is Right for You?',
    slug: 'data-science-vs-analytics',
    excerpt: 'Understand the differences between Data Science and Data Analytics to make the right career choice.',
    content: `Many aspiring data professionals struggle with the question: should I pursue Data Science or Data Analytics? While the terms are sometimes used interchangeably, they're quite different career paths.

**Key Differences**

**Data Analytics**
- Focus: Analyzing past and current data
- Goal: Answer specific business questions
- Tools: SQL, Excel, Tableau, Power BI
- Skills: Statistical analysis, SQL, visualization
- Timeline: Quick insights (days to weeks)
- Career Path: Business Analyst → Senior Analyst → Analytics Manager

**Data Science**
- Focus: Building predictive models and algorithms
- Goal: Answer "what will happen next?"
- Tools: Python, R, ML frameworks, TensorFlow
- Skills: Programming, ML algorithms, statistics, math
- Timeline: Longer projects (weeks to months)
- Career Path: Junior Data Scientist → Senior Scientist → ML Engineer

**Salary Comparison**
In India:
- Data Analyst: ₹4-8 LPA (fresher to 3 years)
- Data Scientist: ₹6-15 LPA (fresher to 3 years)

**Which is Right for You?**

Choose **Data Analytics** if you:
- Prefer working with business teams
- Like creating dashboards and reports
- Enjoy solving immediate business problems
- Have strong Excel and SQL skills

Choose **Data Science** if you:
- Love programming and mathematics
- Enjoy building complex models
- Want to work on research projects
- Have strong Python/R background

**Bottom Line**
Both are rewarding careers with excellent growth prospects. Choose based on your interests and strengths!`,
    author: 'Amit Patel',
    date: '2025-01-05',
    category: 'Data',
    readTime: '7 min read',
    image: '📊',
  },
  {
    id: 4,
    title: 'DevOps Career: From Basics to Expert Level',
    slug: 'devops-career-guide',
    excerpt: 'A comprehensive roadmap for building a successful DevOps career with hands-on experience.',
    content: `DevOps has revolutionized how software is developed and deployed. If you're interested in this field, here's your roadmap to success.

**Understanding DevOps**

DevOps combines Development and Operations to:
- Automate deployment processes
- Improve collaboration between teams
- Reduce time-to-market
- Ensure reliability and scalability

**DevOps Career Roadmap**

**Level 1: Foundation (Months 1-3)**
- Linux fundamentals
- Version control (Git)
- Basic networking
- Shell scripting
- Salary Range: ₹3-5 LPA

**Level 2: Intermediate (Months 4-9)**
- CI/CD pipelines (Jenkins)
- Docker containerization
- Configuration management (Ansible)
- Infrastructure as Code (Terraform)
- Basic cloud (AWS/Azure)
- Salary Range: ₹6-10 LPA

**Level 3: Advanced (Months 10-18)**
- Kubernetes orchestration
- Advanced cloud services
- Monitoring & logging (ELK, Prometheus)
- Security practices
- Disaster recovery
- Salary Range: ₹12-18 LPA

**Level 4: Expert (18+ months)**
- Multi-cloud strategies
- Advanced security
- ML Ops
- Team leadership
- Salary Range: ₹20-30+ LPA

**Top DevOps Tools to Master**
1. Git & GitHub
2. Docker & Kubernetes
3. Jenkins
4. Ansible/Terraform
5. Prometheus/ELK
6. AWS/Azure/GCP

**Job Market**
DevOps engineers are in high demand with 40%+ job growth annually. Companies of all sizes need DevOps expertise.

Start learning today and build a lucrative career!`,
    author: 'Vikram Desai',
    date: '2024-12-28',
    category: 'DevOps',
    readTime: '12 min read',
    image: '🔧',
  },
  {
    id: 5,
    title: 'How to Ace Your Technical Interview: Tips from Tech Companies',
    slug: 'ace-technical-interview',
    excerpt: 'Expert tips and strategies to crack technical interviews at FAANG and top companies.',
    content: `Technical interviews are notoriously challenging, but with proper preparation, you can ace them. Here's what you need to know.

**Common Technical Interview Formats**

1. **Coding Challenges**: Solve algorithmic problems (LeetCode style)
2. **System Design**: Design large-scale systems
3. **Behavioral**: Answer company culture questions
4. **Take-home Assignments**: Build a small project

**Preparation Strategy (8 weeks)**

**Weeks 1-2: Fundamentals**
- Master data structures (arrays, linked lists, trees, graphs)
- Practice 20 easy problems daily
- Resources: LeetCode, HackerRank

**Weeks 3-4: Medium Problems**
- Practice 15 medium problems daily
- Focus on pattern recognition
- Learn common algorithms

**Weeks 5-6: Hard Problems**
- Practice 5-10 hard problems daily
- Practice mock interviews
- Learn system design basics

**Weeks 7-8: Full Practice**
- Take full mock interview tests
- Practice with friends
- Review mistakes

**Top 10 Most Asked Topics**
1. Arrays & Strings
2. Linked Lists
3. Trees & Graphs
4. Dynamic Programming
5. Sorting & Searching
6. Hash Maps
7. Stacks & Queues
8. Recursion
9. Bit Manipulation
10. System Design

**Interview Day Tips**
1. **Clarify Requirements**: Ask questions before coding
2. **Think Aloud**: Explain your approach
3. **Write Clean Code**: Follow best practices
4. **Test Your Solution**: Walk through examples
5. **Discuss Trade-offs**: Show system design thinking
6. **Be Humble**: Admit when you don't know
7. **Ask Questions**: Show genuine interest

**Common Mistakes to Avoid**
- Jumping into coding without planning
- Ignoring edge cases
- Not testing your solution
- Being defensive about feedback
- Rushing through explanations

**Salary Impact**
A strong technical interview can increase your offer by 20-40%. It's worth investing time!

Start preparing today and land your dream job!`,
    author: 'Neha Verma',
    date: '2024-12-20',
    category: 'Interview',
    readTime: '9 min read',
    image: '💼',
  },
  {
    id: 6,
    title: 'The Future of Artificial Intelligence: Skills You Need Now',
    slug: 'future-ai-skills',
    excerpt: 'Explore the emerging AI technologies and skills that will be crucial for your career growth.',
    content: `Artificial Intelligence is no longer a buzzword—it's reshaping every industry. Here's what you need to know to stay relevant.

**Current State of AI in 2025**

- **Generative AI**: ChatGPT, Claude, and similar models are mainstream
- **AI Integration**: Every software now has AI features
- **Specialized Models**: Custom models for specific domains
- **Enterprise AI**: Companies investing heavily in AI infrastructure

**Essential AI Skills for Different Roles**

**For Software Developers**
- LLM Integration (API usage)
- Prompt engineering
- Fine-tuning models
- Building AI-powered applications
- Understanding AI limitations

**For Data Scientists**
- Deep learning frameworks (PyTorch, TensorFlow)
- Natural Language Processing (NLP)
- Computer Vision
- Model optimization
- Production ML pipelines

**For Business Leaders**
- AI strategy
- Use case identification
- ROI calculation
- Risk management
- Ethical AI governance

**Emerging Technologies**

**1. Large Language Models (LLMs)**
- GPT-4, Claude, LLama
- Fine-tuning for domain-specific tasks
- Retrieval Augmented Generation (RAG)

**2. Multimodal AI**
- Understanding text, images, video, audio
- Practical applications in healthcare, retail

**3. Edge AI**
- Running AI on devices (not cloud)
- Privacy-first AI solutions

**4. AI Agents**
- Autonomous systems that make decisions
- Real-world applications expanding

**Skills to Learn Now**

**Beginner Path**
1. Python programming
2. Basic machine learning (Scikit-learn)
3. Linear algebra & calculus
4. AI ethics and responsibility

**Intermediate Path**
1. Deep learning frameworks
2. NLP fundamentals
3. Building end-to-end ML projects
4. Model deployment

**Advanced Path**
1. Advanced neural network architectures
2. Research paper implementation
3. MLOps and production systems
4. Specialized domains (CV, NLP, RL)

**Top AI Certifications**
- Deep Learning Specialization (Coursera)
- AWS Machine Learning Specialty
- Google Cloud Professional ML Engineer
- Fast.ai Practical Deep Learning

**Career Outlook**
- AI Engineer: ₹12-30 LPA
- ML Research Scientist: ₹15-40 LPA
- AI Product Manager: ₹10-25 LPA

**The Bottom Line**
AI is creating millions of new opportunities. Whether you're a developer, data scientist, or business professional, AI knowledge is becoming essential.

Start learning AI today. The future is here!`,
    author: 'Anjali Nair',
    date: '2024-12-15',
    category: 'AI',
    readTime: '11 min read',
    image: '🤖',
  },
];
