/**
 * TrainerMentors Mock API Server
 * Node.js Express server for local testing
 * Mimics PHP backend API with 139 Complete Course Catalog
 */

const fs = require('fs');

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

// Import all courses from Excel catalog
const ALL_COURSES = require('./courses_data.js');
const CORPORATE_COHORT_SOURCE = require('./notion_courses_extracted.json');
console.log(`[STARTUP] Loaded ALL_COURSES with ${ALL_COURSES.length} courses`);
if (ALL_COURSES.length > 0) {
  console.log(`[STARTUP] First course: ${ALL_COURSES[0].title}`);
  console.log(`[STARTUP] Last course: ${ALL_COURSES[ALL_COURSES.length-1].title}`);
}

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock Data Storage (in-memory)
const mockDB = {
  users: [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@trainermentors.com',
      phone: '+91-1234567890',
      role: 'admin',
      profile_image: null,
      bio: 'Platform administrator',
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 2,
      name: 'John Mentor',
      email: 'john@example.com',
      phone: '+91-9876543210',
      role: 'mentor',
      profile_image: null,
      bio: 'Senior web developer',
      created_at: '2024-01-05T00:00:00Z'
    }
  ],
  courses: ALL_COURSES,
  categories: [
    { id: 1, name: 'Corporate Courses', slug: 'corporate' },
    { id: 2, name: 'Technical Courses', slug: 'technical' },
    { id: 3, name: 'Non-Technical Courses', slug: 'non-technical' },
    { id: 4, name: 'Certificate Courses', slug: 'certificate' }
  ]
};

// JWT Secret
const JWT_SECRET = 'your_local_jwt_secret_key';

const CORPORATE_CATEGORY_ID = 1;

function slugifyCourseTitle(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function loadBaseCourses() {
  const coursesJson = fs.readFileSync('./courses_data.js', 'utf8');
  const coursesCode = coursesJson.replace('const ALL_COURSES = ', '').replace(/;[\s\n]*module\.exports.*/, '');
  return JSON.parse(coursesCode);
}

function buildCorporateCohortCourses(baseMaxId) {
  return CORPORATE_COHORT_SOURCE.map((row, index) => {
    const title = row['Name of Cohort'];
    const categoryName = row.Category;
    const syllabusUrl = row.Syllabus;
    const slug = slugifyCourseTitle(title);

    return {
      id: baseMaxId + index + 1,
      title,
      slug,
      category_id: CORPORATE_CATEGORY_ID,
      category_name: categoryName,
      main_category: 'corporate',
      price: 22000,
      currency: 'INR',
      duration: '4-8 weeks',
      level: 'all-levels',
      modes: ['Online', 'Corporate'],
      mode: 'corporate',
      rating: 4.7,
      review_count: 120 + (index % 40),
      mentor_name: 'TrainerMentors Corporate Faculty',
      mentor_expertise: categoryName,
      description: `${title} corporate training cohort in ${categoryName}. Includes instructor-led sessions, practical exercises, team enablement, and a structured syllabus.`,
      features: [
        'Instructor-led corporate sessions',
        'Practical QA and enterprise use cases',
        'Flexible scheduling for teams',
        'Completion certificate',
        'Syllabus reference included'
      ],
      modules: [
        {
          id: `${slug}-1`,
          title: `Module 1: ${title} Foundations`,
          topics: ['Program introduction', 'Core concepts', 'Business context'],
          duration_hours: 6,
          order: 1
        },
        {
          id: `${slug}-2`,
          title: 'Module 2: Applied Learning',
          topics: ['Hands-on practice', 'Guided exercises', 'Real-world scenarios'],
          duration_hours: 8,
          order: 2
        },
        {
          id: `${slug}-3`,
          title: 'Module 3: Team Adoption',
          topics: ['Implementation strategy', 'Team workflows', 'Best practices'],
          duration_hours: 6,
          order: 3
        }
      ],
      certification: 'Corporate Completion Certificate',
      batch_options: 'Corporate Team Batch / Private Cohort',
      locations: 'Online / Corporate Delivery',
      url: `https://trainermentors.com/course/${slug}`,
      thumbnail: `https://via.placeholder.com/400x250?text=${encodeURIComponent(title).slice(0, 60)}`,
      is_featured: false,
      syllabus_url: syllabusUrl
    };
  });
}

function getAllCoursesCatalog() {
  const baseCourses = loadBaseCourses();
  const maxBaseId = baseCourses.reduce((maxId, course) => Math.max(maxId, Number(course.id) || 0), 0);
  return baseCourses.concat(buildCorporateCohortCourses(maxBaseId));
}

// ===== UTILITIES =====
function generateToken(userId) {
  return jwt.sign({ user_id: userId }, JWT_SECRET, { expiresIn: '1h' });
}

function generateRefreshToken(userId) {
  return jwt.sign({ user_id: userId, type: 'refresh' }, JWT_SECRET, { expiresIn: '7d' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const token = authHeader.replace('Bearer ', '');
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }

  req.user = mockDB.users.find(u => u.id === payload.user_id);
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'User not found' });
  }

  next();
}

