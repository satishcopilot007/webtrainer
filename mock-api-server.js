/**
 * TrainerMentors Mock API Server
 * Node.js Express server for local testing
 * Mimics PHP backend API with 139 Complete Course Catalog
 */

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const bodyParser = require('body-parser');
const { sendDemoBookingAdminNotification } = require('./emailService');

// Load Razorpay SDK — only available when keys are configured
let Razorpay;
try { Razorpay = require('razorpay'); } catch (e) { console.warn('[WARN] razorpay package not found — payment endpoints will run in mock mode'); }

// Import all courses from Excel catalog
const ALL_COURSES = require('./courses_data.js');

function loadJsonArray(candidates) {
  for (const candidate of candidates) {
    const fullPath = path.join(__dirname, candidate);
    if (!fs.existsSync(fullPath)) continue;
    try {
      const text = fs.readFileSync(fullPath, 'utf8').replace(/^\uFEFF/, '');
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) return parsed;
    } catch (error) {
      console.warn(`[WARN] Failed parsing ${candidate}: ${error.message}`);
    }
  }
  return [];
}

const CORPORATE_COHORT_SOURCE = loadJsonArray(['notion_courses_enriched.json', 'notion_courses_extracted.json']);
const EXCEL_ENRICHED_SOURCE = loadJsonArray(['excel_syllabus_enriched.json']);
console.log(`[STARTUP] Loaded ALL_COURSES with ${ALL_COURSES.length} courses`);
if (ALL_COURSES.length > 0) {
  console.log(`[STARTUP] First course: ${ALL_COURSES[0].title}`);
  console.log(`[STARTUP] Last course: ${ALL_COURSES[ALL_COURSES.length-1].title}`);
}

const app = express();
const PORT = 8000;
const LOCAL_UPLOAD_ROOT = path.join(__dirname, '.local-uploads');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api/uploads', express.static(LOCAL_UPLOAD_ROOT, {
  dotfiles: 'deny',
  fallthrough: false,
  index: false,
  maxAge: '1h',
}));

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
      is_active: 1,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 2,
      name: 'John Mentor',
      email: 'john@example.com',
      phone: '+91-9876543210',
      role: 'mentor',
      profile_image: null,
      bio: 'Senior web developer',
      is_active: 1,
      created_at: '2024-01-05T00:00:00Z',
      updated_at: '2024-01-05T00:00:00Z'
    },
    {
      id: 3,
      name: 'Priya Student',
      email: 'priya@example.com',
      phone: '+91-9988776655',
      role: 'student',
      profile_image: null,
      bio: '',
      is_active: 1,
      created_at: '2026-07-01T09:00:00Z',
      updated_at: '2026-07-01T09:00:00Z'
    }
  ],
  courses: ALL_COURSES,
  categories: [
    { id: 1, name: 'Corporate Courses', slug: 'corporate', course_type: 'non-tech', description: 'Team and enterprise learning programs.' },
    { id: 2, name: 'Technical Courses', slug: 'technical', course_type: 'tech', description: 'Software, cloud, data, and technology training.' },
    { id: 3, name: 'Non-Technical Courses', slug: 'non-technical', course_type: 'non-tech', description: 'Business, design, and professional skills.' },
    { id: 4, name: 'Certificate Courses', slug: 'certificate', course_type: 'tech', description: 'Certification-oriented learning paths.' }
  ],
  feedback: [
    {
      id: 1,
      name: 'Ananya Rao',
      email: 'ananya@example.com',
      phone: '+91-9876500011',
      course_id: 1,
      subject: 'Helpful mentor sessions',
      message: 'The practical sessions and mentor feedback were very useful.',
      rating: 5,
      status: 'new',
      is_published: 0,
      created_at: '2026-07-18T10:30:00Z',
      updated_at: '2026-07-18T10:30:00Z'
    },
    {
      id: 2,
      name: 'Rahul Mehta',
      email: 'rahul@example.com',
      phone: '+91-9876500022',
      course_id: null,
      subject: 'Catalog suggestion',
      message: 'Please add more evening batch options.',
      rating: 4,
      status: 'reviewed',
      is_published: 1,
      created_at: '2026-07-16T15:15:00Z',
      updated_at: '2026-07-17T08:20:00Z'
    }
  ],
  founders: [],
  blogs: [],
  leads: [
    {
      id: 1,
      name: 'Karan Shah',
      email: 'karan@example.com',
      phone: '+91-9876500033',
      course_interested: 'Fashion Design Course',
      source: 'demo-booking',
      status: 'pending',
      created_at: '2026-07-18T12:00:00Z'
    }
  ],
  enrollments: [
    {
      id: 1,
      student_id: 3,
      course_id: 1,
      status: 'active',
      progress_percentage: 35,
      enrollment_date: '2026-07-10T09:30:00Z',
      completion_date: null
    }
  ],
  payments: [
    {
      id: 1,
      student_id: 3,
      course_id: 1,
      amount: 996,
      payment_method: 'UPI',
      transaction_id: 'mock_txn_seed_001',
      status: 'completed',
      created_at: '2026-07-10T09:25:00Z'
    }
  ]
};

// JWT Secret
const JWT_SECRET = 'your_local_jwt_secret_key';

const CORPORATE_CATEGORY_ID = 1;
const USD_TO_INR = 83;

