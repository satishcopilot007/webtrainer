"""
Import all 243 courses from Excel and transform into TrainerMentors database format.
Main Categories: Corporate, Technical, Non-Technical
"""
import json
import re
import os

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')

# Load raw extracted courses
with open('excel_courses_raw.json', 'r', encoding='utf-8') as f:
    raw_courses = json.load(f)

# Category mapping to 3 main categories
CATEGORY_TO_MAIN = {
    # Technical Courses
    'Software Development': 'Technical',
    'Data Science & AI': 'Technical',
    'Cloud & Networking': 'Technical',
    'Full Stack & Web Development': 'Technical',
    'Software Testing & QA': 'Technical',
    'Cyber Security': 'Technical',
    'Big Data & Hadoop': 'Technical',
    'Mobile App Development': 'Technical',
    'Analytics & Tools': 'Technical',
    'RPA & Automation': 'Technical',
    'Emerging Technologies': 'Technical',
    'Software Testing & Others': 'Technical',
    'Master Programs': 'Technical',
    
    # Corporate Courses
    'HR & Management': 'Corporate',
    'SAP': 'Corporate',
    'CRM & ERP': 'Corporate',
    'Language & Soft Skills': 'Corporate',
    'Career Development': 'Corporate',
    'HR & Finance': 'Corporate',
    'Project Management & Certifications': 'Corporate',
    
    # Non-Technical Courses
    'Digital Marketing': 'Non-Technical',
    'Design': 'Non-Technical',
    'Job-Oriented Programs': 'Non-Technical',
}

def make_slug(name):
    """Generate URL-friendly slug from course name"""
    slug = name.lower().strip()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s]+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    slug = slug.strip('-')
    return slug

def parse_level(level_str):
    """Parse level string into standardized level"""
    if not level_str:
        return 'intermediate'
    level_str = level_str.lower()
    if 'beginner to advanced' in level_str or 'beginner-advanced' in level_str:
        return 'all-levels'
    elif 'beginner to intermediate' in level_str:
        return 'beginner'
    elif 'intermediate to advanced' in level_str:
        return 'advanced'
    elif 'advanced' in level_str:
        return 'advanced'
    elif 'beginner' in level_str:
        return 'beginner'
    return 'intermediate'

def parse_price(price_str):
    """Parse price string into numeric value"""
    if not price_str:
        return 14999
    # Try to extract numbers
    numbers = re.findall(r'[\d,]+', str(price_str).replace(',', ''))
    if len(numbers) >= 2:
        # Take average of range
        try:
            low = int(numbers[0])
            high = int(numbers[1])
            return (low + high) // 2
        except:
            pass
    elif len(numbers) == 1:
        try:
            return int(numbers[0])
        except:
            pass
    # Default pricing by category
    return 14999