// ===== AUTH ENDPOINTS =====

// Register
app.post('/api/register', (req, res) => {
  const { first_name, last_name, email, password, password_confirm, phone } = req.body;
  const errors = {};

  // Validate first_name
  if (!first_name) {
    errors.first_name = 'First name is required';
  } else if (first_name.length < 2) {
    errors.first_name = 'First name must be at least 2 characters';
  }

  // Validate last_name
  if (!last_name) {
    errors.last_name = 'Last name is required';
  } else if (last_name.length < 1) {
    errors.last_name = 'Last name is required';
  }

  // Validate email
  if (!email) {
    errors.email = 'Email is required';
  } else if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.email = 'Please enter a valid email address';
  }

  // Validate phone
  if (!phone) {
    errors.phone = 'Phone number is required';
  } else if (phone.length < 10 || phone.length > 15) {
    errors.phone = 'Phone number must be between 10 and 15 characters';
  }

  // Validate password
  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  // Validate password confirmation
  if (!password_confirm) {
    errors.password_confirm = 'Please confirm your password';
  } else if (password && password !== password_confirm) {
    errors.password_confirm = 'Passwords do not match';
  }

  // Return errors if any validation failed
  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }

  // Check if user exists
  if (mockDB.users.find(u => u.email === email)) {
    return res.status(422).json({
      success: false,
      message: 'Registration failed',
      errors: { email: 'Email already registered' }
    });
  }

  // Create new user
  const fullName = `${first_name} ${last_name}`;
  const newUser = {
    id: Math.max(...mockDB.users.map(u => u.id), 0) + 1,
    name: fullName,
    email,
    phone,
    role: 'student',
    profile_image: null,
    bio: '',
    created_at: new Date().toISOString()
  };

  mockDB.users.push(newUser);

  const accessToken = generateToken(newUser.id);
  const refreshToken = generateRefreshToken(newUser.id);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role
      },
      accessToken,
      refreshToken
    }
  });
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: { message: 'Email and password required' }
    });
  }

  // Mock authentication (any password works for demo)
  const user = mockDB.users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  const accessToken = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      accessToken,
      refreshToken
    }
  });
});

// Get current user
app.get('/api/me', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'User retrieved successfully',
    data: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role
    }
  });
});

// Refresh token
app.post('/api/refresh', (req, res) => {
  const { refreshToken } = req.body;
  const payload = verifyToken(refreshToken);
  
  if (!payload || payload.type !== 'refresh') {
    return res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }

  const newAccessToken = generateToken(payload.user_id);
  res.json({
    success: true,
    data: { accessToken: newAccessToken }
  });
});

// ===== COURSE ENDPOINTS =====

// Get featured courses
app.get('/api/courses/featured', (req, res) => {
  const allCourses = getAllCoursesCatalog();
  const featured = allCourses.filter(c => c.is_featured).slice(0, 8);
  res.json({
    success: true,
    message: 'Featured courses retrieved successfully',
    data: featured.length > 0 ? featured : allCourses.slice(0, 8)
  });
});