function slugifyCourseTitle(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function activeFlag(value, fallback = 1) {
  if (value === false || value === 0 || value === '0') return 0;
  if (value === true || value === 1 || value === '1') return 1;
  return fallback;
}

function normalizeMockCatalog() {
  const now = new Date().toISOString();

  mockDB.categories.forEach((category, index) => {
    category.id = Number.parseInt(category.id, 10) || index + 1;
    category.name = String(category.name || `Category ${category.id}`).trim();
    category.slug = slugifyCourseTitle(category.slug || category.name);
    category.description = String(category.description || '');
    category.image = String(category.image || '');
    category.is_active = activeFlag(category.is_active, 1);
    category.created_at = category.created_at || now;
    category.updated_at = category.updated_at || category.created_at;
  });

  // Add the relational/admin fields missing from the generated catalog in place.
  // Existing catalog properties and syllabus topics are retained rather than rebuilt.
  mockDB.courses.forEach((course, index) => {
    course.id = Number.parseInt(course.id, 10) || index + 1;
    course.title = String(course.title || `Course ${course.id}`).trim();
    course.slug = slugifyCourseTitle(course.slug || course.title);
    course.description = String(course.description || 'Course details are being prepared.');
    course.category_id = Number.parseInt(course.category_id, 10) || 1;
    course.mentor_id = Number.parseInt(course.mentor_id, 10) || 2;
    course.price = Number.isFinite(Number(course.price)) ? Number(course.price) : 0;
    course.duration_weeks = Number.parseInt(course.duration_weeks, 10) || Number.parseInt(course.duration, 10) || 8;
    course.max_students = Number.parseInt(course.max_students, 10) || 50;
    course.is_active = activeFlag(course.is_active, 1);
    course.created_at = course.created_at || now;
    course.updated_at = course.updated_at || course.created_at;
    if (!Array.isArray(course.modules)) course.modules = [];
  });
}

normalizeMockCatalog();

function loadBaseCourses() {
  const coursesJson = fs.readFileSync('./courses_data.js', 'utf8');
  const coursesCode = coursesJson.replace('const ALL_COURSES = ', '').replace(/;[\s\n]*module\.exports.*/, '');
  return JSON.parse(coursesCode);
}

function parseHours(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function titleKey(value) {
  return slugifyCourseTitle(value);
}

const STOP_WORDS = new Set([
  'course', 'courses', 'training', 'program', 'programme', 'bootcamp', 'workshop', 'masterclass',
  'mastering', 'learn', 'learning', 'for', 'and', 'the', 'to', 'with', 'in', 'of', 'an', 'a',
  'certification', 'certifications', 'essentials', 'fundamentals'
]);

function tokenizeTitle(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 1 && !STOP_WORDS.has(part));
}

function similarityScore(course, excelRow) {
  const aTokens = tokenizeTitle(course.title);
  const bTokens = tokenizeTitle(excelRow.course_name);

  if (aTokens.length === 0 || bTokens.length === 0) return 0;

  const bSet = new Set(bTokens);
  const intersection = aTokens.filter((token) => bSet.has(token)).length;
  let score = intersection / Math.max(aTokens.length, bTokens.length);

  const aJoined = aTokens.join(' ');
  const bJoined = bTokens.join(' ');
  if (aJoined && bJoined && (aJoined.includes(bJoined) || bJoined.includes(aJoined))) {
    score += 0.1;
  }

  const courseCategory = String(course.category_name || '').toLowerCase();
  const excelCategory = String(excelRow.category || '').toLowerCase();
  if (courseCategory && excelCategory && (courseCategory.includes(excelCategory) || excelCategory.includes(courseCategory))) {
    score += 0.08;
  }

  return Math.min(score, 1);
}

const EXCEL_ENRICHED_MAP = new Map(
  EXCEL_ENRICHED_SOURCE.map((row) => [titleKey(row.course_name), row])
);

function findBestExcelRow(course) {
  // Strict mapping to avoid cross-course syllabus leakage.
  const direct = EXCEL_ENRICHED_MAP.get(titleKey(course.title));
  if (direct) return direct;

  // Safe alias-only fallbacks (exact key checks, no fuzzy scoring).
  const title = String(course.title || '').trim();
  if (!title) return null;

  const aliasCandidates = [];

  if (/\scourse$/i.test(title)) {
    const stem = title.replace(/\scourse$/i, '').trim();
    aliasCandidates.push(`${stem} Development Course`);
  }

  if (/\straining$/i.test(title)) {
    const stem = title.replace(/\straining$/i, '').trim();
    aliasCandidates.push(`${stem} Course`);
  }

  for (const aliasTitle of aliasCandidates) {
    const aliasRow = EXCEL_ENRICHED_MAP.get(titleKey(aliasTitle));
    if (aliasRow) return aliasRow;
  }

  return null;
}

function moduleHasRealTopics(module) {
  if (!module) return false;
  if (!Array.isArray(module.topics)) return false;
  return module.topics.some((topic) => String(topic || '').trim().length > 0);
}

function syllabusDepthScore(course) {
  if (!course || typeof course !== 'object') return 0;

  const modules = Array.isArray(course.modules) ? course.modules : [];
  const moduleTopicCount = modules.reduce((total, module) => {
    if (!moduleHasRealTopics(module)) return total;
    return total + module.topics.length;
  }, 0);

  const outlineCount = Array.isArray(course.syllabus_outline) ? course.syllabus_outline.length : 0;
  const tiersCount = course.duration_tiers_hours || course.price_tiers_usd ? 10 : 0;
  return moduleTopicCount + outlineCount + tiersCount;
}

function buildModulesFromExcelRow(row, slug) {
  const modules = [];
  const levels = [
    {
      key: 'basic',
      title: 'Basic Level',
      topics: Array.isArray(row.basic_syllabus) ? row.basic_syllabus : [],
      hours: parseHours(row.basic_duration_hours),
      priceUsd: parseHours(row.basic_price_usd)
    },
    {
      key: 'intermediate',
      title: 'Intermediate Level',
      topics: Array.isArray(row.intermediate_syllabus) ? row.intermediate_syllabus : [],
      hours: parseHours(row.intermediate_duration_hours),
      priceUsd: parseHours(row.intermediate_price_usd)
    },
    {
      key: 'advanced',
      title: 'Advanced Level',
      topics: Array.isArray(row.advanced_syllabus) ? row.advanced_syllabus : [],
      hours: parseHours(row.advanced_duration_hours),
      priceUsd: parseHours(row.advanced_price_usd)
    }
  ];

  levels.forEach((level, idx) => {
    if (!level.topics.length) return;
    modules.push({
      id: `${slug}-${level.key}-${idx + 1}`,
      title: `${level.title} Syllabus`,
      topics: level.topics,
      duration_hours: level.hours || 6,
      order: idx + 1,
      level: level.key,
      price_usd: level.priceUsd || null,
      price_inr: level.priceUsd ? Math.round(level.priceUsd * USD_TO_INR) : null
    });
  });

  return modules;
}

function applyExcelEnrichment(course) {
  const row = findBestExcelRow(course);
  if (!row) return course;

  const modulesFromExcel = buildModulesFromExcelRow(row, course.slug || titleKey(course.title));
  const allTopics = modulesFromExcel.flatMap((m) => m.topics).filter(Boolean);

  const suggestedPriceInr = row.basic_price_usd
    ? Math.round(Number(row.basic_price_usd) * USD_TO_INR)
    : 0;

  const price = Number(course.price) > 0
    ? Number(course.price)
    : (suggestedPriceInr > 0 ? suggestedPriceInr : 0);

  const durationParts = [
    parseHours(row.basic_duration_hours),
    parseHours(row.intermediate_duration_hours),
    parseHours(row.advanced_duration_hours)
  ].filter(Boolean);

  const duration = durationParts.length > 0
    ? `${Math.min(...durationParts)}-${Math.max(...durationParts)} hours`
    : course.duration;

  return {
    ...course,
    price,
    duration,
    modules: modulesFromExcel.length > 0 ? modulesFromExcel : course.modules,
    syllabus_outline: allTopics.slice(0, 60),
    syllabus_source: row.syllabus_source || course.syllabus_source,
    price_tiers_usd: {
      basic: parseHours(row.basic_price_usd),
      intermediate: parseHours(row.intermediate_price_usd),
      advanced: parseHours(row.advanced_price_usd)
    },
    duration_tiers_hours: {
      basic: parseHours(row.basic_duration_hours),
      intermediate: parseHours(row.intermediate_duration_hours),
      advanced: parseHours(row.advanced_duration_hours)
    }
  };
}

function buildExcelStandaloneCourses(existingCourses) {
  const seen = new Set(existingCourses.map((course) => titleKey(course.title)));
  const maxId = existingCourses.reduce((max, c) => Math.max(max, Number(c.id) || 0), 0);
  let nextId = maxId + 1;
  const extra = [];

  for (const row of EXCEL_ENRICHED_SOURCE) {
    const name = String(row.course_name || '').trim();
    if (!name) continue;
    const key = titleKey(name);
    if (seen.has(key)) continue;

    const slug = slugifyCourseTitle(name);
    const modules = buildModulesFromExcelRow(row, slug);
    const allTopics = modules.flatMap((m) => m.topics).filter(Boolean);

    const priceInr = row.basic_price_usd ? Math.round(Number(row.basic_price_usd) * USD_TO_INR) : 0;
    const durationParts = [
      parseHours(row.basic_duration_hours),
      parseHours(row.intermediate_duration_hours),
      parseHours(row.advanced_duration_hours)
    ].filter(Boolean);

    extra.push({
      id: nextId++,
      title: name,
      slug,
      category_id: 0,
      category_name: row.category || 'General',
      main_category: String(row.main_category || 'technical').toLowerCase(),
      price: priceInr,
      currency: 'INR',
      duration: durationParts.length > 0
        ? `${Math.min(...durationParts)}-${Math.max(...durationParts)} hours`
        : 'Flexible',
      level: 'all-levels',
      modes: ['Online', 'Hybrid'],
      mode: 'online',
      rating: 4.6,
      review_count: 80,
      mentor_name: 'TrainerMentors Faculty',
      mentor_expertise: row.category || 'General',
      description: allTopics.slice(0, 3).join(' | ') || `${name} - syllabus available in detail page`,
      features: ['Instructor-led sessions', 'Hands-on learning', 'Interview prep', 'Certificate support'],
      modules,
      certification: 'Completion Certificate',
      batch_options: 'Weekend / Weekday',
      locations: 'Online / Hybrid',
      url: `https://trainermentors.com/course/${slug}`,
      thumbnail: `https://via.placeholder.com/400x250?text=${encodeURIComponent(name).slice(0, 60)}`,
      is_featured: false,
      syllabus_outline: allTopics.slice(0, 60),
      syllabus_source: row.syllabus_source || 'excel_syllabus_enriched.json',
      price_tiers_usd: {
        basic: parseHours(row.basic_price_usd),
        intermediate: parseHours(row.intermediate_price_usd),
        advanced: parseHours(row.advanced_price_usd)
      },
      duration_tiers_hours: {
        basic: parseHours(row.basic_duration_hours),
        intermediate: parseHours(row.intermediate_duration_hours),
        advanced: parseHours(row.advanced_duration_hours)
      },
      pricing_note: priceInr > 0 ? null : 'Contact for price or drop email to contact@trainermentors.com'
    });
  }

  return extra;
}

function buildModulesFromSyllabus(syllabusOutline, slug) {
  const topics = (Array.isArray(syllabusOutline) ? syllabusOutline : [])
    .map((item) => String(item || '').trim())
    .filter((item) => item.length > 0);

  if (topics.length === 0) {
    return [
      {
        id: `${slug}-1`,
        title: 'Module 1: Foundations',
        topics: ['Introduction', 'Core concepts', 'Real-world applications'],
        duration_hours: 6,
        order: 1
      }
    ];
  }

  const modules = [];
  const chunkSize = 6;

  for (let i = 0; i < topics.length; i += chunkSize) {
    const chunk = topics.slice(i, i + chunkSize);
    modules.push({
      id: `${slug}-${modules.length + 1}`,
      title: `Module ${modules.length + 1}`,
      topics: chunk,
      duration_hours: 6,
      order: modules.length + 1
    });
  }

  return modules;
}

function normalizeTopicsList(topics, moduleTitle = 'Module') {
  if (Array.isArray(topics)) {
    const cleaned = topics
      .map((item) => String(item || '').trim())
      .filter((item) => item.length > 0);
    if (cleaned.length > 0) return cleaned;
  }

  const numericTopics = Number(topics);
  if (Number.isFinite(numericTopics) && numericTopics > 0) {
    return Array.from({ length: numericTopics }, (_, idx) => `${moduleTitle} - Topic ${idx + 1}`);
  }

  return [];
}

function normalizeCurriculumModules(modules) {
  const moduleList = Array.isArray(modules) ? modules : [];
  return moduleList.map((module, index) => {
    const title = String(module?.title || `Module ${index + 1}`).trim();
    const normalizedTopics = normalizeTopicsList(module?.topics, title);
    return {
      ...module,
      title,
      topics: normalizedTopics,
      duration_hours: module?.duration_hours || 6,
      order: module?.order || index + 1
    };
  });
}

function buildCorporateCohortCourses(baseMaxId) {
  return CORPORATE_COHORT_SOURCE.map((row, index) => {
    const title = row.name;
    const categoryName = row.category;
    const syllabusUrl = row.syllabus_url;
    const syllabusOutline = Array.isArray(row.syllabus_outline) ? row.syllabus_outline : [];
    const extractedLevel = String(row.level_label || '').trim();
    const normalizedLevel = extractedLevel
      ? extractedLevel.split(',')[0].trim().toLowerCase()
      : 'not_specified';
    const parsedPrice = Number(row.price);
    const hasPrice = Number.isFinite(parsedPrice) && parsedPrice > 0;
    const effectivePrice = hasPrice ? parsedPrice : 0;
    const slug = slugifyCourseTitle(title);

    return {
      id: baseMaxId + index + 1,
      title,
      slug,
      category_id: CORPORATE_CATEGORY_ID,
      category_name: categoryName,
      main_category: 'corporate',
      price: effectivePrice,
      currency: 'INR',
      duration: '4-8 weeks',
      level: normalizedLevel,
      level_label: extractedLevel || 'not_specified',
      modes: ['Online', 'Corporate'],
      mode: 'corporate',
      rating: 4.7,
      review_count: 120 + (index % 40),
      mentor_name: 'TrainerMentors Corporate Faculty',
      mentor_expertise: categoryName,
      description: syllabusOutline.length > 0
        ? syllabusOutline.slice(0, 3).join(' | ')
        : `${title} corporate training cohort in ${categoryName}.`,
      pricing_note: hasPrice
        ? null
        : (row.pricing_note || 'Contact for price or drop email to contact@trainermentors.com'),
      features: [
        'Instructor-led corporate sessions',
        'Practical QA and enterprise use cases',
        'Flexible scheduling for teams',
        'Completion certificate',
        'Syllabus reference included'
      ],
      modules: buildModulesFromSyllabus(syllabusOutline, slug),
      certification: 'Corporate Completion Certificate',
      batch_options: 'Corporate Team Batch / Private Cohort',
      locations: 'Online / Corporate Delivery',
      url: `https://trainermentors.com/course/${slug}`,
      thumbnail: `https://via.placeholder.com/400x250?text=${encodeURIComponent(title).slice(0, 60)}`,
      is_featured: false,
      syllabus_url: syllabusUrl,
      syllabus_outline: syllabusOutline
    };
  });
}

function getAllCoursesCatalog() {
  // courses_data.js is now generated directly from enriched_courses_with_syllabus.xlsx
  // It already contains correct syllabus, price, and duration for every course.
  // No enrichment or standalone building needed.
  return ALL_COURSES;
}

// ===== UTILITIES =====
function generateToken(userId) {
  return jwt.sign({ user_id: userId }, JWT_SECRET, { expiresIn: '1h' });
}

function generateRefreshToken(userId) {
  return jwt.sign({ user_id: userId, type: 'refresh' }, JWT_SECRET, { expiresIn: '7d' });
}

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

function requireAdmin(req, res, next) {
  authenticate(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Administrator access required',
        errors: null,
        timestamp: new Date().toISOString()
      });
    }
    next();
  });
}

