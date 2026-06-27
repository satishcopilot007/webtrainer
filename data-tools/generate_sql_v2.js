/**
 * Generate a MySQL-compatible SQL file (no ALTER TABLE IF NOT EXISTS)
 * Works with Hostinger shared hosting MySQL/MariaDB
 */
const fs = require('fs');
const path = require('path');
const courses = require('../courses_data.js');

const OUTPUT = path.join(__dirname, '..', 'deploy-package', 'courses_complete.sql');

function esc(val) {
  if (val === null || val === undefined) return '';
  return String(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

let sql = `-- =============================================
-- TRAINERMENTORS COURSE CATALOG - ${courses.length} COURSES
-- Generated: ${new Date().toISOString().split('T')[0]}
-- Compatible with MySQL 5.7+ / MariaDB 10+
-- Import in phpMyAdmin on Hostinger
-- =============================================

-- =============================================
-- CATEGORIES
-- =============================================
DELETE FROM \`categories\`;
INSERT INTO \`categories\` (id, name, slug, description, is_active) VALUES
(1, 'Corporate Courses', 'corporate', 'Corporate training programs for professionals', 1),
(2, 'Technical Courses', 'technical', 'Industry-leading technical training', 1),
(3, 'Non-Technical Courses', 'non-technical', 'Creative and career growth courses', 1);

-- =============================================
-- DEFAULT MENTOR
-- =============================================
INSERT IGNORE INTO \`users\` (name, email, password, phone, role, is_active)
VALUES ('TrainerMentors Admin', 'courses@trainermentors.com', '$2y$10$H8S4RLB2WXPqXbE0C8h1pO6H9k5Q2R3L', '+91-9999999999', 'mentor', 1);

SET @mentor_id = (SELECT id FROM \`users\` WHERE email = 'courses@trainermentors.com' LIMIT 1);

-- =============================================
-- CLEAR OLD DATA
-- =============================================
DELETE FROM \`course_modules\`;
DELETE FROM \`courses\`;

-- =============================================
-- INSERT ${courses.length} COURSES
-- =============================================
`;

// Insert courses in batches
const BATCH = 25;
for (let i = 0; i < courses.length; i += BATCH) {
  const batch = courses.slice(i, i + BATCH);
  sql += `\n-- Courses ${i + 1} to ${Math.min(i + BATCH, courses.length)}\n`;
  sql += `INSERT INTO \`courses\` (id, title, slug, description, category_id, mentor_id, price, level, mode, certification, batch_options, locations, thumbnail, rating, total_reviews, is_active) VALUES\n`;

  const rows = batch.map(c => {
    const catId = c.main_category === 'corporate' ? 1 : (c.main_category === 'technical' ? 2 : 3);
    return `(${c.id}, '${esc(c.title)}', '${esc(c.slug)}', '${esc(c.description)}', ${catId}, @mentor_id, ${c.price || 0}, '${esc(c.level)}', '${esc(c.modes ? c.modes.join(", ") : "Online")}', '${esc(c.certification)}', '${esc(c.batch_options)}', '${esc(c.locations)}', '${esc(c.thumbnail)}', ${c.rating || 4.5}, ${c.review_count || 50}, 1)`;
  });

  sql += rows.join(',\n') + ';\n';
}

// Insert modules (syllabus)
sql += `\n\n-- =============================================\n`;
sql += `-- COURSE MODULES (${courses.reduce((sum, c) => sum + (c.modules ? c.modules.length : 0), 0)} modules)\n`;
sql += `-- =============================================\n`;

let moduleId = 1;
for (const c of courses) {
  if (!c.modules || c.modules.length === 0) continue;

  sql += `\nINSERT INTO \`course_modules\` (id, course_id, title, description, sequence) VALUES\n`;

  const mrows = c.modules.map((m, idx) => {
    const topics = m.topics ? m.topics.join(' | ') : '';
    const desc = `Duration: ${m.duration_hours || 0} hours | Level: ${m.level || 'general'} | Topics: ${topics}`;
    const row = `(${moduleId}, ${c.id}, '${esc(m.title)}', '${esc(desc.substring(0, 10000))}', ${m.order || idx + 1})`;
    moduleId++;
    return row;
  });

  sql += mrows.join(',\n') + ';\n';
}

sql += `\n-- =============================================\n`;
sql += `-- VERIFY IMPORT\n`;
sql += `-- =============================================\n`;
sql += `SELECT COUNT(*) AS total_courses FROM \`courses\`;\n`;
sql += `SELECT COUNT(*) AS total_modules FROM \`course_modules\`;\n`;

fs.writeFileSync(OUTPUT, sql, 'utf8');
const sizeMB = (fs.statSync(OUTPUT).size / 1024 / 1024).toFixed(2);
console.log(`SQL generated: ${OUTPUT}`);
console.log(`Size: ${sizeMB} MB`);
console.log(`Courses: ${courses.length}`);
console.log(`Modules: ${moduleId - 1}`);