// Get all courses
app.get('/api/courses', (req, res) => {
  console.log('[DEBUG] /api/courses endpoint CALLED');
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 12;
  const search = req.query.search || '';
  const categoryId = req.query.category_id || '';
  const category = req.query.category || ''; // Category slug from filter (design, it, non-it)
  const mainCategory = req.query.main_category || ''; // From URL param like /courses/it
  const level = req.query.level || '';
  const mode = req.query.mode || '';

  // Log all parameters received
  console.log(`[PARAMS] search="${search}", category="${category}", mainCategory="${mainCategory}", level="${level}", mode="${mode}", categoryId="${categoryId}"`);
  
  // Read courses directly from file to bypass cache
  try {
    const allCourses = getAllCoursesCatalog();
    
    console.log(`[DEBUG] /api/courses - Loaded ${allCourses.length} courses from file`);
    
    let filtered = allCourses;
    
    // Filter by search
    if (search) {
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase()) ||
        (c.category_name && c.category_name.toLowerCase().includes(search.toLowerCase()))
      );
      console.log(`[FILTER] After search: ${filtered.length} courses`);
    }

    // Filter by category slug - direct main_category match
    if (category) {
      if (category.toLowerCase() === 'certificate') {
        // Certificate category: filter by certification field
        filtered = filtered.filter(c => c.certification);
        console.log(`[FILTER] After certificate filter: ${filtered.length} courses`);
      } else {
        filtered = filtered.filter(c => c.main_category === category.toLowerCase());
        console.log(`[FILTER] After category filter (${category}): ${filtered.length} courses`);
      }
    }
    // Filter by main_category from URL params
    else if (mainCategory) {
      filtered = filtered.filter(c => c.main_category === mainCategory.toLowerCase());
      console.log(`[FILTER] After mainCategory filter (${mainCategory}): ${filtered.length} courses`);
    }
    // Filter by specific category_id
    else if (categoryId) {
      filtered = filtered.filter(c => c.category_id === parseInt(categoryId));
      console.log(`[FILTER] After categoryId filter (${categoryId}): ${filtered.length} courses`);
    }

    // Filter by level
    if (level) {
      filtered = filtered.filter(c => c.level === level.toLowerCase());
      console.log(`[FILTER] After level filter (${level}): ${filtered.length} courses`);
    }

    // Filter by mode - check if mode is in the modes array
    if (mode) {
      filtered = filtered.filter(c => {
        const courseModes = c.modes || [c.mode || 'hybrid'];
        return courseModes.map(m => m.toLowerCase()).includes(mode.toLowerCase());
      });
      console.log(`[FILTER] After mode filter (${mode}): ${filtered.length} courses`);
    }

    // Filter by sub-category
    const subCategory = req.query.sub_category || '';
    if (subCategory) {
      filtered = filtered.filter(c => 
        c.category_name && c.category_name.toLowerCase() === subCategory.toLowerCase()
      );
      console.log(`[FILTER] After sub_category filter (${subCategory}): ${filtered.length} courses`);
    }

    // Pagination
    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    console.log(`[DEBUG] /api/courses - Returning total: ${total}, page ${page}, data length: ${data.length}`);

    res.json({
      success: true,
      message: 'Courses retrieved successfully',
      data,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        hasNextPage: page < Math.ceil(total / pageSize),
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    console.error('[ERROR] /api/courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error loading courses',
      error: error.message
    });
  }
});

// Get categories
app.get('/api/categories', (req, res) => {
  // Calculate course counts dynamically
  const categoriesWithCounts = mockDB.categories.map(cat => {
    let count;
    if (cat.slug === 'certificate') {
      // Certificate category: all courses with certification
      count = getAllCoursesCatalog().filter(c => c.certification).length;
    } else {
      // Other categories: filter by main_category
      count = getAllCoursesCatalog().filter(c => c.main_category === cat.slug).length;
    }
    return { ...cat, course_count: count };
  });
  res.json({
    success: true,
    message: 'Categories retrieved successfully',
    data: categoriesWithCounts
  });
});

