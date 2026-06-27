/**
 * Regenerate courses_data.js from enriched_courses_with_syllabus.xlsx
 * This makes the Excel the SINGLE SOURCE OF TRUTH for all course data:
 * - Course names, categories
 * - Syllabus (Basic / Intermediate / Advanced topics)
 * - Duration (hours per level)
 * - Price (USD per level, converted to INR)
 */

const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const ROOT = path.join(__dirname, '..');
const EXCEL_PATH = path.join(ROOT, 'enriched_courses_with_syllabus.xlsx');
const OUTPUT_PATH = path.join(ROOT, 'courses_data.js');

const USD_TO_INR = 83;
const REDUCTION_FACTOR = 0.4; // 60% reduction (keep 40%)

// Category to main_category mapping
const CATEGORY_MAP = {
  'software development': 'technical',
  'cloud & devops': 'technical',
  'data & analytics': 'technical',
  'cybersecurity': 'technical',
  'networking': 'technical',
  'database': 'technical',
  'testing & qa': 'technical',
  'ai & machine learning': 'technical',
  'web development': 'technical',
  'mobile development': 'technical',
  'design': 'non-technical',
  'hr & management': 'non-technical',
  'finance & accounting': 'non-technical',
  'marketing': 'non-technical',
  'language & soft skills': 'non-technical',
  'project management': 'non-technical',
  'business': 'non-technical',
  'sap': 'technical',
  'erp': 'technical',
  'microsoft': 'technical',
  'virtualization': 'technical',
  'engineering': 'non-technical',
  'general': 'technical',
};