function adminSuccess(res, data = null, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
}

function adminError(res, message, errors = null, statusCode = 400) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString()
  });
}

function adminPageParams(req) {
  const requestedPage = Number.parseInt(req.query.page, 10);
  const requestedPageSize = Number.parseInt(req.query.pageSize, 10);
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const pageSize = Number.isInteger(requestedPageSize) && requestedPageSize > 0
    ? Math.min(requestedPageSize, 100)
    : 20;
  return { page, pageSize, start: (page - 1) * pageSize };
}

function adminPaginated(res, rows, total, page, pageSize, message = 'Success') {
  const totalPages = Math.ceil(total / pageSize);
  return res.json({
    success: true,
    message,
    data: rows,
    pagination: {
      total,
      page,
      pageSize,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    },
    timestamp: new Date().toISOString()
  });
}

function positiveId(value) {
  if (!/^\d+$/.test(String(value || ''))) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function nextId(rows) {
  return rows.reduce((max, row) => Math.max(max, positiveId(row.id) || 0), 0) + 1;
}

function cleanText(value, maxLength, required = false) {
  if (value === null || value === undefined) return required ? null : '';
  const cleaned = String(value).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
  if ((required && !cleaned) || cleaned.length > maxLength) return null;
  return cleaned;
}

function validEmail(value) {
  const email = String(value || '').trim().toLowerCase();
  return email.length <= 255 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

function requestedActiveFlag(value, fallback) {
  if (value === undefined || value === null) return { valid: true, value: fallback };
  if (value === true || value === 1 || value === '1') return { valid: true, value: 1 };
  if (value === false || value === 0 || value === '0') return { valid: true, value: 0 };
  return { valid: false, value: fallback };
}

function includesSearch(values, search) {
  if (!search) return true;
  const needle = search.toLowerCase();
  return values.some((value) => String(value ?? '').toLowerCase().includes(needle));
}

function parseStatusFilter(req, allowed) {
  const status = String(req.query.status || 'all').toLowerCase();
  return allowed.includes(status) ? status : null;
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

function loginHandler(req, res) {
  const { email, password } = req.body || {};

  if (!email || typeof password !== 'string' || password.length === 0) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: { message: 'Email and password required' }
    });
  }

  // LOCAL MOCK ONLY: any non-empty password is accepted. Production authentication
  // must always verify the stored password hash and must never copy this behavior.
  const normalizedEmail = String(email).trim().toLowerCase();
  const user = mockDB.users.find(u => u.email.toLowerCase() === normalizedEmail);
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
}

// Modern auth paths are exact aliases of the legacy local mock paths.
app.post(['/api/login', '/api/auth/login'], loginHandler);

app.post(['/api/google-auth', '/api/auth/google'], async (req, res) => {
  const credential = String(req.body?.credential || '').trim();
  const clientId = String(process.env.GOOGLE_CLIENT_ID || '').trim();
  if (!clientId) {
    return res.status(503).json({ success: false, message: 'Google sign-in is not configured' });
  }
  if (!credential) {
    return res.status(422).json({ success: false, message: 'Google credential is required' });
  }

  try {
    const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: clientId });
    const payload = ticket.getPayload();
    if (!payload?.email_verified || !payload.email) {
      return res.status(401).json({ success: false, message: 'Google email is not verified' });
    }

    const email = payload.email.trim().toLowerCase();
    let user = mockDB.users.find((item) => item.email.toLowerCase() === email);
    if (!user) {
      user = {
        id: Math.max(...mockDB.users.map((item) => item.id), 0) + 1,
        name: payload.name || 'Google User',
        email,
        phone: '',
        role: 'student',
        profile_image: payload.picture || null,
        bio: '',
        created_at: new Date().toISOString()
      };
      mockDB.users.push(user);
    }

    return res.json({
      success: true,
      message: 'Google authentication successful',
      data: {
        user,
        accessToken: generateToken(user.id),
        refreshToken: generateRefreshToken(user.id)
      }
    });
  } catch (error) {
    console.warn(`[AUTH] Google credential rejected: ${error.message}`);
    return res.status(401).json({ success: false, message: 'Invalid or expired Google credential' });
  }
});

function currentUserHandler(req, res) {
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
}

app.get(['/api/me', '/api/auth/me'], authenticate, currentUserHandler);

function refreshHandler(req, res) {
  const { refreshToken } = req.body || {};
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
}

app.post(['/api/refresh', '/api/auth/refresh'], refreshHandler);

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
  const freeTutorial = req.query.is_free_tutorial;

  // Log all parameters received
  console.log(`[PARAMS] search="${search}", category="${category}", mainCategory="${mainCategory}", level="${level}", mode="${mode}", categoryId="${categoryId}"`);
  
  // Read courses directly from file to bypass cache
  try {
    const allCourses = getAllCoursesCatalog();
    
    console.log(`[DEBUG] /api/courses - Loaded ${allCourses.length} courses from file`);
    
    let filtered = allCourses;

    if (freeTutorial !== undefined) {
      const expected = ['1', 'true'].includes(String(freeTutorial).toLowerCase()) ? 1 : 0;
      filtered = filtered.filter(course => activeFlag(course.is_free_tutorial, 0) === expected);
      console.log(`[FILTER] After free tutorial filter: ${filtered.length} courses`);
    }
    
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

// Lightweight, unpaginated options for public forms that must display every
// active course without downloading full descriptions and syllabus data.
app.get('/api/courses/options', (req, res) => {
  const courses = getAllCoursesCatalog()
    .filter(course => activeFlag(course.is_active, 1) === 1)
    .map(course => ({ id: Number(course.id), title: String(course.title || '') }))
    .filter(course => Number.isSafeInteger(course.id) && course.id > 0 && course.title)
    .sort((a, b) => a.title.localeCompare(b.title));

  return adminSuccess(res, courses, 'Course options retrieved successfully');
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

// Get active tutors for the public About page. Only public profile fields are
// returned; account email, phone, and authentication details stay private.
app.get('/api/mentors', (req, res) => {
  const mentors = mockDB.users
    .filter(user => user.role === 'mentor' && Number(user.is_active) === 1)
    .map(user => ({
      id: user.id,
      name: user.name,
      profile_image: user.profile_image || '',
      bio: user.bio || '',
      course_count: mockDB.courses.filter(course =>
        Number(course.mentor_id) === Number(user.id) && Number(course.is_active) === 1
      ).length
    }))
    .sort((a, b) => Number(b.id) - Number(a.id));

  res.json({
    success: true,
    message: 'Mentors retrieved successfully',
    data: mentors
  });
});

// Public website feedback enters the same review queue displayed by the admin
// portal. Publication is always off until an administrator approves it.
app.post('/api/feedback', (req, res) => {
  const data = req.body;
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return adminError(res, 'A JSON object is required', null, 422);
  }
  if (data.website) {
    return adminSuccess(res, null, 'Feedback received successfully', 201);
  }

  const name = cleanText(data.name, 255, true);
  const email = validEmail(data.email);
  const role = cleanText(data.role, 100, true);
  const message = cleanText(data.message, 20000, true);
  const courseId = positiveId(data.course_id);
  const rating = Number(data.rating);
  const course = courseForId(courseId);

  if (!name || name.length < 2) return adminError(res, 'Validation failed', { name: 'Enter your name' }, 422);
  if (!email) return adminError(res, 'Validation failed', { email: 'Enter a valid email address' }, 422);
  if (!role || role.length < 2) return adminError(res, 'Validation failed', { role: 'Select or enter your role' }, 422);
  if (!message || message.length < 10) return adminError(res, 'Validation failed', { message: 'Feedback must contain at least 10 characters' }, 422);
  if (!course || activeFlag(course.is_active, 1) !== 1) return adminError(res, 'Validation failed', { course_id: 'Select a valid course' }, 422);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return adminError(res, 'Validation failed', { rating: 'Select a rating from 1 to 5' }, 422);

  const recentDuplicate = mockDB.feedback.some(feedback =>
    feedback.email === email
    && feedback.message === message
    && Date.now() - new Date(feedback.created_at).getTime() < 30000
  );
  if (recentDuplicate) return adminError(res, 'This feedback was already received. Please wait before submitting it again.', null, 429);

  const now = new Date().toISOString();
  const feedback = {
    id: nextId(mockDB.feedback),
    name,
    email,
    role,
    phone: '',
    course_id: courseId,
    subject: `Feedback for ${course.title}`,
    message,
    rating,
    status: 'new',
    is_published: 0,
    created_at: now,
    updated_at: now,
  };
  mockDB.feedback.push(feedback);
  return adminSuccess(res, { id: feedback.id }, 'Thank you. Your feedback has been sent for review.', 201);
});

app.get('/api/founders', (req, res) => {
  const founders = mockDB.founders
    .filter(founder => activeFlag(founder.is_active, 1) === 1)
    .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0));
  return adminSuccess(res, founders, 'Founders retrieved successfully');
});

