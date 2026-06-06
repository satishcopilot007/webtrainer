import openpyxl
import json
import re
from datetime import datetime

# Custom slugify function
def slugify(text):
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text.strip('-')

# Load parsed courses
with open('parsed_courses.json', 'r', encoding='utf-8') as f:
    excel_courses = json.load(f)

# Define category mappings and pricing
CATEGORY_PRICING = {
    'Design': {'min': 3999, 'max': 6999, 'default': 5499},
    'Data Science & AI': {'min': 5999, 'max': 8999, 'default': 7499},
    'Language & Soft Skills': {'min': 2999, 'max': 4999, 'default': 3999},
    'HR & Management': {'min': 3999, 'max': 5999, 'default': 4999},
    'Project Management & Certifications': {'min': 4999, 'max': 7999, 'default': 6499},
    'SAP': {'min': 6999, 'max': 9999, 'default': 8499},
    'Software Development': {'min': 4999, 'max': 8999, 'default': 7499},
    'Cloud & Networking': {'min': 5999, 'max': 8999, 'default': 7499},
    'Cyber Security': {'min': 6999, 'max': 9999, 'default': 8499},
    'Analytics & Tools': {'min': 5999, 'max': 7999, 'default': 6999},
    'Digital Marketing': {'min': 3999, 'max': 5999, 'default': 4999},
    'Job-Oriented Programs': {'min': 4999, 'max': 6999, 'default': 5999},
    'Software Testing & Others': {'min': 4999, 'max': 6999, 'default': 5999},
}

# Duration mapping
CATEGORY_DURATION = {
    'Design': 10,
    'Data Science & AI': 12,
    'Language & Soft Skills': 6,
    'HR & Management': 8,
    'Project Management & Certifications': 8,
    'SAP': 14,
    'Software Development': 12,
    'Cloud & Networking': 10,
    'Cyber Security': 12,
    'Analytics & Tools': 10,
    'Digital Marketing': 8,
    'Job-Oriented Programs': 6,
    'Software Testing & Others': 8,
}

# Transform courses
formatted_courses = []
category_map = {}
course_id = 1

for idx, course in enumerate(excel_courses):
    name = course.get('Course Name', f'Course {idx+1}')
    category = course.get('Category', 'Other')
    
    # Create slug
    slug = slugify(name)
    
    # Get pricing for category
    pricing = CATEGORY_PRICING.get(category, {'default': 5999})
    price = pricing['default']
    
    # Get duration
    duration = CATEGORY_DURATION.get(category, 8)
    
    # Create category ID and mapping
    if category not in category_map:
        category_map[category] = len(category_map) + 1
    category_id = category_map[category]
    
    # Build course object
    formatted_course = {
        'id': course_id,
        'title': name,
        'slug': slug,
        'category_id': category_id,
        'category_name': category,
        'price': price,
        'currency': 'INR',
        'duration_weeks': duration,
        'level': 'intermediate',  # Default level
        'rating': 4.7 + (idx % 3) * 0.1,
        'review_count': 50 + (idx * 3) % 200,
        'mentor_name': f'Expert Mentor {(idx % 5) + 1}',
        'mentor_expertise': 'Industry Expert',
        'description': f'Comprehensive {name} course designed to provide hands-on training and industry insights.',
        'features': [
            'Live Project Training',
            'Certification',
            'Placement Assistance',
            '1-on-1 Mentorship',
            'Class Recordings',
            'EMI Options'
        ],
        'modules': [
            {'title': f'Module 1: {name} Basics', 'topics': 8},
            {'title': f'Module 2: Core Concepts', 'topics': 10},
            {'title': f'Module 3: Advanced Topics', 'topics': 12},
            {'title': f'Module 4: Real-World Projects', 'topics': 8},
            {'title': f'Module 5: Interview Prep & Placement', 'topics': 6}
        ]
    }
    
    formatted_courses.append(formatted_course)
    course_id += 1

# Save formatted courses
with open('formatted_courses.json', 'w', encoding='utf-8') as f:
    json.dump(formatted_courses, f, indent=2, ensure_ascii=False)

# Print summary
print(f"✅ Formatted {len(formatted_courses)} courses\n")
print("=== CATEGORY MAPPING ===\n")
for cat, cat_id in sorted(category_map.items(), key=lambda x: x[1]):
    count = sum(1 for c in formatted_courses if c['category_name'] == cat)
    print(f"{cat_id}. {cat}: {count} courses")

print(f"\n=== SAMPLE FORMATTED COURSE ===\n")
print(json.dumps(formatted_courses[0], indent=2))

print(f"\n✅ Saved formatted courses to formatted_courses.json")