def parse_duration(duration_str):
    """Parse duration into standardized format"""
    if not duration_str:
        return '8-12 weeks'
    d = str(duration_str).lower()
    # Extract hours
    hours_match = re.search(r'(\d+)[-–](\d+)\s*hours?', d)
    if hours_match:
        low = int(hours_match.group(1))
        high = int(hours_match.group(2))
        avg_hours = (low + high) // 2
        weeks = max(4, avg_hours // 5)  # ~5 hours per week
        return f'{weeks} weeks ({low}-{high} hours)'
    hours_single = re.search(r'(\d+)\s*hours?', d)
    if hours_single:
        hours = int(hours_single.group(1))
        weeks = max(4, hours // 5)
        return f'{weeks} weeks ({hours} hours)'
    if 'contact' in d or 'varies' in d:
        return '8-12 weeks'
    return duration_str

def parse_modes(mode_str):
    """Parse delivery modes into array"""
    if not mode_str:
        return ['Online', 'Classroom', 'Hybrid']
    modes = []
    mode_lower = str(mode_str).lower()
    if 'online' in mode_lower:
        modes.append('Online')
    if 'classroom' in mode_lower or 'offline' in mode_lower:
        modes.append('Classroom')
    if 'hybrid' in mode_lower:
        modes.append('Hybrid')
    if 'corporate' in mode_lower:
        modes.append('Corporate')
    if not modes:
        modes = ['Online', 'Classroom', 'Hybrid']
    return modes

# Default pricing tiers by category
DEFAULT_PRICES = {
    'Software Development': 25000,
    'Data Science & AI': 28000,
    'Cloud & Networking': 22000,
    'Full Stack & Web Development': 30000,
    'Software Testing & QA': 18000,
    'Cyber Security': 25000,
    'Big Data & Hadoop': 28000,
    'Mobile App Development': 22000,
    'Analytics & Tools': 20000,
    'RPA & Automation': 22000,
    'Emerging Technologies': 25000,
    'Software Testing & Others': 18000,
    'Master Programs': 45000,
    'HR & Management': 18000,
    'SAP': 25000,
    'CRM & ERP': 22000,
    'Language & Soft Skills': 12000,
    'Career Development': 10000,
    'HR & Finance': 18000,
    'Project Management & Certifications': 22000,
    'Digital Marketing': 18000,
    'Design': 20000,
    'Job-Oriented Programs': 25000,
}

# Transform all courses
courses = []
for idx, raw in enumerate(raw_courses, 1):
    name = raw['name'].strip()
    category = raw['category']
    main_category = CATEGORY_TO_MAIN.get(category, 'Technical')
    
    # Parse price
    price = parse_price(raw['price'])
    if price == 14999 or 'contact' in str(raw['price']).lower():
        price = DEFAULT_PRICES.get(category, 14999)
    
    course = {
        'id': idx,
        'name': name,
        'slug': make_slug(name),
        'category': category,
        'main_category': main_category,
        'level': parse_level(raw['level']),
        'modes': parse_modes(raw['delivery_mode']),
        'price': price,
        'duration': parse_duration(raw['duration']),
        'description': f"Master {name} with expert-led training. {raw['features'] or 'Comprehensive curriculum with hands-on projects and placement support.'}",
        'certification': raw['certification'] or 'Industry Recognized Certificate',
        'batch_options': raw['batch_options'] or 'Weekday / Weekend / Flexible',
        'locations': raw['locations'] or 'Online + Major Cities',
        'key_features': raw['features'] or '1:1 Mentorship, Live Projects, Placement Assistance',
        'url': raw['url'] or f"https://trainermentors.com/{make_slug(name)}",
        'source': raw['source'] or 'TrainerMentors',
        'thumbnail': f"https://via.placeholder.com/400x250?text={name.replace(' ', '+')[:30]}"
    }
    courses.append(course)

# Save transformed courses
with open(os.path.join(ROOT, 'courses_data.json'), 'w', encoding='utf-8') as f:
    json.dump(courses, f, indent=2, ensure_ascii=False)

# Statistics
print(f"✅ Total courses imported: {len(courses)}")
print(f"\n📊 By Main Category:")
main_cats = {}
for c in courses:
    mc = c['main_category']
    main_cats[mc] = main_cats.get(mc, 0) + 1
for mc, count in sorted(main_cats.items(), key=lambda x: -x[1]):
    print(f"   {mc}: {count}")

print(f"\n📊 By Sub-Category:")
sub_cats = {}
for c in courses:
    sc = c['category']
    sub_cats[sc] = sub_cats.get(sc, 0) + 1
for sc, count in sorted(sub_cats.items(), key=lambda x: -x[1]):
    print(f"   {sc}: {count}")

print(f"\n📊 By Level:")
levels = {}
for c in courses:
    l = c['level']
    levels[l] = levels.get(l, 0) + 1
for l, count in sorted(levels.items(), key=lambda x: -x[1]):
    print(f"   {l}: {count}")

print(f"\n📊 Price Range: ₹{min(c['price'] for c in courses):,} - ₹{max(c['price'] for c in courses):,}")
print(f"\n✅ Saved to courses_data.json")