app.get('/api/blogs', (req, res) => {
  const blogs = mockDB.blogs
    .filter(blog => activeFlag(blog.is_published, 0) === 1)
    .sort((a, b) => String(b.published_at).localeCompare(String(a.published_at)));
  return adminSuccess(res, blogs, 'Blogs retrieved successfully');
});

app.get('/api/blogs/:slug', (req, res) => {
  const blog = mockDB.blogs.find(item => item.slug === String(req.params.slug) && activeFlag(item.is_published, 0) === 1);
  if (!blog) return adminError(res, 'Blog not found', null, 404);
  return adminSuccess(res, blog, 'Blog retrieved successfully');
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
    const slugMatches = allCourses.filter(c => c.slug === id);
    if (slugMatches.length > 0) {
      // Prefer the richest syllabus payload when duplicate slugs exist.
      course = slugMatches.sort((a, b) => syllabusDepthScore(b) - syllabusDepthScore(a))[0];
    }
  }
  
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  // Transform course for detail page compatibility
  const basePrice = Number(course.price) || 0;
  const hasValidPrice = basePrice > 0;
  const discountedPrice = hasValidPrice ? Math.round(basePrice * 0.8) : 0;

  const detailCourse = {
    ...course,
    short_description: course.description ? course.description.substring(0, 150) : '',
    duration_weeks: parseInt(course.duration) || 8,
    duration_hours: (parseInt(course.duration) || 8) * 5,
    effective_price: hasValidPrice ? discountedPrice : 0,
    discount_percentage: hasValidPrice ? 20 : 0,
    discount_price: hasValidPrice ? discountedPrice : 0,
    enrollment_count: course.review_count ? course.review_count * 3 : 150,
    review_count: course.review_count || 50,
    pricing_note: course.pricing_note || (!hasValidPrice ? 'Contact for price or drop email to contact@trainermentors.com' : null),
    category: {
      id: course.category_id,
      name: course.category_name,
      slug: course.main_category
    },
    mentor: {
      name: course.mentor_name,
      expertise: course.mentor_expertise
    },
    curriculum: course.modules ? (Array.isArray(course.modules) ? normalizeCurriculumModules(course.modules) : [
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

  const enrollment = {
    id: nextId(mockDB.enrollments),
    student_id: req.user.id,
    course_id: parseInt(course_id),
    status: 'active',
    progress_percentage: 0,
    enrollment_date: new Date().toISOString(),
    completion_date: null
  };
  mockDB.enrollments.push(enrollment);

  res.status(201).json({
    success: true,
    message: 'Enrolled in course successfully',
    data: enrollment
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
    id: nextId(mockDB.leads),
    name,
    email,
    phone,
    course_id,
    course_interested: courseForId(course_id)?.title || String(course_id),
    source: 'demo-booking',
    mode,
    timeline,
    message: message || '',
    status: 'pending',
    created_at: new Date().toISOString()
  };

  mockDB.leads.push(demoBooking);

  // The booking remains successful even if the external email provider is unavailable.
  sendDemoBookingAdminNotification(demoBooking).then((result) => {
    if (!result.success && !result.skipped) {
      console.error(`[EMAIL] Admin notification failed for booking ${demoBooking.id}: ${result.error}`);
    }
  });

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
    data: mockDB.leads
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

// Razorpay Configuration — reads from environment variables
const RAZORPAY_CONFIG = {
  KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_1Aa00000000001',
  KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',
  MERCHANT_ID: process.env.RAZORPAY_MERCHANT_ID || 'TEST_MERCHANT_TRAINER'
};

// Initialise Razorpay SDK instance when real keys are present
const razorpayClient = (Razorpay && RAZORPAY_CONFIG.KEY_SECRET)
  ? new Razorpay({ key_id: RAZORPAY_CONFIG.KEY_ID, key_secret: RAZORPAY_CONFIG.KEY_SECRET })
  : null;

if (razorpayClient) {
  console.log(`[PAYMENT] Razorpay SDK initialised (key: ${RAZORPAY_CONFIG.KEY_ID.slice(0, 12)}...)`);
} else {
  console.warn('[PAYMENT] RAZORPAY_KEY_SECRET not set — payment endpoints will run in MOCK mode (no real charges).');
}

// Payment orders storage (in-memory)
const paymentOrders = {};

// Create payment order
app.post('/api/payment/create-order', async (req, res) => {
  const { courses, amount, email, name, phone } = req.body;

  // Validate required fields
  const errors = {};
  if (!courses || !Array.isArray(courses) || courses.length === 0) errors.courses = 'At least one course is required';
  if (!amount || amount <= 0) errors.amount = 'Valid amount is required';
  if (!email) errors.email = 'Email is required';
  if (!name) errors.name = 'Name is required';
  if (!phone) errors.phone = 'Phone is required';

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ success: false, message: 'Validation failed', errors });
  }

  try {
    let orderId;
    let rzpOrderId = null;

    if (razorpayClient) {
      // ✅ REAL MODE: create order via Razorpay API
      const rzpOrder = await razorpayClient.orders.create({
        amount: Math.round(amount * 100), // paise
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`,
        notes: { customer_email: email, customer_name: name }
      });
      orderId = rzpOrder.id;   // e.g. order_XXXXXX
      rzpOrderId = rzpOrder.id;
    } else {
      // 🔶 MOCK MODE: generate local ID (no real charge)
      orderId = `mock_order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    const order = {
      order_id: orderId,
      rzp_order_id: rzpOrderId,
      courses,
      amount,
      email,
      name,
      phone,
      status: 'created',
      created_at: new Date().toISOString(),
      payment_id: null,
      signature: null
    };
    paymentOrders[orderId] = order;

    console.log('\n💳 ===== NEW PAYMENT ORDER CREATED =====');
    console.log(`Order ID: ${orderId}${razorpayClient ? ' (REAL)' : ' (MOCK)'}`);
    console.log(`Customer: ${name} (${email})`);
    console.log(`Courses: ${courses.map(c => c.title).join(', ')}`);
    console.log(`Amount: ₹${amount}`);
    console.log('======================================\n');

    res.status(201).json({
      success: true,
      message: 'Payment order created successfully',
      data: {
        order_id: orderId,
        amount,
        currency: 'INR',
        customer_email: email,
        customer_name: name,
        razorpay_key: RAZORPAY_CONFIG.KEY_ID
      }
    });
  } catch (err) {
    console.error('[PAYMENT] create-order error:', err);
    res.status(500).json({ success: false, message: 'Failed to create payment order', error: err.message });
  }
});

// Verify payment signature
app.post('/api/payment/verify-signature', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

  // Validate inputs
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(422).json({ success: false, message: 'Missing payment details' });
  }

  const order = paymentOrders[order_id];
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  // ✅ REAL HMAC signature verification (production-safe)
  if (RAZORPAY_CONFIG.KEY_SECRET) {
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_CONFIG.KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.warn('[PAYMENT] Signature mismatch — possible tamper attempt');
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } else {
    // MOCK MODE — no secret key, skip verification (dev only)
    console.warn('[PAYMENT] KEY_SECRET not set — skipping signature verification (MOCK mode)');
  }

  order.status = 'verified';
  order.payment_id = razorpay_payment_id;
  order.signature = razorpay_signature;
  order.verified_at = new Date().toISOString();

  console.log('\n✅ ===== PAYMENT VERIFIED =====');
  console.log(`Order ID: ${order_id}`);
  console.log(`Payment ID: ${razorpay_payment_id}`);
  console.log(`Amount: ₹${order.amount}`);
  console.log(`Customer: ${order.name}`);
  console.log('==============================\n');

  res.json({
    success: true,
    message: 'Payment verified successfully',
    data: {
      order_id,
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

// ===== UPI QR ENDPOINT =====

// Returns UPI payment string + metadata so the frontend can render the QR code
app.post('/api/payment/upi-qr', (req, res) => {
  const { amount, name, email, phone, note } = req.body;

  const upiId = (process.env.UPI_ID || '').trim();
  const merchantName = process.env.UPI_MERCHANT_NAME || 'TrainerMentors';
  const placeholderUpiPattern = /^(your(phone|-upi-id|-real-upi-id)|example)@/i;

  if (!upiId || placeholderUpiPattern.test(upiId)) {
    return res.status(503).json({
      success: false,
      message: 'UPI is not configured with a real recipient address on this server.'
    });
  }

  const normalizedName = String(name || '').trim().replace(/\s+/g, ' ');
  const normalizedEmail = String(email || '').trim();
  const normalizedPhone = String(phone || '').replace(/\D/g, '');

  if (normalizedName.length < 5 || !/^[\p{L}][\p{L}'-]*(?:\s+[\p{L}][\p{L}'-]*)+$/u.test(normalizedName)) {
    return res.status(422).json({ success: false, message: 'Please enter a valid full name using at least two words' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalizedEmail)) {
    return res.status(422).json({ success: false, message: 'Please enter a valid email address' });
  }

  if (!/^[6-9]\d{9}$/.test(normalizedPhone)) {
    return res.status(422).json({ success: false, message: 'Please enter a valid 10-digit Indian mobile number' });
  }

  if (!amount || amount <= 0) {
    return res.status(422).json({ success: false, message: 'Valid amount is required' });
  }

  // Standard UPI deep link — works with GPay, PhonePe, Paytm, BHIM, etc.
  const upiString = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(merchantName)}&am=${encodeURIComponent(amount.toFixed(2))}&cu=INR&tn=${encodeURIComponent(note || 'Course Payment')}`;

  res.json({
    success: true,
    data: {
      upi_id: upiId,
      merchant_name: merchantName,
      amount,
      currency: 'INR',
      upi_string: upiString
    }
  });
});

// ===== ADMIN PORTAL ENDPOINTS (LOCAL IN-MEMORY MOCK ONLY) =====

function categoryForCourse(course) {
  return mockDB.categories.find(category => Number(category.id) === Number(course.category_id));
}

function tutorForCourse(course) {
  return mockDB.users.find(user => Number(user.id) === Number(course.mentor_id) && user.role === 'mentor');
}

function courseForId(id) {
  return mockDB.courses.find(course => Number(course.id) === Number(id));
}

function tutorCounts(tutorId) {
  const assigned = mockDB.courses.filter(course => Number(course.mentor_id) === Number(tutorId));
  return {
    course_count: assigned.length,
    active_course_count: assigned.filter(course => activeFlag(course.is_active, 1) === 1).length
  };
}

function categoryCounts(categoryId) {
  const assigned = mockDB.courses.filter(course => Number(course.category_id) === Number(categoryId));
  return {
    course_count: assigned.length,
    active_course_count: assigned.filter(course => activeFlag(course.is_active, 1) === 1).length
  };
}

function adminModulesForCourse(course) {
  return (Array.isArray(course.modules) ? course.modules : []).map((module, moduleIndex) => {
    const topicLessons = Array.isArray(module.topics)
      ? module.topics.map((topic, topicIndex) => ({
          id: `${course.id}-${moduleIndex + 1}-${topicIndex + 1}`,
          title: String(topic || `Lesson ${topicIndex + 1}`),
          description: '',
          content: '',
          video_url: '',
          sequence: topicIndex + 1,
          duration_minutes: null
        }))
      : [];
    const sourceLessons = Array.isArray(module.lessons) ? module.lessons : topicLessons;
    const lessons = sourceLessons.map((lesson, lessonIndex) => ({
      id: lesson.id || `${course.id}-${moduleIndex + 1}-${lessonIndex + 1}`,
      title: String(lesson.title || `Lesson ${lessonIndex + 1}`),
      description: String(lesson.description || ''),
      content: String(lesson.content || ''),
      video_url: String(lesson.video_url || ''),
      sequence: Number.parseInt(lesson.sequence, 10) || lessonIndex + 1,
      duration_minutes: lesson.duration_minutes === null || lesson.duration_minutes === undefined
        ? null
        : Number(lesson.duration_minutes)
    }));
    return {
      id: module.id || `${course.id}-${moduleIndex + 1}`,
      title: String(module.title || `Module ${moduleIndex + 1}`),
      description: String(module.description || ''),
      sequence: Number.parseInt(module.sequence ?? module.order, 10) || moduleIndex + 1,
      lessons
    };
  });
}

let nextMockModuleId = 100000;
let nextMockLessonId = 1000000;

function validateModulesInput(value) {
  if (!Array.isArray(value)) return { error: { modules: 'Must be an array' } };
  if (value.length > 100) return { error: { modules: 'Too many syllabus modules' } };

  const modules = [];
  for (let moduleIndex = 0; moduleIndex < value.length; moduleIndex += 1) {
    const module = value[moduleIndex];
    if (!module || typeof module !== 'object' || Array.isArray(module)) {
      return { error: { modules: 'Each module must be an object' } };
    }
    const title = cleanText(module.title, 255, true);
    if (!title) return { error: { modules: `Module ${moduleIndex + 1} requires a title` } };
    const sourceLessons = module.lessons ?? [];
    if (!Array.isArray(sourceLessons) || sourceLessons.length > 200) {
      return { error: { modules: `Invalid lessons in module ${moduleIndex + 1}` } };
    }

    const lessons = [];
    for (let lessonIndex = 0; lessonIndex < sourceLessons.length; lessonIndex += 1) {
      const lesson = sourceLessons[lessonIndex];
      if (!lesson || typeof lesson !== 'object' || Array.isArray(lesson)) {
        return { error: { lessons: 'Each lesson must be an object' } };
      }
      const lessonTitle = cleanText(lesson.title, 255, true);
      if (!lessonTitle) return { error: { lessons: `Lesson ${lessonIndex + 1} in module ${moduleIndex + 1} requires a title` } };
      let duration = null;
      if (lesson.duration_minutes !== null && lesson.duration_minutes !== undefined && lesson.duration_minutes !== '') {
        duration = Number(lesson.duration_minutes);
        if (!Number.isInteger(duration) || duration < 0 || duration > 100000) {
          return { error: { duration_minutes: 'Enter a valid duration' } };
        }
      }
      const description = cleanText(lesson.description, 10000);
      const content = cleanText(lesson.content, 200000);
      const videoUrl = cleanText(lesson.video_url, 255);
      if (description === null || content === null || videoUrl === null) {
        return { error: { lessons: 'A lesson field exceeds its maximum length' } };
      }
      lessons.push({
        id: positiveId(lesson.id) || nextMockLessonId++,
        title: lessonTitle,
        description,
        content,
        video_url: videoUrl,
        sequence: Number.parseInt(lesson.sequence, 10) || lessonIndex + 1,
        duration_minutes: duration
      });
    }

    const description = cleanText(module.description, 10000);
    if (description === null) return { error: { modules: 'A module description is too long' } };
    modules.push({
      id: positiveId(module.id) || nextMockModuleId++,
      title,
      description,
      sequence: Number.parseInt(module.sequence, 10) || moduleIndex + 1,
      order: Number.parseInt(module.sequence, 10) || moduleIndex + 1,
      lessons,
      topics: lessons.map(lesson => lesson.title)
    });
  }
  return { modules };
}

function validateCourseInput(data, existing = null) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { error: { body: 'A JSON object is required' } };
  }
  const value = (field, fallback) => data[field] !== undefined
    ? data[field]
    : (existing?.[field] !== undefined ? existing[field] : fallback);
  const title = cleanText(value('title', ''), 255, true);
  const description = cleanText(value('description', ''), 100000, true);
  if (!title) return { error: { title: 'Title is required and must not exceed 255 characters' } };
  if (!description) return { error: { description: 'Description is required' } };

  const slug = slugifyCourseTitle(value('slug', '') || title);
  if (!slug || slug.length > 255) return { error: { slug: 'A valid slug is required' } };
  const slugChanged = !existing || slug !== existing.slug;
  const duplicate = slugChanged
    ? mockDB.courses.find(course => course.slug === slug && Number(course.id) !== Number(existing?.id))
    : null;
  if (duplicate) return { error: { slug: 'Must be unique' }, statusCode: 409, message: 'A record with this value already exists' };

  const categoryId = positiveId(value('category_id', 0));
  const mentorId = positiveId(value('mentor_id', 0));
  const category = mockDB.categories.find(item => item.id === categoryId);
  const tutor = mockDB.users.find(item => item.id === mentorId && item.role === 'mentor');
  const categoryUnchanged = existing && Number(existing.category_id) === categoryId;
  const tutorUnchanged = existing && Number(existing.mentor_id) === mentorId;
  if (!category || (activeFlag(category.is_active, 1) !== 1 && !categoryUnchanged)) {
    return { error: { category_id: 'Select an active category' } };
  }
  if (!tutor || (activeFlag(tutor.is_active, 1) !== 1 && !tutorUnchanged)) {
    return { error: { mentor_id: 'Select an active tutor' } };
  }

  const price = Number(value('price', 0));
  const durationWeeks = Number(value('duration_weeks', 8));
  const maxStudents = Number(value('max_students', 50));
  if (!Number.isFinite(price) || price < 0 || price > 99999999.99) return { error: { price: 'Enter a valid non-negative price' } };
  if (!Number.isInteger(durationWeeks) || durationWeeks < 1 || durationWeeks > 520) return { error: { duration_weeks: 'Must be between 1 and 520' } };
  if (!Number.isInteger(maxStudents) || maxStudents < 1 || maxStudents > 100000) return { error: { max_students: 'Must be between 1 and 100000' } };
  const isActive = requestedActiveFlag(value('is_active', true), 1);
  if (!isActive.valid) return { error: { is_active: 'Must be a boolean' } };
  const isFreeTutorial = requestedActiveFlag(value('is_free_tutorial', false), 0);
  if (!isFreeTutorial.valid) return { error: { is_free_tutorial: 'Must be a boolean' } };

  const shortFields = {
    level: [value('level', 'all-levels'), 50],
    mode: [value('mode', 'Online, Classroom, Hybrid'), 255],
    certification: [value('certification', ''), 500],
    batch_options: [value('batch_options', 'Weekday / Weekend / Flexible'), 255],
    locations: [value('locations', ''), 10000],
    thumbnail: [value('thumbnail', ''), 255]
  };
  const cleaned = {};
  for (const [field, [fieldValue, maxLength]] of Object.entries(shortFields)) {
    cleaned[field] = cleanText(fieldValue, maxLength, field === 'level');
    if (cleaned[field] === null) return { error: { [field]: 'Invalid or too long' } };
  }

  let modules;
  if (data.modules !== undefined || !existing) {
    const moduleResult = validateModulesInput(data.modules ?? []);
    if (moduleResult.error) return moduleResult;
    modules = moduleResult.modules;
  }
  return {
    course: {
      title,
      slug,
      description,
      category_id: categoryId,
      category_name: category.name,
      main_category: category.slug,
      mentor_id: mentorId,
      mentor_name: tutor.name,
      price,
      duration_weeks: durationWeeks,
      max_students: maxStudents,
      is_active: isActive.value,
      is_free_tutorial: isFreeTutorial.value,
      ...cleaned
    },
    modules
  };
}

function feedbackView(feedback) {
  return {
    ...feedback,
    course_title: feedback.course_id ? courseForId(feedback.course_id)?.title || null : null
  };
}

function validateFeedbackInput(data, existing = null) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return { error: { body: 'A JSON object is required' } };
  const value = (field, fallback) => data[field] !== undefined ? data[field] : (existing?.[field] ?? fallback);
  const name = cleanText(value('name', ''), 255, true);
  const email = validEmail(value('email', ''));
  const role = cleanText(value('role', ''), 100);
  const message = cleanText(value('message', ''), 20000, true);
  if (!name) return { error: { name: 'Name is required' } };
  if (!email) return { error: { email: 'A valid email address is required' } };
  if (!message) return { error: { message: 'Message is required' } };
  const phone = cleanText(value('phone', ''), 30);
  const subject = cleanText(value('subject', ''), 255);
  if (role === null || phone === null || subject === null) return { error: { value: 'A field exceeds its maximum length' } };
  let courseId = value('course_id', null);
  if (courseId !== null && courseId !== '') {
    courseId = positiveId(courseId);
    if (!courseId || !courseForId(courseId)) return { error: { course_id: 'Select a valid course' } };
  } else courseId = null;
  let rating = value('rating', null);
  if (rating !== null && rating !== '') {
    rating = Number(rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return { error: { rating: 'Rating must be 1 to 5' } };
  } else rating = null;
  const status = String(value('status', 'new'));
  if (!['new', 'reviewed', 'resolved'].includes(status)) return { error: { status: 'Invalid feedback status' } };
  const published = requestedActiveFlag(value('is_published', false), 0);
  if (!published.valid) return { error: { is_published: 'Must be a boolean' } };
  return { feedback: { name, email, role, phone, course_id: courseId, subject, message, rating, status, is_published: published.value } };
}

function validateFounderInput(data, existing = null) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return { error: { body: 'A JSON object is required' } };
  const value = (field, fallback) => data[field] !== undefined ? data[field] : (existing?.[field] ?? fallback);
  const founder = {
    name: cleanText(value('name', ''), 255, true),
    role: cleanText(value('role', ''), 255, true),
    expertise: cleanText(value('expertise', ''), 500),
    experience: cleanText(value('experience', ''), 100),
    location: cleanText(value('location', ''), 255),
    country: cleanText(value('country', ''), 2),
    photo_url: cleanText(value('photo_url', ''), 1000),
    linkedin_url: cleanText(value('linkedin_url', ''), 1000),
    bio: cleanText(value('bio', ''), 5000),
    quote: cleanText(value('quote', ''), 1000),
    sort_order: Number(value('sort_order', 0)),
    is_active: activeFlag(value('is_active', true), 1),
  };
  if (!founder.name) return { error: { name: 'Name is required' } };
  if (!founder.role) return { error: { role: 'Role is required' } };
  if (Object.values(founder).some(item => item === null)) return { error: { value: 'A field exceeds its maximum length' } };
  if (!Number.isInteger(founder.sort_order) || founder.sort_order < 0 || founder.sort_order > 9999) return { error: { sort_order: 'Display order must be between 0 and 9999' } };
  founder.country = founder.country.toUpperCase();
  return { founder };
}

function validateBlogInput(data, existing = null) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return { error: { body: 'A JSON object is required' } };
  const value = (field, fallback) => data[field] !== undefined ? data[field] : (existing?.[field] ?? fallback);
  const title = cleanText(value('title', ''), 255, true);
  const blog = {
    title,
    slug: slugifyCourseTitle(value('slug', '') || title),
    excerpt: cleanText(value('excerpt', ''), 1000, true),
    content: cleanText(value('content', ''), 50000),
    image_url: cleanText(value('image_url', ''), 1000),
    author: cleanText(value('author', ''), 255, true),
    category: cleanText(value('category', ''), 100, true),
    read_time: cleanText(value('read_time', ''), 50),
    source_platform: cleanText(value('source_platform', 'website'), 30, true),
    external_url: cleanText(value('external_url', ''), 1000),
    reference_url: cleanText(value('reference_url', ''), 1000),
    published_at: cleanText(value('published_at', ''), 30, true),
    is_published: activeFlag(value('is_published', true), 1),
  };
  if (!blog.title || !blog.slug) return { error: { title: 'Title is required' } };
  if (!blog.excerpt) return { error: { excerpt: 'Excerpt is required' } };
  if (!blog.author || !blog.category) return { error: { author: 'Author and category are required' } };
  if (!blog.content && !blog.external_url) return { error: { content: 'Add website content or an external post link' } };
  if (!['website', 'linkedin', 'facebook', 'instagram', 'youtube', 'other'].includes(blog.source_platform)) return { error: { source_platform: 'Invalid source platform' } };
  if (Object.values(blog).some(item => item === null)) return { error: { value: 'A field exceeds its maximum length' } };
  return { blog };
}

app.get('/api/admin/overview', requireAdmin, (req, res) => {
  const completedRevenue = mockDB.payments
    .filter(payment => payment.status === 'completed')
    .reduce((total, payment) => total + (Number(payment.amount) || 0), 0);
  const recentEnrollments = [...mockDB.enrollments]
    .sort((a, b) => String(b.enrollment_date).localeCompare(String(a.enrollment_date)))
    .slice(0, 6)
    .map(enrollment => ({
      ...enrollment,
      student_name: mockDB.users.find(user => user.id === Number(enrollment.student_id))?.name || null,
      course_title: courseForId(enrollment.course_id)?.title || null
    }));
  const recentFeedback = [...mockDB.feedback]
    .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))
    .slice(0, 6)
    .map(feedbackView);
  return adminSuccess(res, {
    stats: {
      users: mockDB.users.filter(user => activeFlag(user.is_active, 1) === 1).length,
      tutors: mockDB.users.filter(user => user.role === 'mentor' && activeFlag(user.is_active, 1) === 1).length,
      categories: mockDB.categories.filter(category => activeFlag(category.is_active, 1) === 1).length,
      courses: mockDB.courses.filter(course => activeFlag(course.is_active, 1) === 1).length,
      enrollments: mockDB.enrollments.length,
      leads: mockDB.leads.length,
      feedback: mockDB.feedback.length,
      revenue: completedRevenue
    },
    recent_enrollments: recentEnrollments,
    recent_feedback: recentFeedback
  }, 'Admin overview retrieved successfully');
});

app.get('/api/admin/tutors', requireAdmin, (req, res) => {
  const status = parseStatusFilter(req, ['all', 'active', 'inactive']);
  if (!status) return adminError(res, 'Invalid status filter', null, 422);
  const search = String(req.query.search || '').trim().slice(0, 100);
  let rows = mockDB.users.filter(user => user.role === 'mentor');
  rows = rows.filter(user => includesSearch([user.name, user.email, user.phone], search));
  if (status !== 'all') rows = rows.filter(user => activeFlag(user.is_active, 1) === (status === 'active' ? 1 : 0));
  rows = rows.map(user => ({ ...user, ...tutorCounts(user.id) }))
    .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
  const { page, pageSize, start } = adminPageParams(req);
  return adminPaginated(res, rows.slice(start, start + pageSize), rows.length, page, pageSize, 'Tutors retrieved successfully');
});

app.get('/api/admin/tutors/:id', requireAdmin, (req, res) => {
  const id = positiveId(req.params.id);
  if (!id) return adminError(res, 'Invalid record identifier', null, 422);
  const tutor = mockDB.users.find(user => user.id === id && user.role === 'mentor');
  if (!tutor) return adminError(res, 'Tutor not found', null, 404);
  return adminSuccess(res, { ...tutor, ...tutorCounts(id) }, 'Tutor retrieved successfully');
});

app.post(
  '/api/admin/tutors/profile-image',
  requireAdmin,
  express.raw({ type: ['image/jpeg', 'image/png', 'image/webp'], limit: '5mb' }),
  (req, res) => {
    if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
      return adminError(res, 'Select a JPEG, PNG, or WebP image to upload', null, 422);
    }

    const signatures = [
      { mime: 'image/jpeg', extension: 'jpg', valid: req.body.length >= 3 && req.body[0] === 0xff && req.body[1] === 0xd8 && req.body[2] === 0xff },
      { mime: 'image/png', extension: 'png', valid: req.body.length >= 8 && req.body.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
      { mime: 'image/webp', extension: 'webp', valid: req.body.length >= 12 && req.body.toString('ascii', 0, 4) === 'RIFF' && req.body.toString('ascii', 8, 12) === 'WEBP' },
    ];
    const detected = signatures.find(item => item.valid);
    if (!detected || req.get('content-type')?.split(';')[0].toLowerCase() !== detected.mime) {
      return adminError(res, 'Only valid JPEG, PNG, and WebP images are allowed', null, 422);
    }

    const directory = path.join(LOCAL_UPLOAD_ROOT, 'tutors');
    fs.mkdirSync(directory, { recursive: true });
    const fileName = `${crypto.randomBytes(16).toString('hex')}.${detected.extension}`;
    fs.writeFileSync(path.join(directory, fileName), req.body, { flag: 'wx' });
    const url = `${req.protocol}://${req.get('host')}/api/uploads/tutors/${fileName}`;
    return adminSuccess(res, { url }, 'Profile image uploaded successfully', 201);
  }
);

app.post('/api/admin/tutors', requireAdmin, (req, res) => {
  const name = cleanText(req.body?.name, 255, true);
  const email = validEmail(req.body?.email);
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!name) return adminError(res, 'Validation failed', { name: 'Name is required' }, 422);
  if (!email) return adminError(res, 'Validation failed', { email: 'A valid email address is required' }, 422);
  if (password.length < 8 || password.length > 128) return adminError(res, 'Validation failed', { password: 'Password must be 8 to 128 characters' }, 422);
  if (mockDB.users.some(user => user.email.toLowerCase() === email)) return adminError(res, 'A record with this value already exists', { email: 'Must be unique' }, 409);
  const isActive = requestedActiveFlag(req.body?.is_active, 1);
  if (!isActive.valid) return adminError(res, 'Validation failed', { is_active: 'Must be a boolean' }, 422);
  const phone = cleanText(req.body?.phone, 30);
  const bio = cleanText(req.body?.bio, 10000);
  const profileImage = cleanText(req.body?.profile_image, 255);
  if ([phone, bio, profileImage].includes(null)) return adminError(res, 'Validation failed', { value: 'A field exceeds its maximum length' }, 422);
  const now = new Date().toISOString();
  const tutor = { id: nextId(mockDB.users), name, email, phone, role: 'mentor', profile_image: profileImage, bio, is_active: isActive.value, created_at: now, updated_at: now };
  mockDB.users.push(tutor);
  return adminSuccess(res, { id: tutor.id }, 'Tutor created successfully', 201);
});

app.put('/api/admin/tutors/:id', requireAdmin, (req, res) => {
  const id = positiveId(req.params.id);
  if (!id) return adminError(res, 'Invalid record identifier', null, 422);
  const tutor = mockDB.users.find(user => user.id === id && user.role === 'mentor');
  if (!tutor) return adminError(res, 'Tutor not found', null, 404);
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body) || Object.keys(req.body).length === 0) return adminError(res, 'No fields to update', null, 422);
  const updates = {};
  if (req.body.name !== undefined) {
    updates.name = cleanText(req.body.name, 255, true);
    if (!updates.name) return adminError(res, 'Validation failed', { name: 'Name is required' }, 422);
  }
  if (req.body.email !== undefined) {
    updates.email = validEmail(req.body.email);
    if (!updates.email) return adminError(res, 'Validation failed', { email: 'A valid email address is required' }, 422);
    if (mockDB.users.some(user => user.id !== id && user.email.toLowerCase() === updates.email)) return adminError(res, 'A record with this value already exists', { email: 'Must be unique' }, 409);
  }
  for (const [field, max] of Object.entries({ phone: 30, bio: 10000, profile_image: 255 })) {
    if (req.body[field] !== undefined) {
      updates[field] = cleanText(req.body[field], max);
      if (updates[field] === null) return adminError(res, 'Validation failed', { [field]: 'Value is too long' }, 422);
    }
  }
  if (req.body.password !== undefined && req.body.password !== '' && (typeof req.body.password !== 'string' || req.body.password.length < 8 || req.body.password.length > 128)) {
    return adminError(res, 'Validation failed', { password: 'Password must be 8 to 128 characters' }, 422);
  }
  if (req.body.is_active !== undefined) {
    const flag = requestedActiveFlag(req.body.is_active, tutor.is_active);
    if (!flag.valid) return adminError(res, 'Validation failed', { is_active: 'Must be a boolean' }, 422);
    updates.is_active = flag.value;
  }
  Object.assign(tutor, updates, { updated_at: new Date().toISOString() });
  return adminSuccess(res, { id }, 'Tutor updated successfully');
});

app.delete('/api/admin/tutors/:id', requireAdmin, (req, res) => {
  const id = positiveId(req.params.id);
  if (!id) return adminError(res, 'Invalid record identifier', null, 422);
  const tutor = mockDB.users.find(user => user.id === id && user.role === 'mentor');
  if (!tutor) return adminError(res, 'Tutor not found', null, 404);
  const retained = tutorCounts(id).course_count;
  tutor.is_active = 0;
  tutor.updated_at = new Date().toISOString();
  return adminSuccess(res, { retained_course_count: retained }, 'Tutor deactivated; assigned courses were retained');
});

app.get('/api/admin/categories', requireAdmin, (req, res) => {
  const status = parseStatusFilter(req, ['all', 'active', 'inactive']);
  if (!status) return adminError(res, 'Invalid status filter', null, 422);
  const search = String(req.query.search || '').trim().slice(0, 100);
  let rows = mockDB.categories.filter(category => includesSearch([category.name, category.slug, category.description], search));
  if (status !== 'all') rows = rows.filter(category => activeFlag(category.is_active, 1) === (status === 'active' ? 1 : 0));
  rows = rows.map(category => ({ ...category, ...categoryCounts(category.id) })).sort((a, b) => a.name.localeCompare(b.name));
  const { page, pageSize, start } = adminPageParams(req);
  return adminPaginated(res, rows.slice(start, start + pageSize), rows.length, page, pageSize, 'Categories retrieved successfully');
});

app.post('/api/admin/categories', requireAdmin, (req, res) => {
  const name = cleanText(req.body?.name, 255, true);
  if (!name) return adminError(res, 'Validation failed', { name: 'Name is required' }, 422);
  const slug = slugifyCourseTitle(req.body?.slug || name);
  if (!slug || slug.length > 255) return adminError(res, 'Validation failed', { slug: 'A valid slug is required' }, 422);
  if (mockDB.categories.some(category => category.slug === slug)) return adminError(res, 'A record with this value already exists', { slug: 'Must be unique' }, 409);
  const description = cleanText(req.body?.description, 5000);
  const image = cleanText(req.body?.image, 255);
  const courseType = cleanText(req.body?.course_type || 'tech', 20, true);
  const flag = requestedActiveFlag(req.body?.is_active, 1);
  if (!['tech', 'non-tech'].includes(courseType)) return adminError(res, 'Validation failed', { course_type: 'Select technical or non-technical' }, 422);
  if (description === null || image === null || !flag.valid) return adminError(res, 'Validation failed', { value: 'Invalid category data' }, 422);
  const now = new Date().toISOString();
  const category = { id: nextId(mockDB.categories), name, slug, course_type: courseType, description, image, is_active: flag.value, created_at: now, updated_at: now };
  mockDB.categories.push(category);
  return adminSuccess(res, { id: category.id }, 'Category created successfully', 201);
});

app.put('/api/admin/categories/:id', requireAdmin, (req, res) => {
  const id = positiveId(req.params.id);
  if (!id) return adminError(res, 'Invalid record identifier', null, 422);
  const category = mockDB.categories.find(item => item.id === id);
  if (!category) return adminError(res, 'Category not found', null, 404);
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body) || Object.keys(req.body).length === 0) return adminError(res, 'No fields to update', null, 422);
  const name = req.body.name !== undefined ? cleanText(req.body.name, 255, true) : category.name;
  if (!name) return adminError(res, 'Validation failed', { name: 'Name is required' }, 422);
  const slug = req.body.slug !== undefined ? slugifyCourseTitle(req.body.slug || name) : category.slug;
  if (!slug || mockDB.categories.some(item => item.id !== id && item.slug === slug)) return adminError(res, 'A record with this value already exists', { slug: 'Must be unique' }, 409);
  const description = req.body.description !== undefined ? cleanText(req.body.description, 5000) : category.description;
  const image = req.body.image !== undefined ? cleanText(req.body.image, 255) : category.image;
  const courseType = req.body.course_type !== undefined ? cleanText(req.body.course_type, 20, true) : (category.course_type || 'tech');
  const flag = requestedActiveFlag(req.body.is_active, category.is_active);
  if (!['tech', 'non-tech'].includes(courseType)) return adminError(res, 'Validation failed', { course_type: 'Select technical or non-technical' }, 422);
  if (description === null || image === null || !flag.valid) return adminError(res, 'Validation failed', { value: 'Invalid category data' }, 422);
  Object.assign(category, { name, slug, course_type: courseType, description, image, is_active: flag.value, updated_at: new Date().toISOString() });
  return adminSuccess(res, { id }, 'Category updated successfully');
});

app.delete('/api/admin/categories/:id', requireAdmin, (req, res) => {
  const id = positiveId(req.params.id);
  if (!id) return adminError(res, 'Invalid record identifier', null, 422);
  const category = mockDB.categories.find(item => item.id === id);
  if (!category) return adminError(res, 'Category not found', null, 404);
  const retained = categoryCounts(id).course_count;
  category.is_active = 0;
  category.updated_at = new Date().toISOString();
  return adminSuccess(res, { retained_course_count: retained }, 'Category deactivated; linked courses were retained');
});

app.get('/api/admin/courses', requireAdmin, (req, res) => {
  const status = parseStatusFilter(req, ['all', 'active', 'inactive']);
  if (!status) return adminError(res, 'Invalid status filter', null, 422);
  const search = String(req.query.search || '').trim().slice(0, 100);
  const freeTutorial = String(req.query.is_free_tutorial ?? 'all');
  if (!['all', '0', '1'].includes(freeTutorial)) return adminError(res, 'Invalid free tutorial filter', null, 422);
  let courses = mockDB.courses.filter(course => {
    const category = categoryForCourse(course);
    const tutor = tutorForCourse(course);
    return includesSearch([course.title, course.slug, category?.name || course.category_name, tutor?.name || course.mentor_name], search);
  });
  if (status !== 'all') courses = courses.filter(course => activeFlag(course.is_active, 1) === (status === 'active' ? 1 : 0));
  if (freeTutorial !== 'all') courses = courses.filter(course => activeFlag(course.is_free_tutorial, 0) === Number(freeTutorial));
  const rows = courses.map(course => {
    const modules = adminModulesForCourse(course);
    return {
      id: course.id,
      title: course.title,
      slug: course.slug,
      price: course.price,
      duration_weeks: course.duration_weeks,
      level: course.level,
      mode: course.mode,
      thumbnail: course.thumbnail,
      is_active: activeFlag(course.is_active, 1),
      is_free_tutorial: activeFlag(course.is_free_tutorial, 0),
      created_at: course.created_at,
      updated_at: course.updated_at,
      category_id: course.category_id,
      mentor_id: course.mentor_id,
      category_name: categoryForCourse(course)?.name || course.category_name || null,
      mentor_name: tutorForCourse(course)?.name || course.mentor_name || null,
      module_count: modules.length,
      lesson_count: modules.reduce((total, module) => total + module.lessons.length, 0)
    };
  }).sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at)));
  const { page, pageSize, start } = adminPageParams(req);
  return adminPaginated(res, rows.slice(start, start + pageSize), rows.length, page, pageSize, 'Courses retrieved successfully');
});

