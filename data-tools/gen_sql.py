"""
Generate SQL INSERT statements for all 243 courses from courses_data.json.
Creates a complete database.sql patch file for Hostinger deployment.
"""
import json
import re
import os

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')

with open(os.path.join(ROOT, 'courses_data.json'), 'r', encoding='utf-8') as f:
    courses = json.load(f)

def esc(s):
    """Escape string for MySQL"""
    if s is None:
        return 'NULL'
    s = str(s).replace('\\', '\\\\').replace("'", "''").replace('\n', ' ').replace('\r', '')
    return f"'{s}'"

lines = []
lines.append("-- =============================================")
lines.append("-- TRAINERMENTORS COURSE CATALOG - 243 COURSES")
lines.append("-- Generated from Excel import - May 2026")
lines.append("-- =============================================")
lines.append("")
lines.append("-- Clear existing categories and re-insert")
lines.append("DELETE FROM `categories`;")
lines.append("")
lines.append("-- Insert 3 main categories")
lines.append("INSERT INTO `categories` (id, name, slug, description, is_active) VALUES")
lines.append("(1, 'Corporate Courses', 'corporate', 'HR & Management, SAP, CRM & ERP, Language & Soft Skills, Project Management - Corporate training programs for professionals', 1),")
lines.append("(2, 'Technical Courses', 'technical', 'Software Development, Data Science & AI, Cloud Computing, Cyber Security, Full Stack - Industry-leading technical training', 1),")
lines.append("(3, 'Non-Technical Courses', 'non-technical', 'Digital Marketing, Graphic Design, UI/UX Design, Job-Oriented Programs - Creative and marketing courses for career growth', 1)")
lines.append("ON DUPLICATE KEY UPDATE name=VALUES(name), slug=VALUES(slug), description=VALUES(description);")
lines.append("")

# Add mentor (course creator)
lines.append("-- Insert default mentor if not exists")
lines.append("INSERT IGNORE INTO `users` (name, email, password, phone, role, is_active)")
lines.append("VALUES ('TrainerMentors Admin', 'courses@trainermentors.com', '$2y$10$H8S4RLB2WXPqXbE0C8h1pO6H9k5Q2R3L9V8S7M6N5P0Q9R8S7T', '+91-9999999999', 'mentor', 1);")
lines.append("")
lines.append("-- Get mentor ID for course inserts")
lines.append("SET @mentor_id = (SELECT id FROM users WHERE email = 'courses@trainermentors.com' LIMIT 1);")
lines.append("")

# Main categories
CAT_ID = {'corporate': 1, 'technical': 2, 'non-technical': 3}

lines.append("-- Clear existing courses")
lines.append("DELETE FROM `courses`;")
lines.append("")
lines.append("-- Insert all 243 courses")
lines.append("INSERT INTO `courses` (id, title, slug, description, category_id, mentor_id, price, level, mode, certification, batch_options, locations, thumbnail, is_active) VALUES")

course_rows = []
for c in courses:
    cat_id = CAT_ID.get(c['main_category'].lower(), 2)
    modes = ', '.join(c.get('modes', ['Online', 'Classroom', 'Hybrid']))
    row = f"({c['id']}, {esc(c['name'])}, {esc(c['slug'])}, {esc(c['description'])}, {cat_id}, @mentor_id, {c['price']}, {esc(c['level'])}, {esc(modes)}, {esc(c['certification'])}, {esc(c['batch_options'])}, {esc(c['locations'])}, {esc(c['thumbnail'])}, 1)"
    course_rows.append(row)

lines.append(',\n'.join(course_rows) + ';')
lines.append("")
lines.append(f"-- Total courses inserted: {len(courses)}")

sql_content = '\n'.join(lines)

with open('backend-php/courses_insert.sql', 'w', encoding='utf-8') as f:
    f.write(sql_content)

print(f"✅ Generated SQL for {len(courses)} courses")
print(f"   Saved to backend-php/courses_insert.sql")
print(f"   Corporate: {sum(1 for c in courses if c['main_category'].lower() == 'corporate')}")
print(f"   Technical: {sum(1 for c in courses if c['main_category'].lower() == 'technical')}")
print(f"   Non-Technical: {sum(1 for c in courses if c['main_category'].lower() == 'non-technical')}")