// Get filter options (levels, modes)
app.get('/api/filters', (req, res) => {
  try {
    const allCourses = getAllCoursesCatalog();
    
    // Extract unique levels
    const levels = [...new Set(allCourses.map(c => c.level))].filter(Boolean).sort();
    
    // Extract unique modes
    const modesSet = new Set();
    allCourses.forEach(c => {
      if (Array.isArray(c.modes)) {
        c.modes.forEach(mode => modesSet.add(mode));
      } else if (c.mode) {
        modesSet.add(c.mode);
      }
    });
    const modes = Array.from(modesSet).sort();
    
    // Extract unique main categories
    const mainCategories = [...new Set(allCourses.map(c => c.main_category))].filter(Boolean).sort();
    
    res.json({
      success: true,
      message: 'Filters retrieved successfully',
      data: {
        levels: levels.map(l => ({ value: l, label: l.charAt(0).toUpperCase() + l.slice(1) })),
        modes: modes.map(m => ({ value: m.toLowerCase(), label: m })),
        categories: mainCategories.map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))
      }
    });
  } catch (error) {
    console.error('[ERROR] /api/filters error:', error);
    res.status(500).json({
      success: false,
      message: 'Error loading filters',
      error: error.message
    });
  }
});


// Get course by ID or slug
app.get('/api/courses/:id', (req, res) => {
  const { id } = req.params;
  const allCourses = getAllCoursesCatalog();
  
  // Try to find by ID first (if it's a number)
  let course = null;
  if (!isNaN(id)) {
    course = allCourses.find(c => c.id === parseInt(id));
  }
  
  // If not found by ID, try by slug
  if (!course) {
    course = allCourses.find(c => c.slug === id);
  }
  
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  // Transform course for detail page compatibility
  const detailCourse = {
    ...course,
    short_description: course.description ? course.description.substring(0, 150) : '',
    duration_weeks: parseInt(course.duration) || 8,
    duration_hours: (parseInt(course.duration) || 8) * 5,
    effective_price: Math.round(course.price * 0.8),
    discount_percentage: 20,
    discount_price: Math.round(course.price * 0.8),
    enrollment_count: course.review_count ? course.review_count * 3 : 150,
    review_count: course.review_count || 50,
    category: {
      id: course.category_id,
      name: course.category_name,
      slug: course.main_category
    },
    mentor: {
      name: course.mentor_name,
      expertise: course.mentor_expertise
    },
    curriculum: course.modules ? (Array.isArray(course.modules) ? course.modules : [
      { id: '1', title: 'Module 1: Fundamentals', topics: ['Introduction', 'Core Concepts', 'Setup'], duration_hours: 8, order: 1 },
      { id: '2', title: 'Module 2: Core Skills', topics: ['Practical Applications', 'Hands-on Labs', 'Case Studies'], duration_hours: 10, order: 2 },
      { id: '3', title: 'Module 3: Advanced Topics', topics: ['Advanced Techniques', 'Industry Best Practices', 'Optimization'], duration_hours: 8, order: 3 },
      { id: '4', title: 'Module 4: Projects & Certification', topics: ['Real-World Projects', 'Portfolio Building', 'Certification Prep'], duration_hours: 6, order: 4 },
    ]) : [
      { id: '1', title: 'Module 1: Fundamentals', topics: ['Introduction', 'Core Concepts', 'Setup'], duration_hours: 8, order: 1 },
      { id: '2', title: 'Module 2: Core Skills', topics: ['Practical Applications', 'Hands-on Labs', 'Case Studies'], duration_hours: 10, order: 2 },
      { id: '3', title: 'Module 3: Advanced Topics', topics: ['Advanced Techniques', 'Industry Best Practices', 'Optimization'], duration_hours: 8, order: 3 },
      { id: '4', title: 'Module 4: Projects & Certification', topics: ['Real-World Projects', 'Portfolio Building', 'Certification Prep'], duration_hours: 6, order: 4 },
    ],
    tools_covered: course.features ? (Array.isArray(course.features) ? course.features.slice(0, 4) : []) : [],
    highlights: [
      'Expert-led training with industry professionals',
      'Real-world projects and hands-on practice',
      'Globally recognized certification',
      'Placement assistance with top companies',
      'Flexible batch timings',
      '1-Year free course repeat option'
    ],
    batches: [
      { id: 1, start_date: '2026-06-01', mode: 'Online', timing: 'Weekday (Mon-Fri)', slots_available: 15 },
      { id: 2, start_date: '2026-06-15', mode: 'Classroom', timing: 'Weekend (Sat-Sun)', slots_available: 10 },
      { id: 3, start_date: '2026-07-01', mode: 'Hybrid', timing: 'Flexible', slots_available: 20 },
    ]
  };

  res.json({
    success: true,
    message: 'Course retrieved successfully',
    data: detailCourse
  });
});