app.get('/api/admin/courses/:id', requireAdmin, (req, res) => {
  const id = positiveId(req.params.id);
  if (!id) return adminError(res, 'Invalid record identifier', null, 422);
  const course = courseForId(id);
  if (!course) return adminError(res, 'Course not found', null, 404);
  return adminSuccess(res, {
    ...course,
    category_name: categoryForCourse(course)?.name || course.category_name || null,
    mentor_name: tutorForCourse(course)?.name || course.mentor_name || null,
    modules: adminModulesForCourse(course)
  }, 'Course retrieved successfully');
});

app.post('/api/admin/courses', requireAdmin, (req, res) => {
  const result = validateCourseInput(req.body);
  if (result.error) return adminError(res, result.message || 'Validation failed', result.error, result.statusCode || 422);
  const now = new Date().toISOString();
  const course = {
    id: nextId(mockDB.courses),
    ...result.course,
    currency: 'INR',
    duration: `${result.course.duration_weeks} weeks`,
    modes: result.course.mode.split(',').map(item => item.trim()).filter(Boolean),
    modules: result.modules,
    rating: 0,
    review_count: 0,
    is_featured: false,
    created_at: now,
    updated_at: now
  };
  mockDB.courses.push(course);
  return adminSuccess(res, { id: course.id }, 'Course created successfully', 201);
});

