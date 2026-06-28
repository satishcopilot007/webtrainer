const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const root = path.resolve(__dirname, '..');
const filePath = path.join(root, 'enriched_courses_with_syllabus.xlsx');
const outPath = path.join(root, 'excel_syllabus_enriched.json');

function safe(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function toNumber(value) {
  const n = Number(String(value ?? '').replace(/[^0-9.\-]/g, ''));
  return Number.isFinite(n) ? n : null;
}

function parseTopics(block) {
  const text = String(block ?? '').replace(/\r/g, '').trim();
  if (!text) return [];
  return text
    .split('\n')
    .map((line) => line.replace(/^\s*\d+[.)]?\s*/, '').trim())
    .filter(Boolean);
}

const wb = xlsx.readFile(filePath);
const ws = wb.Sheets['All Courses Enriched'] || wb.Sheets[wb.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(ws, { header: 1, defval: '' });

if (rows.length < 3) {
  throw new Error('Workbook does not contain expected data rows.');
}

const header = rows[1].map((h) => safe(h));
const dataRows = rows.slice(2);

const index = (name) => header.findIndex((h) => h.toLowerCase() === name.toLowerCase());

const idx = {
  courseId: index('Course ID'),
  courseName: index('Course Name'),
  category: index('Category'),
  mainCategory: index('Main Category'),
  syllabusSource: index('Syllabus Source'),
  moduleCount: index('Module Count'),
  existingSyllabus: index('Existing Syllabus Details'),
  basicSyllabus: index('Basic Level Syllabus (10 Topics)'),
  intermediateSyllabus: index('Intermediate Level Syllabus (10 Topics)'),
  advancedSyllabus: index('Advanced Level Syllabus (10 Topics)'),
  basicDuration: index('Basic Duration (Hours)'),
  intermediateDuration: index('Intermediate Duration (Hours)'),
  advancedDuration: index('Advanced Duration (Hours)'),
  basicPrice: index('Basic Price (USD)'),
  intermediatePrice: index('Intermediate Price (USD)'),
  advancedPrice: index('Advanced Price (USD)')
};

const enriched = [];

for (const row of dataRows) {
  const courseName = safe(row[idx.courseName]);
  if (!courseName) continue;

  const basicSyllabus = parseTopics(row[idx.basicSyllabus]);
  const intermediateSyllabus = parseTopics(row[idx.intermediateSyllabus]);
  const advancedSyllabus = parseTopics(row[idx.advancedSyllabus]);

  enriched.push({
    course_id: safe(row[idx.courseId]),
    course_name: courseName,
    category: safe(row[idx.category]),
    main_category: safe(row[idx.mainCategory]),
    syllabus_source: safe(row[idx.syllabusSource]),
    module_count: toNumber(row[idx.moduleCount]),
    existing_syllabus_details: safe(row[idx.existingSyllabus]),
    basic_syllabus: basicSyllabus,
    intermediate_syllabus: intermediateSyllabus,
    advanced_syllabus: advancedSyllabus,
    basic_duration_hours: toNumber(row[idx.basicDuration]),
    intermediate_duration_hours: toNumber(row[idx.intermediateDuration]),
    advanced_duration_hours: toNumber(row[idx.advancedDuration]),
    basic_price_usd: toNumber(row[idx.basicPrice]),
    intermediate_price_usd: toNumber(row[idx.intermediatePrice]),
    advanced_price_usd: toNumber(row[idx.advancedPrice])
  });
}

fs.writeFileSync(outPath, JSON.stringify(enriched, null, 2), 'utf8');
console.log(JSON.stringify({ output: outPath, total: enriched.length }, null, 2));