function getMainCategory(category, mainCatFromExcel) {
  if (mainCatFromExcel && mainCatFromExcel !== '') {
    return mainCatFromExcel.toLowerCase();
  }
  const key = (category || '').toLowerCase().trim();
  return CATEGORY_MAP[key] || 'technical';
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseSyllabusColumn(text) {
  if (!text || typeof text !== 'string') return [];
  // Handle pipe-delimited or newline-delimited
  const delimiter = text.includes('|') ? '|' : '\n';
  return text
    .split(delimiter)
    .map(line => line.replace(/^\s*\d+\.\s*/, '').trim())
    .filter(line => line.length > 0);
}

function buildModules(name, basicTopics, intermediateTopics, advancedTopics, basicHours, intermediateHours, advancedHours) {
  const slug = slugify(name);
  const modules = [];

  if (basicTopics.length > 0) {
    modules.push({
      id: `${slug}-basic-1`,
      title: 'Basic Level Syllabus',
      topics: basicTopics,
      duration_hours: basicHours || 20,
      order: 1,
      level: 'basic'
    });
  }

  if (intermediateTopics.length > 0) {
    modules.push({
      id: `${slug}-intermediate-2`,
      title: 'Intermediate Level Syllabus',
      topics: intermediateTopics,
      duration_hours: intermediateHours || 30,
      order: 2,
      level: 'intermediate'
    });
  }

  if (advancedTopics.length > 0) {
    modules.push({
      id: `${slug}-advanced-3`,
      title: 'Advanced Level Syllabus',
      topics: advancedTopics,
      duration_hours: advancedHours || 50,
      order: 3,
      level: 'advanced'
    });
  }

  return modules;
}

// Mentors pool for variety
const MENTORS = [
  { name: 'Dr. Priya Sharma', expertise: 'Technology' },
  { name: 'Rajesh Kumar', expertise: 'Engineering' },
  { name: 'Anita Desai', expertise: 'Data Science' },
  { name: 'Vikram Singh', expertise: 'Cloud & DevOps' },
  { name: 'Meera Patel', expertise: 'Management' },
  { name: 'Suresh Rao', expertise: 'Development' },
  { name: 'Kavitha Nair', expertise: 'Design' },
  { name: 'Arjun Mehta', expertise: 'Security' },
];

function main() {
  console.log('Reading Excel:', EXCEL_PATH);
  const wb = xlsx.readFile(EXCEL_PATH);
  const ws = wb.Sheets['Enriched Course Catalog'] || wb.Sheets[wb.SheetNames[0]];
  const allRows = xlsx.utils.sheet_to_json(ws, { header: 1, defval: '' });

  // Skip header row (row 0 = column headers)
  const dataRows = allRows.slice(1);
  console.log(`Total data rows: ${dataRows.length}`);

  const courses = [];

  for (const row of dataRows) {
    const id = row[0];
    const name = String(row[1] || '').trim();
    if (!name) continue;

    const category = String(row[2] || '').trim();
    const mainCategoryRaw = String(row[3] || '').trim();
    const mainCategory = getMainCategory(category, mainCategoryRaw);

    // Syllabus topics (columns 5, 8, 11)
    const basicTopics = parseSyllabusColumn(row[5]);
    const intermediateTopics = parseSyllabusColumn(row[8]);
    const advancedTopics = parseSyllabusColumn(row[11]);

    // Duration (hours) - parse from text like "15 hours" - reduced by 60%
    const basicHours = Math.round((parseInt(String(row[6])) || 0) * REDUCTION_FACTOR);
    const intermediateHours = Math.round((parseInt(String(row[9])) || 0) * REDUCTION_FACTOR);
    const advancedHours = Math.round((parseInt(String(row[12])) || 0) * REDUCTION_FACTOR);

    // Price (USD) - parse from text like "$29" - reduced by 60%
    const basicPriceUsd = Math.round((parseFloat(String(row[7]).replace(/[^0-9.]/g, '')) || 0) * REDUCTION_FACTOR);
    const intermediatePriceUsd = Math.round((parseFloat(String(row[10]).replace(/[^0-9.]/g, '')) || 0) * REDUCTION_FACTOR);
    const advancedPriceUsd = Math.round((parseFloat(String(row[13]).replace(/[^0-9.]/g, '')) || 0) * REDUCTION_FACTOR);

    // Convert to INR (use basic as display price)
    const priceInr = basicPriceUsd > 0 ? Math.round(basicPriceUsd * USD_TO_INR) : 0;

    // Duration string
    const durations = [basicHours, intermediateHours, advancedHours].filter(d => d > 0);
    const durationStr = durations.length > 0
      ? `${Math.min(...durations)}-${Math.max(...durations)} hours`
      : 'Flexible';

    const slug = slugify(name);
    const modules = buildModules(name, basicTopics, intermediateTopics, advancedTopics, basicHours, intermediateHours, advancedHours);
    const allTopics = [...basicTopics, ...intermediateTopics, ...advancedTopics];

    const mentor = MENTORS[(Number(id) || 0) % MENTORS.length];

    const course = {
      id: id,
      title: name,
      slug: slug,
      category_id: mainCategory === 'technical' ? 2 : (mainCategory === 'non-technical' ? 3 : 1),
      category_name: category || 'General',
      main_category: mainCategory,
      price: priceInr,
      currency: 'INR',
      duration: durationStr,
      level: 'all-levels',
      modes: ['Online', 'Classroom', 'Hybrid', 'Corporate'],
      mode: 'hybrid',
      rating: parseFloat((4.2 + (id % 8) * 0.1).toFixed(1)),
      review_count: 50 + (id % 400),
      mentor_name: mentor.name,
      mentor_expertise: category || mentor.expertise,
      description: `Comprehensive ${name} training program by TrainerMentors. Covers Basic, Intermediate, and Advanced levels with hands-on projects, real-world case studies, and certification preparation.`,
      features: [
        '1:1 Mentorship',
        'Live Projects',
        'Placement Assistance',
        '1-Year Free Repeat',
        'Class Recordings'
      ],
      modules: modules,
      certification: 'Globally Recognized Certificate',
      batch_options: 'Weekday / Weekend / Flexible',
      locations: 'Pune, Mumbai, Nagpur, Hyderabad, Delhi, Bangalore, Chennai, + 20 more cities',
      url: `https://trainermentors.com/${slug}`,
      thumbnail: `https://via.placeholder.com/400x250?text=${encodeURIComponent(name).slice(0, 60)}`,
      is_featured: id <= 8,
      syllabus_outline: allTopics.slice(0, 60),
      syllabus_source: 'enriched_courses_with_syllabus.xlsx',
      price_tiers_usd: {
        basic: basicPriceUsd || null,
        intermediate: intermediatePriceUsd || null,
        advanced: advancedPriceUsd || null
      },
      duration_tiers_hours: {
        basic: basicHours || null,
        intermediate: intermediateHours || null,
        advanced: advancedHours || null
      },
      pricing_note: priceInr > 0 ? null : 'Contact for price or drop email to contact@trainermentors.com'
    };

    courses.push(course);
  }

  console.log(`Generated ${courses.length} courses`);

  // Write output
  const output = `const ALL_COURSES = ${JSON.stringify(courses, null, 2)};\n\nmodule.exports = ALL_COURSES;\n`;
  fs.writeFileSync(OUTPUT_PATH, output, 'utf8');
  console.log(`Written to: ${OUTPUT_PATH}`);
  console.log(`File size: ${(fs.statSync(OUTPUT_PATH).size / 1024 / 1024).toFixed(2)} MB`);

  // Verify sample
  const sample = courses.find(c => c.slug === 'python-development-course');
  if (sample) {
    console.log('\n--- Sample: Python Development Course ---');
    console.log('Price (INR):', sample.price);
    console.log('Duration:', sample.duration);
    console.log('Modules:', sample.modules.length);
    console.log('Basic topics:', sample.modules[0]?.topics?.slice(0, 3));
  }

  const aiSample = courses.find(c => /ai infrastructure/i.test(c.title));
  if (aiSample) {
    console.log('\n--- Sample: AI Infrastructure ---');
    console.log('Title:', aiSample.title);
    console.log('NOT FOUND in Excel - will be standalone if needed');
  } else {
    console.log('\n--- AI Infrastructure Engineer Course ---');
    console.log('Not in Excel (was only in old courses_data.js)');
  }
}

main();