app.put('/api/admin/courses/:id', requireAdmin, (req, res) => {
  const id = positiveId(req.params.id);
  if (!id) return adminError(res, 'Invalid record identifier', null, 422);
  const existing = courseForId(id);
  if (!existing) return adminError(res, 'Course not found', null, 404);
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body) || Object.keys(req.body).length === 0) return adminError(res, 'No fields to update', null, 422);
  const result = validateCourseInput(req.body, existing);
  if (result.error) return adminError(res, result.message || 'Validation failed', result.error, result.statusCode || 422);
  Object.assign(existing, result.course, {
    duration: `${result.course.duration_weeks} weeks`,
    modes: result.course.mode.split(',').map(item => item.trim()).filter(Boolean),
    updated_at: new Date().toISOString()
  });
  if (result.modules) existing.modules = result.modules;
  return adminSuccess(res, { id }, 'Course updated successfully');
});

app.delete('/api/admin/courses/:id', requireAdmin, (req, res) => {
  const id = positiveId(req.params.id);
  if (!id) return adminError(res, 'Invalid record identifier', null, 422);
  const course = courseForId(id);
  if (!course) return adminError(res, 'Course not found', null, 404);
  course.is_active = 0;
  course.updated_at = new Date().toISOString();
  return adminSuccess(res, null, 'Course deactivated successfully');
});

