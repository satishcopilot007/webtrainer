/**
 * Generate SQL insert file for all 897 courses
 * Includes: courses, price tiers, duration tiers, modules with syllabus topics
 */
const fs = require('fs');
const path = require('path');
const courses = require('../courses_data.js');

const OUTPUT = path.join(__dirname, '..', 'deploy-package', 'courses_complete.sql');

let sql = `-- =============================================
-- TRAINERMENTORS COMPLETE COURSE CATALOG - ${courses.length} COURSES
-- Generated: ${new Date().toISOString().split('T')[0]}
-- Includes: Price tiers, Duration tiers, Syllabus modules
-- IMPORT: Run this SQL in phpMyAdmin or MySQL CLI on Hostinger
-- =============================================

-- First, alter courses table to add new columns (if not exist)
ALTER TABLE \`courses\` ADD COLUMN IF NOT EXISTS \`main_category\` VARCHAR(50) DEFAULT 'technical' AFTER \`category_id\`;
ALTER TABLE \`courses\` ADD COLUMN IF NOT EXISTS \`category_name\` VARCHAR(255) DEFAULT '' AFTER \`main_category\`;
ALTER TABLE \`courses\` ADD COLUMN IF NOT EXISTS \`duration\` VARCHAR(100) DEFAULT '' AFTER \`duration_weeks\`;
ALTER TABLE \`courses\` ADD COLUMN IF NOT EXISTS \`price_basic_usd\` DECIMAL(10,2) DEFAULT 0 AFTER \`price\`;
ALTER TABLE \`courses\` ADD COLUMN IF NOT EXISTS \`price_intermediate_usd\` DECIMAL(10,2) DEFAULT 0 AFTER \`price_basic_usd\`;
ALTER TABLE \`courses\` ADD COLUMN IF NOT EXISTS \`price_advanced_usd\` DECIMAL(10,2) DEFAULT 0 AFTER \`price_intermediate_usd\`;
ALTER TABLE \`courses\` ADD COLUMN IF NOT EXISTS \`duration_basic_hours\` INT DEFAULT 0 AFTER \`duration\`;
ALTER TABLE \`courses\` ADD COLUMN IF NOT EXISTS \`duration_intermediate_hours\` INT DEFAULT 0 AFTER \`duration_basic_hours\`;
ALTER TABLE \`courses\` ADD COLUMN IF NOT EXISTS \`duration_advanced_hours\` INT DEFAULT 0 AFTER \`duration_intermediate_hours\`;
ALTER TABLE \`courses\` ADD COLUMN IF NOT EXISTS \`review_count\` INT DEFAULT 50 AFTER \`total_reviews\`;
ALTER TABLE \`courses\` ADD COLUMN IF NOT EXISTS \`mentor_name\` VARCHAR(255) DEFAULT '' AFTER \`mentor_id\`;

-- =============================================
-- CATEGORIES (ensure they exist)
-- =============================================
INSERT INTO \`categories\` (id, name, slug, description, is_active) VALUES
(1, 'Corporate Courses', 'corporate', 'Corporate training programs for professionals', 1),
(2, 'Technical Courses', 'technical', 'Industry-leading technical training', 1),
(3, 'Non-Technical Courses', 'non-technical', 'Creative and career growth courses', 1)
ON DUPLICATE KEY UPDATE name=VALUES(name), slug=VALUES(slug), description=VALUES(description);

-- =============================================
-- DEFAULT MENTOR
-- =============================================
INSERT IGNORE INTO \`users\` (name, email, password, phone, role, is_active)
VALUES ('TrainerMentors Admin', 'courses@trainermentors.com', '$2y$10$H8S4RLB2WXPqXbE0C8h1pO6H9k5Q2R3L9V8S7M6N5P0Q9R8S7T', '+91-9999999999', 'mentor', 1);

SET @mentor_id = (SELECT id FROM users WHERE email = 'courses@trainermentors.com' LIMIT 1);

-- =============================================
-- CLEAR EXISTING DATA
-- =============================================
DELETE FROM \`course_modules\`;
DELETE FROM \`courses\`;

-- =============================================
-- INSERT ALL ${courses.length} COURSES
-- =============================================
`;