// Create course (mentor only)
app.post('/api/courses', authenticate, (req, res) => {
  if (req.user.role !== 'mentor' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Only mentors can create courses'
    });
  }

  const { title, description, category_id, price, duration_weeks, level } = req.body;

  const newCourse = {
    id: Math.max(...ALL_COURSES.map(c => c.id), 0) + 1,
    title,
    slug: title.toLowerCase().replace(/\s+/g, '-'),
    description,
    category_id: parseInt(category_id),
    mentor_id: req.user.id,
    mentor_name: req.user.name,
    mentor_email: req.user.email,
    price: parseFloat(price),
    duration_weeks: parseInt(duration_weeks),
    level,
    max_students: 50,
    current_students: 0,
    category_name: mockDB.categories.find(c => c.id === parseInt(category_id))?.name || '',
    thumbnail: 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(title),
    rating: 0,
    total_reviews: 0,
    is_active: 1,
    created_at: new Date().toISOString()
  };

  ALL_COURSES.push(newCourse);

  res.status(201).json({
    success: true,
    message: 'Course created successfully',
    data: newCourse
  });
});

// ===== ENROLLMENTS =====

// Enroll in course
app.post('/api/enrollments', authenticate, (req, res) => {
  const { course_id } = req.body;
  
  if (!course_id) {
    return res.status(422).json({
      success: false,
      message: 'Course ID is required'
    });
  }

  const course = ALL_COURSES.find(c => c.id === parseInt(course_id));
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  res.status(201).json({
    success: true,
    message: 'Enrolled in course successfully',
    data: {
      id: Math.floor(Math.random() * 1000),
      student_id: req.user.id,
      course_id: parseInt(course_id),
      status: 'active',
      progress_percentage: 0,
      enrollment_date: new Date().toISOString()
    }
  });
});

// ===== USERS =====

// Get all users (admin only)
app.get('/api/users', authenticate, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden'
    });
  }

  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 12;
  const total = mockDB.users.length;
  const start = (page - 1) * pageSize;

  res.json({
    success: true,
    message: 'Users retrieved successfully',
    data: mockDB.users.slice(start, start + pageSize),
    pagination: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    }
  });
});

// Get user by ID
app.get('/api/users/:id', (req, res) => {
  const user = mockDB.users.find(u => u.id === parseInt(req.params.id));
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({
    success: true,
    message: 'User retrieved successfully',
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      created_at: user.created_at
    }
  });
});

// ===== DEMO BOOKINGS / LEADS =====