app.get('/api/admin/founders', requireAdmin, (req, res) => {
  const search = String(req.query.search || '').trim();
  let rows = mockDB.founders.filter(founder => includesSearch([founder.name, founder.role, founder.expertise, founder.location], search));
  rows = [...rows].sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0));
  const { page, pageSize, start } = adminPageParams(req);
  return adminPaginated(res, rows.slice(start, start + pageSize), rows.length, page, pageSize, 'Founders retrieved successfully');
});

app.post('/api/admin/founders', requireAdmin, (req, res) => {
  const result = validateFounderInput(req.body);
  if (result.error) return adminError(res, 'Validation failed', result.error, 422);
  const now = new Date().toISOString();
  const founder = { id: nextId(mockDB.founders), ...result.founder, created_at: now, updated_at: now };
  mockDB.founders.push(founder);
  return adminSuccess(res, { id: founder.id }, 'Founder created successfully', 201);
});

app.put('/api/admin/founders/:id', requireAdmin, (req, res) => {
  const id = positiveId(req.params.id);
  const founder = mockDB.founders.find(item => item.id === id);
  if (!founder) return adminError(res, 'Founder not found', null, 404);
  const result = validateFounderInput(req.body, founder);
  if (result.error) return adminError(res, 'Validation failed', result.error, 422);
  Object.assign(founder, result.founder, { updated_at: new Date().toISOString() });
  return adminSuccess(res, { id }, 'Founder updated successfully');
});

