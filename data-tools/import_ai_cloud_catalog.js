/**
 * Import AI_Cloud_Programming_Course_Catalog_2025.xlsx into courses_data.js
 * Merges new courses with existing Excel-derived catalog.
 * Avoids duplicates by slug/title matching.
 */

const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const ROOT = path.join(__dirname, '..');
const NEW_EXCEL = path.join(ROOT, 'AI_Cloud_Programming_Course_Catalog_2025.xlsx');
const COURSES_FILE = path.join(ROOT, 'courses_data.js');

const USD_TO_INR = 83;
const REDUCTION_FACTOR = 0.4; // 60% reduction (keep 40%)

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseSyllabus(text) {
  if (!text || typeof text !== 'string') return [];
  return text
    .split('\n')
    .map(line => line.replace(/^\s*\d+\.\s*/, '').trim())
    .filter(line => line.length > 0);
}

function parsePrice(val) {
  if (!val) return 0;
  const s = String(val).replace(/[$,\s]/g, '');
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

const MENTORS = [
  { name: 'Dr. Priya Sharma', expertise: 'AI/ML' },
  { name: 'Rajesh Kumar', expertise: 'Cloud' },
  { name: 'Anita Desai', expertise: 'Data Science' },
  { name: 'Vikram Singh', expertise: 'DevOps' },
  { name: 'Meera Patel', expertise: 'Management' },
  { name: 'Suresh Rao', expertise: 'Development' },
  { name: 'Kavitha Nair', expertise: 'Design' },
  { name: 'Arjun Mehta', expertise: 'Security' },
];

function main() {
  // Load existing courses
  const existingCourses = require(COURSES_FILE);
  const existingSlugs = new Set(existingCourses.map(c => slugify(c.title)));
  const maxExistingId = existingCourses.reduce((max, c) => Math.max(max, Number(c.id) || 0), 0);
  console.log(`Existing courses: ${existingCourses.length}, max ID: ${maxExistingId}`);

  // Read new Excel
  console.log('Reading:', NEW_EXCEL);
  const wb = xlsx.readFile(NEW_EXCEL);
  const ws = wb.Sheets['📚 All Courses'];
  const allRows = xlsx.utils.sheet_to_json(ws, { header: 1, defval: '' });

  // Data starts at row 3 (0-indexed), header is row 2
  const dataRows = allRows.slice(3);
  console.log(`New Excel data rows: ${dataRows.length}`);

  // Column mapping (from row 2):
  // 0: Course ID, 1: Domain, 2: Category, 3: Course Name, 4: Target Audience
  // 5: Course Description, 6: Prerequisites, 7: Certification
  // 8: Basic Syllabus, 9: Intermediate Syllabus, 10: Advanced Syllabus
  // 11: Basic Duration (Hrs), 12: Intermediate Duration (Hrs), 13: Advanced Duration (Hrs)
  // 14: Basic Price ($), 15: Intermediate Price ($), 16: Advanced Price ($)

  let added = 0;
  let skipped = 0;
  let nextId = maxExistingId + 1;
  const newCourses = [];

  for (const row of dataRows) {
    const courseId = String(row[0] || '').trim();
    const domain = String(row[1] || '').trim();
    const category = String(row[2] || '').trim();
    const name = String(row[3] || '').trim();
    if (!name) continue;

    const slug = slugify(name);

    // Skip if already exists
    if (existingSlugs.has(slug)) {
      skipped++;
      continue;
    }

    const targetAudience = String(row[4] || '').trim();
    const description = String(row[5] || '').trim();
    const prerequisites = String(row[6] || '').trim();
    const hasCertification = String(row[7] || '').toLowerCase().includes('yes');

    const basicTopics = parseSyllabus(row[8]);
    const intermediateTopics = parseSyllabus(row[9]);
    const advancedTopics = parseSyllabus(row[10]);

    const basicHours = Math.round((Number(row[11]) || 0) * REDUCTION_FACTOR);
    const intermediateHours = Math.round((Number(row[12]) || 0) * REDUCTION_FACTOR);
    const advancedHours = Math.round((Number(row[13]) || 0) * REDUCTION_FACTOR);

    const basicPriceUsd = Math.round((parsePrice(row[14])) * REDUCTION_FACTOR);
    const intermediatePriceUsd = Math.round((parsePrice(row[15])) * REDUCTION_FACTOR);
    const advancedPriceUsd = Math.round((parsePrice(row[16])) * REDUCTION_FACTOR);

    const priceInr = basicPriceUsd > 0 ? Math.round(basicPriceUsd * USD_TO_INR) : 0;

    const durations = [basicHours, intermediateHours, advancedHours].filter(d => d > 0);
    const durationStr = durations.length > 0
      ? `${Math.min(...durations)}-${Math.max(...durations)} hours`
      : 'Flexible';

    // Build modules
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

    const allTopics = [...basicTopics, ...intermediateTopics, ...advancedTopics];
    const mentor = MENTORS[nextId % MENTORS.length];

    // Determine main_category
    let mainCategory = 'technical';
    const domainLower = domain.toLowerCase();
    if (domainLower.includes('cloud') || domainLower.includes('azure') || domainLower.includes('aws') || domainLower.includes('gcp')) {
      mainCategory = 'technical';
    }

    const course = {
      id: nextId,
      title: name,
      slug: slug,
      category_id: 2, // technical
      category_name: category || domain || 'Technology',
      main_category: mainCategory,
      domain: domain,
      price: priceInr,
      currency: 'INR',
      duration: durationStr,
      level: 'all-levels',
      target_audience: targetAudience,
      prerequisites: prerequisites,
      modes: ['Online', 'Classroom', 'Hybrid', 'Corporate'],
      mode: 'hybrid',
      rating: parseFloat((4.3 + (nextId % 7) * 0.1).toFixed(1)),
      review_count: 60 + (nextId % 300),
      mentor_name: mentor.name,
      mentor_expertise: domain || mentor.expertise,
      description: description || `Comprehensive ${name} training program by TrainerMentors.`,
      features: [
        '1:1 Mentorship',
        'Live Projects',
        'Placement Assistance',
        '1-Year Free Repeat',
        'Class Recordings'
      ],
      modules: modules,
      certification: hasCertification ? 'Globally Recognized Certificate' : 'Completion Certificate',
      batch_options: 'Weekday / Weekend / Flexible',
      locations: 'Pune, Mumbai, Nagpur, Hyderabad, Delhi, Bangalore, Chennai, + 20 more cities',
      url: `https://trainermentors.com/${slug}`,
      thumbnail: `https://via.placeholder.com/400x250?text=${encodeURIComponent(name).slice(0, 60)}`,
      is_featured: false,
      syllabus_outline: allTopics.slice(0, 60),
      syllabus_source: 'AI_Cloud_Programming_Course_Catalog_2025.xlsx',
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

    newCourses.push(course);
    existingSlugs.add(slug);
    nextId++;
    added++;
  }

  console.log(`\nResults:`);
  console.log(`  Added: ${added}`);
  console.log(`  Skipped (already exist): ${skipped}`);

  // Merge and write
  const merged = [...existingCourses, ...newCourses];
  console.log(`  Total courses now: ${merged.length}`);

  const output = `const ALL_COURSES = ${JSON.stringify(merged, null, 2)};\n\nmodule.exports = ALL_COURSES;\n`;
  fs.writeFileSync(COURSES_FILE, output, 'utf8');
  console.log(`\nWritten to: ${COURSES_FILE}`);
  console.log(`File size: ${(fs.statSync(COURSES_FILE).size / 1024 / 1024).toFixed(2)} MB`);

  // Show samples
  if (newCourses.length > 0) {
    const s = newCourses[0];
    console.log(`\n--- Sample: ${s.title} ---`);
    console.log(`  Domain: ${s.domain}`);
    console.log(`  Price: ₹${s.price} (Basic $${s.price_tiers_usd.basic})`);
    console.log(`  Duration: ${s.duration}`);
    console.log(`  Modules: ${s.modules.length}`);
    console.log(`  Basic topics[0-2]:`, s.modules[0]?.topics?.slice(0, 3));
  }
}

main();