// Book a demo
app.post('/api/leads', (req, res) => {
  const { name, email, phone, course_id, mode, timeline, message } = req.body;

  // Validate required fields
  const errors = {};
  if (!name) errors.name = 'Name is required';
  if (!email) errors.email = 'Email is required';
  if (!phone) errors.phone = 'Phone is required';
  if (!course_id) errors.course_id = 'Please select a course';
  if (!mode) errors.mode = 'Please select online or center';
  if (!timeline) errors.timeline = 'Please select your timeline';

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }

  // Create demo booking record
  const demoBooking = {
    id: Math.floor(Math.random() * 10000),
    name,
    email,
    phone,
    course_id,
    mode,
    timeline,
    message: message || '',
    status: 'pending',
    created_at: new Date().toISOString()
  };

  // Log demo booking (in real app, this would be saved to database)
  console.log('\n📧 ===== NEW DEMO BOOKING RECEIVED =====');
  console.log(`Name: ${name}`);
  console.log(`Email: ${email}`);
  console.log(`Phone: ${phone}`);
  console.log(`Course ID: ${course_id}`);
  console.log(`Mode: ${mode}`);
  console.log(`Timeline: ${timeline}`);
  if (message) console.log(`Message: ${message}`);
  console.log(`Booking ID: ${demoBooking.id}`);
  console.log(`Time: ${demoBooking.created_at}`);
  console.log('======================================\n');

  // TODO: In production, send email to admin
  // Example:
  // sendEmailToAdmin({
  //   subject: 'New Demo Booking Request',
  //   to: 'admin@trainermentors.com',
  //   templateData: demoBooking
  // });

  res.status(201).json({
    success: true,
    message: 'Demo booking request submitted successfully!',
    data: {
      id: demoBooking.id,
      status: demoBooking.status,
      message: 'Our team will contact you shortly to confirm your demo session.'
    }
  });
});

// Get all demo bookings (admin only)
app.get('/api/leads', authenticate, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Only admins can view demo bookings'
    });
  }

  res.json({
    success: true,
    message: 'Demo bookings retrieved successfully',
    data: []
  });
});

// Quick Chat Submission Endpoint
app.post('/api/quick-chat', (req, res) => {
  const { name, email, phone, requirements } = req.body;

  // Validate required fields
  const errors = {};
  if (!name) errors.name = 'Name is required';
  if (!email) errors.email = 'Email is required';
  if (!phone) errors.phone = 'Phone is required';
  if (!requirements) errors.requirements = 'Please tell us your requirements';

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }

  // Create quick chat record
  const quickChat = {
    id: Math.floor(Math.random() * 10000),
    name,
    email,
    phone,
    requirements,
    status: 'new',
    created_at: new Date().toISOString()
  };

  // Log quick chat inquiry (in real app, this would be saved to database)
  console.log('\n💬 ===== NEW QUICK CHAT INQUIRY =====');
  console.log(`Name: ${name}`);
  console.log(`Email: ${email}`);
  console.log(`Phone: ${phone}`);
  console.log(`Requirements: ${requirements}`);
  console.log(`Inquiry ID: ${quickChat.id}`);
  console.log(`Time: ${quickChat.created_at}`);
  console.log('====================================\n');

  // TODO: In production, send email to support team
  // Example:
  // sendEmailToSupport({
  //   subject: 'New Quick Chat Inquiry',
  //   to: 'support@trainermentors.com',
  //   templateData: quickChat
  // });

  res.status(201).json({
    success: true,
    message: 'Your inquiry has been received!',
    data: {
      id: quickChat.id,
      status: quickChat.status,
      message: 'Our support team will reach out to you within 2 hours.'
    }
  });
});

// ===== PAYMENT ENDPOINTS (RAZORPAY) =====

// Razorpay Configuration (Public Test Credentials)
const RAZORPAY_CONFIG = {
  KEY_ID: 'rzp_test_1Aa00000000001',
  KEY_SECRET: 'test_secret_123456789',
  MERCHANT_ID: 'TEST_MERCHANT_TRAINER'
};

// Payment orders storage (in-memory)
const paymentOrders = {};