function esc(val) {
  if (val === null || val === undefined) return 'NULL';
  return "'" + String(val).replace(/'/g, "\\'").replace(/\\/g, "\\\\") + "'";
}

// Generate course inserts in batches
const BATCH_SIZE = 50;
for (let i = 0; i < courses.length; i += BATCH_SIZE) {
  const batch = courses.slice(i, i + BATCH_SIZE);
  
  sql += `\n-- Courses ${i + 1} to ${Math.min(i + BATCH_SIZE, courses.length)}\n`;
  sql += `INSERT INTO \`courses\` (id, title, slug, description, category_id, main_category, category_name, mentor_id, mentor_name, price, price_basic_usd, price_intermediate_usd, price_advanced_usd, duration, duration_weeks, duration_basic_hours, duration_intermediate_hours, duration_advanced_hours, level, mode, certification, batch_options, locations, thumbnail, rating, total_reviews, is_active) VALUES\n`;
  
  const rows = batch.map((c, idx) => {
    const catId = c.main_category === 'corporate' ? 1 : (c.main_category === 'technical' ? 2 : 3);
    const priceTiers = c.price_tiers_usd || {};
    const durTiers = c.duration_tiers_hours || {};
    const durationWeeks = durTiers.advanced ? Math.ceil(durTiers.advanced / 5) : 8;
    
    return `(${c.id}, ${esc(c.title)}, ${esc(c.slug)}, ${esc(c.description)}, ${catId}, ${esc(c.main_category)}, ${esc(c.category_name)}, @mentor_id, ${esc(c.mentor_name)}, ${c.price || 0}, ${priceTiers.basic || 0}, ${priceTiers.intermediate || 0}, ${priceTiers.advanced || 0}, ${esc(c.duration)}, ${durationWeeks}, ${durTiers.basic || 0}, ${durTiers.intermediate || 0}, ${durTiers.advanced || 0}, ${esc(c.level)}, ${esc(c.modes ? c.modes.join(', ') : 'Online, Classroom, Hybrid')}, ${esc(c.certification)}, ${esc(c.batch_options)}, ${esc(c.locations)}, ${esc(c.thumbnail)}, ${c.rating || 4.5}, ${c.review_count || 50}, 1)`;
  });
  
  sql += rows.join(',\n') + ';\n';
}

// Generate course modules (syllabus)
sql += `\n\n-- =============================================\n`;
sql += `-- COURSE MODULES (Syllabus - Basic/Intermediate/Advanced)\n`;
sql += `-- =============================================\n\n`;

let moduleId = 1;
for (const c of courses) {
  if (!c.modules || c.modules.length === 0) continue;
  
  sql += `-- ${c.title}\n`;
  sql += `INSERT INTO \`course_modules\` (id, course_id, title, description, sequence) VALUES\n`;
  
  const moduleRows = c.modules.map((m, idx) => {
    const topics = m.topics ? m.topics.join(' | ') : '';
    const desc = `Duration: ${m.duration_hours || 0} hours | Level: ${m.level || 'general'} | Topics: ${topics}`;
    const row = `(${moduleId}, ${c.id}, ${esc(m.title)}, ${esc(desc.substring(0, 60000))}, ${m.order || idx + 1})`;
    moduleId++;
    return row;
  });
  
  sql += moduleRows.join(',\n') + ';\n\n';
}

sql += `\n-- =============================================\n`;
sql += `-- VERIFICATION\n`;
sql += `-- =============================================\n`;
sql += `SELECT COUNT(*) AS total_courses FROM courses;\n`;
sql += `SELECT main_category, COUNT(*) AS count FROM courses GROUP BY main_category;\n`;
sql += `SELECT COUNT(*) AS total_modules FROM course_modules;\n`;

fs.writeFileSync(OUTPUT, sql, 'utf8');
const sizeMB = (fs.statSync(OUTPUT).size / 1024 / 1024).toFixed(2);
console.log(`SQL generated: ${OUTPUT}`);
console.log(`Size: ${sizeMB} MB`);
console.log(`Courses: ${courses.length}`);
console.log(`Modules: ${moduleId - 1}`);