app.delete('/api/admin/founders/:id', requireAdmin, (req, res) => {
  const id = positiveId(req.params.id);
  const index = mockDB.founders.findIndex(item => item.id === id);
  if (index === -1) return adminError(res, 'Founder not found', null, 404);
  mockDB.founders.splice(index, 1);
  return adminSuccess(res, null, 'Founder deleted successfully');
});

app.get('/api/admin/blogs', requireAdmin, (req, res) => {
  const search = String(req.query.search || '').trim();
  let rows = mockDB.blogs.filter(blog => includesSearch([blog.title, blog.category, blog.author, blog.excerpt, blog.content], search));
  rows = [...rows].sort((a, b) => String(b.published_at).localeCompare(String(a.published_at)));
  const { page, pageSize, start } = adminPageParams(req);
  return adminPaginated(res, rows.slice(start, start + pageSize), rows.length, page, pageSize, 'Blogs retrieved successfully');
});

app.post('/api/admin/blogs', requireAdmin, (req, res) => {
  const result = validateBlogInput(req.body);
  if (result.error) return adminError(res, 'Validation failed', result.error, 422);
  if (mockDB.blogs.some(item => item.slug === result.blog.slug)) return adminError(res, 'Slug already exists', { slug: 'Must be unique' }, 409);
  const now = new Date().toISOString();
  const blog = { id: nextId(mockDB.blogs), ...result.blog, created_at: now, updated_at: now };
  mockDB.blogs.push(blog);
  return adminSuccess(res, { id: blog.id }, 'Blog created successfully', 201);
});

app.put('/api/admin/blogs/:id', requireAdmin, (req, res) => {
  const id = positiveId(req.params.id);
  const blog = mockDB.blogs.find(item => item.id === id);
  if (!blog) return adminError(res, 'Blog not found', null, 404);
  const result = validateBlogInput(req.body, blog);
  if (result.error) return adminError(res, 'Validation failed', result.error, 422);
  if (mockDB.blogs.some(item => item.id !== id && item.slug === result.blog.slug)) return adminError(res, 'Slug already exists', { slug: 'Must be unique' }, 409);
  Object.assign(blog, result.blog, { updated_at: new Date().toISOString() });
  return adminSuccess(res, { id }, 'Blog updated successfully');
});

app.delete('/api/admin/blogs/:id', requireAdmin, (req, res) => {
  const id = positiveId(req.params.id);
  const index = mockDB.blogs.findIndex(item => item.id === id);
  if (index === -1) return adminError(res, 'Blog not found', null, 404);
  mockDB.blogs.splice(index, 1);
  return adminSuccess(res, null, 'Blog deleted successfully');
});

app.get('/api/admin/feedback', requireAdmin, (req, res) => {
  const status = parseStatusFilter(req, ['all', 'new', 'reviewed', 'resolved']);
  if (!status) return adminError(res, 'Invalid status filter', null, 422);
  const search = String(req.query.search || '').trim().slice(0, 100);
  let rows = mockDB.feedback.filter(feedback => includesSearch([feedback.name, feedback.email, feedback.role, feedback.subject, feedback.message], search));
  if (status !== 'all') rows = rows.filter(feedback => feedback.status === status);
  rows = rows.map(feedbackView).sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
  const { page, pageSize, start } = adminPageParams(req);
  return adminPaginated(res, rows.slice(start, start + pageSize), rows.length, page, pageSize, 'Feedback retrieved successfully');
});

app.post('/api/admin/feedback', requireAdmin, (req, res) => {
  const result = validateFeedbackInput(req.body);
  if (result.error) return adminError(res, 'Validation failed', result.error, 422);
  const now = new Date().toISOString();
  const feedback = { id: nextId(mockDB.feedback), ...result.feedback, created_at: now, updated_at: now };
  mockDB.feedback.push(feedback);
  return adminSuccess(res, { id: feedback.id }, 'Feedback created successfully', 201);
});

app.put('/api/admin/feedback/:id', requireAdmin, (req, res) => {
  const id = positiveId(req.params.id);
  if (!id) return adminError(res, 'Invalid record identifier', null, 422);
  const feedback = mockDB.feedback.find(item => item.id === id);
  if (!feedback) return adminError(res, 'Feedback not found', null, 404);
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body) || Object.keys(req.body).length === 0) return adminError(res, 'No fields to update', null, 422);
  const result = validateFeedbackInput(req.body, feedback);
  if (result.error) return adminError(res, 'Validation failed', result.error, 422);
  Object.assign(feedback, result.feedback, { updated_at: new Date().toISOString() });
  return adminSuccess(res, { id }, 'Feedback updated successfully');
});

app.delete('/api/admin/feedback/:id', requireAdmin, (req, res) => {
  const id = positiveId(req.params.id);
  if (!id) return adminError(res, 'Invalid record identifier', null, 422);
  const index = mockDB.feedback.findIndex(item => item.id === id);
  if (index === -1) return adminError(res, 'Feedback not found', null, 404);
  mockDB.feedback.splice(index, 1);
  return adminSuccess(res, null, 'Feedback deleted permanently');
});

app.get('/api/admin/records/:type', requireAdmin, (req, res) => {
  const type = req.params.type;
  if (!['users', 'leads', 'enrollments', 'payments'].includes(type)) return adminError(res, 'Unknown record type', null, 404);
  const search = String(req.query.search || '').trim().slice(0, 100);
  const status = String(req.query.status || 'all').toLowerCase();
  let rows;
  if (type === 'users') {
    rows = mockDB.users.map(user => ({ id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, is_active: activeFlag(user.is_active, 1), created_at: user.created_at }));
    rows = rows.filter(row => includesSearch([row.name, row.email, row.phone, row.role], search));
    if (status === 'active' || status === 'inactive') rows = rows.filter(row => row.is_active === (status === 'active' ? 1 : 0));
  } else if (type === 'leads') {
    rows = mockDB.leads.map(lead => ({ ...lead }));
    rows = rows.filter(row => includesSearch([row.name, row.email, row.phone, row.course_interested, row.status], search));
    if (status !== 'all') rows = rows.filter(row => String(row.status).toLowerCase() === status);
  } else if (type === 'enrollments') {
    rows = mockDB.enrollments.map(enrollment => {
      const student = mockDB.users.find(user => user.id === Number(enrollment.student_id));
      return { ...enrollment, student_name: student?.name || null, student_email: student?.email || null, course_title: courseForId(enrollment.course_id)?.title || null };
    });
    rows = rows.filter(row => includesSearch([row.student_name, row.student_email, row.course_title, row.status], search));
    if (status !== 'all') rows = rows.filter(row => String(row.status).toLowerCase() === status);
  } else {
    rows = mockDB.payments.map(payment => {
      const student = mockDB.users.find(user => user.id === Number(payment.student_id));
      return { ...payment, student_name: student?.name || null, student_email: student?.email || null, course_title: courseForId(payment.course_id)?.title || null };
    });
    rows = rows.filter(row => includesSearch([row.student_name, row.student_email, row.course_title, row.transaction_id, row.status], search));
    if (status !== 'all') rows = rows.filter(row => String(row.status).toLowerCase() === status);
  }
  const dateField = type === 'enrollments' ? 'enrollment_date' : 'created_at';
  rows.sort((a, b) => String(b[dateField]).localeCompare(String(a[dateField])));
  const { page, pageSize, start } = adminPageParams(req);
  const message = `${type.charAt(0).toUpperCase()}${type.slice(1)} retrieved successfully`;
  return adminPaginated(res, rows.slice(start, start + pageSize), rows.length, page, pageSize, message);
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
      'POST /api/register',
      'POST /api/auth/login',
      'GET /api/auth/me',
      'POST /api/auth/refresh',
      'GET /api/admin/overview',
      'CRUD /api/admin/tutors',
      'CRUD /api/admin/categories',
      'CRUD /api/admin/courses',
      'CRUD /api/admin/feedback',
      'GET /api/admin/records/:type',
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