// Create payment order
app.post('/api/payment/create-order', (req, res) => {
  const { courses, amount, email, name, phone } = req.body;

  // Validate required fields
  const errors = {};
  if (!courses || !Array.isArray(courses) || courses.length === 0) {
    errors.courses = 'At least one course is required';
  }
  if (!amount || amount <= 0) {
    errors.amount = 'Valid amount is required';
  }
  if (!email) {
    errors.email = 'Email is required';
  }
  if (!name) {
    errors.name = 'Name is required';
  }
  if (!phone) {
    errors.phone = 'Phone is required';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }

  // Create order
  const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const order = {
    order_id: orderId,
    courses: courses,
    amount: amount,
    email: email,
    name: name,
    phone: phone,
    status: 'created',
    created_at: new Date().toISOString(),
    payment_id: null,
    signature: null
  };

  // Store order
  paymentOrders[orderId] = order;

  console.log('\n💳 ===== NEW PAYMENT ORDER CREATED =====');
  console.log(`Order ID: ${orderId}`);
  console.log(`Customer: ${name} (${email})`);
  console.log(`Courses: ${courses.map(c => c.title).join(', ')}`);
  console.log(`Amount: ₹${amount}`);
  console.log(`Time: ${order.created_at}`);
  console.log('======================================\n');

  res.status(201).json({
    success: true,
    message: 'Payment order created successfully',
    data: {
      order_id: orderId,
      amount: amount,
      currency: 'INR',
      customer_email: email,
      customer_name: name,
      razorpay_key: RAZORPAY_CONFIG.KEY_ID
    }
  });
});

// Verify payment signature
app.post('/api/payment/verify-signature', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

  // Validate inputs
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(422).json({
      success: false,
      message: 'Missing payment details'
    });
  }

  // Get order from storage
  const order = paymentOrders[order_id];
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // In production, verify signature using crypto:
  // const crypto = require('crypto');
  // const expectedSignature = crypto
  //   .createHmac('sha256', RAZORPAY_CONFIG.KEY_SECRET)
  //   .update(`${razorpay_order_id}|${razorpay_payment_id}`)
  //   .digest('hex');
  // 
  // if (expectedSignature !== razorpay_signature) {
  //   return res.status(400).json({
  //     success: false,
  //     message: 'Invalid payment signature'
  //   });
  // }

  // For demo/test purposes, mark as verified
  order.status = 'verified';
  order.payment_id = razorpay_payment_id;
  order.signature = razorpay_signature;
  order.verified_at = new Date().toISOString();

  console.log('\n✅ ===== PAYMENT VERIFIED =====');
  console.log(`Order ID: ${order_id}`);
  console.log(`Payment ID: ${razorpay_payment_id}`);
  console.log(`Status: VERIFIED`);
  console.log(`Amount: ₹${order.amount}`);
  console.log(`Customer: ${order.name}`);
  console.log('==============================\n');

  res.json({
    success: true,
    message: 'Payment verified successfully',
    data: {
      order_id: order_id,
      payment_id: razorpay_payment_id,
      status: 'verified',
      amount: order.amount,
      courses: order.courses,
      enrollment_message: `Successfully enrolled in ${order.courses.length} course(s). You will receive an email shortly.`
    }
  });
});

// Get payment status
app.get('/api/payment/status/:orderId', (req, res) => {
  const { orderId } = req.params;
  const order = paymentOrders[orderId];

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  res.json({
    success: true,
    message: 'Payment status retrieved',
    data: {
      order_id: orderId,
      status: order.status,
      payment_id: order.payment_id,
      amount: order.amount,
      courses: order.courses,
      created_at: order.created_at,
      verified_at: order.verified_at
    }
  });
});

// ===== HEALTH CHECK =====

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'TrainerMentors Mock API - Local Development Server',
    version: '1.0.0',
    endpoints: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/me',
      'POST /api/auth/refresh',
      'GET /api/courses',
      'GET /api/courses/:id',
      'POST /api/courses',
      'POST /api/enrollments',
      'GET /api/users',
      'GET /api/users/:id',
      'POST /api/leads (Demo booking)',
      'GET /api/leads (Get demo bookings - admin only)',
      'POST /api/quick-chat (Quick chat inquiry)'
    ]
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n🚀 TrainerMentors Mock API Server');
  console.log(`📍 Running on: http://localhost:${PORT}`);
  console.log(`📚 Test endpoints: http://localhost:${PORT}`);
  console.log('\n✅ Ready to connect with React frontend!\n');
});
